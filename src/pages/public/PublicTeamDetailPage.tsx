import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, Shield, Swords, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { teamService } from "@/modules/teams/services/teamService";
import { matchService } from "@/lib/matches";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/public/ShareButton";
import { MatchCard } from "@/components/dashboard/MatchCard";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function PublicTeamDetailPage() {
  const { id } = useParams();

  const teamQuery = useQuery({
    queryKey: ["public", "teams", "detail", id],
    queryFn: async () => {
      if (!id) return undefined;
      return teamService.getTeamById(id);
    },
    staleTime: 20000,
  });

  const matchesQuery = useQuery({
    queryKey: ["public", "teams", "matches", id],
    queryFn: async () => {
      const res = await matchService.list({ page: 1, limit: 120, sort: "date_desc" });
      return res.items;
    },
    enabled: !!teamQuery.data,
    staleTime: 12000,
  });

  const team = teamQuery.data;

  const relatedMatches = useMemo(() => {
    if (!team) return [];
    const items = matchesQuery.data ?? [];
    return items
      .filter((m) => m.home.name === team.name || m.away.name === team.name)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 6);
  }, [matchesQuery.data, team]);

  if (!id) return null;

  if (teamQuery.isLoading) {
    return (
      <PublicLayout seo={{ title: "Team · Premier Cup 2026", description: "Team profile" }} tournamentName="Premier Cup 2026">
        <div className="space-y-6 max-w-6xl mx-auto">
          <Skeleton className="h-10 w-52 rounded-xl" />
          <Skeleton className="h-[220px] w-full rounded-3xl" />
          <Skeleton className="h-[460px] w-full rounded-3xl" />
        </div>
      </PublicLayout>
    );
  }

  if (!team) {
    return (
      <PublicLayout seo={{ title: "Team Not Found · Premier Cup 2026", description: "Team profile not found" }} tournamentName="Premier Cup 2026">
        <div className="max-w-3xl mx-auto bg-card rounded-3xl border p-8 text-center">
          <div className="text-xl font-black">Team not found</div>
          <div className="text-sm text-muted-foreground mt-2">The requested team does not exist.</div>
          <div className="mt-6">
            <Link to="/public/teams" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-2xl px-5 font-black bg-secondary text-white">
              Browse teams
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const winRate = team.stats.matchesPlayed > 0 ? Math.round((team.stats.wins / team.stats.matchesPlayed) * 100) : 0;
  const gd = team.stats.goalsScored - team.stats.goalsConceded;
  const shareUrl = `${window.location.origin}/public/teams/${team.id}`;

  return (
    <PublicLayout
      seo={{
        title: `${team.name} · Teams · Premier Cup 2026`,
        description: `Team profile, roster, and performance for ${team.name}.`,
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/public/teams" className="h-11 w-11 rounded-2xl border bg-card flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to teams</span>
            </Link>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Team</div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{team.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton title={`${team.name} · Premier Cup 2026`} text="Team profile and roster" url={shareUrl} />
          </div>
        </div>

        <section className="bg-card rounded-3xl border p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-14 w-14 rounded-3xl bg-muted flex items-center justify-center text-lg font-black text-secondary shrink-0">
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-black truncate">{team.name}</div>
                      <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{team.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {team.city} · Coach {team.coachName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" aria-hidden="true" /> {team.city}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary" aria-hidden="true" /> Founded {new Date(team.foundingDate).getFullYear()}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary" aria-hidden="true" /> {team.roster.length} players</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-[340px]">
              {[
                { label: "Played", value: team.stats.matchesPlayed },
                { label: "Win Rate", value: `${winRate}%` },
                { label: "Goals", value: `${team.stats.goalsScored}` },
                { label: "GD", value: gd >= 0 ? `+${gd}` : `${gd}` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border bg-muted/20 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</div>
                  <div className="text-lg font-black tabular-nums">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2"><Shield className="h-5 w-5 text-secondary" aria-hidden="true" /> Roster</h2>
              <Badge variant="secondary" className="rounded-2xl font-black">{team.roster.length} players</Badge>
            </div>

            <div className="sm:hidden space-y-3">
              {team.roster.map((p) => (
                <div key={p.id} className="rounded-2xl border bg-background/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-black truncate">{p.firstName} {p.lastName}</div>
                      <div className="text-xs font-bold text-muted-foreground">{p.position} · Age {p.age}</div>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center font-black tabular-nums">{p.jerseyNumber}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[520px]" aria-label="Team roster">
                <thead className="bg-muted/40 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Player</th>
                    <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Position</th>
                    <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {team.roster.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-bold">{p.firstName} {p.lastName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-medium">{p.position}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{p.jerseyNumber}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{p.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2"><Swords className="h-5 w-5 text-secondary" aria-hidden="true" /> Recent Matches</h2>
            </div>

            {matchesQuery.isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[108px] rounded-2xl" />
                ))}
              </div>
            ) : relatedMatches.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent matches found.</div>
            ) : (
              <div className="space-y-3">
                {relatedMatches.map((m) => (
                  <Link key={m.id} to={`/public/matches/${m.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <MatchCard
                      homeTeam={m.home.name}
                      awayTeam={m.away.name}
                      homeScore={m.status === "upcoming" ? undefined : m.score.home}
                      awayScore={m.status === "upcoming" ? undefined : m.score.away}
                      time={m.status === "completed" ? "FT" : formatDate(m.dateTime)}
                      venue={`${m.venue.name}, ${m.venue.city}`}
                      status={m.status}
                      tournament={m.tournament}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
