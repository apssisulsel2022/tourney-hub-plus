import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronRight, MapPin, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { matchService } from "@/lib/matches";
import { playerService } from "@/modules/players/services/playerService";
import { SwipeableRow } from "@/components/public/SwipeableRow";

const formatKickoff = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function PublicTournamentHome() {
  const matchesQuery = useQuery({
    queryKey: ["public", "home", "matches"],
    queryFn: async () => {
      const res = await matchService.list({ page: 1, limit: 60, sort: "date_asc" });
      return res.items;
    },
    refetchInterval: 15000,
    staleTime: 8000,
  });

  const scorersQuery = useQuery({
    queryKey: ["public", "home", "scorers"],
    queryFn: async () => {
      const res = await playerService.getPlayers(1, 200);
      return res.items;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const now = Date.now();

  const upcoming = useMemo(() => {
    const all = matchesQuery.data ?? [];
    return all
      .filter((m) => m.status === "upcoming" && new Date(m.dateTime).getTime() >= now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 5);
  }, [matchesQuery.data, now]);

  const latestResults = useMemo(() => {
    const all = matchesQuery.data ?? [];
    return all
      .filter((m) => m.status === "completed" && new Date(m.dateTime).getTime() <= now)
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 5);
  }, [matchesQuery.data, now]);

  const topScorers = useMemo(() => {
    const players = scorersQuery.data ?? [];
    return [...players]
      .sort((a, b) => (b.stats?.goals ?? 0) - (a.stats?.goals ?? 0))
      .slice(0, 10)
      .map((p) => ({ id: p.id, name: p.name, team: p.clubName, goals: p.stats?.goals ?? 0 }));
  }, [scorersQuery.data]);

  return (
    <PublicLayout
      seo={{
        title: "Premier Cup 2026 · KickOff",
        description: "Official tournament hub: schedule, results, standings, teams, players, and live statistics.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-widest">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Premier Cup 2026
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">Follow every match, every goal, in real time.</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/80">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" /> New York, USA</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" /> Mar 1 – Apr 15, 2026</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" /> 8 Teams</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/public/matches"
                  className="h-12 min-h-[48px] inline-flex items-center justify-center rounded-2xl px-5 font-black bg-white text-secondary shadow-lg shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View schedule <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
                </Link>
                <Link
                  to="/public/standings"
                  className="h-12 min-h-[48px] inline-flex items-center justify-center rounded-2xl px-5 font-black border border-white/20 bg-white/10 text-white hover:bg-white/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Standings
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:max-w-[420px]">
              {[
                { label: "Upcoming", value: upcoming.length ? String(upcoming.length) : "—" },
                { label: "Results", value: latestResults.length ? String(latestResults.length) : "—" },
                { label: "Top Scorers", value: topScorers.length ? String(topScorers.length) : "—" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SwipeableRow title="Upcoming Matches" subtitle="Next kickoffs across all venues">
            {matchesQuery.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[108px] rounded-2xl" />)
              : upcoming.map((m) => (
                  <Link key={m.id} to={`/public/matches/${m.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
                    <MatchCard
                      homeTeam={m.home.name}
                      awayTeam={m.away.name}
                      homeScore={m.status === "upcoming" ? undefined : m.score.home}
                      awayScore={m.status === "upcoming" ? undefined : m.score.away}
                      time={formatKickoff(m.dateTime)}
                      venue={`${m.venue.name}, ${m.venue.city}`}
                      status={m.status}
                      tournament={m.tournament}
                    />
                  </Link>
                ))}
          </SwipeableRow>

          <SwipeableRow title="Latest Results" subtitle="Most recent completed matches">
            {matchesQuery.isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[108px] rounded-2xl" />)
              : latestResults.map((m) => (
                  <Link key={m.id} to={`/public/matches/${m.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
                    <MatchCard
                      homeTeam={m.home.name}
                      awayTeam={m.away.name}
                      homeScore={m.score.home}
                      awayScore={m.score.away}
                      time="FT"
                      venue={`${m.venue.name}, ${m.venue.city}`}
                      status={m.status}
                      tournament={m.tournament}
                    />
                  </Link>
                ))}
          </SwipeableRow>
        </div>

        <aside className="space-y-6">
          <div className="bg-card rounded-3xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black tracking-tight">Top Scorers</h2>
              <Link to="/public/players" className="text-sm font-bold text-secondary hover:underline">
                View all
              </Link>
            </div>
            {scorersQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {topScorers.map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/public/players/${p.id}`}
                    className="flex items-center justify-between gap-3 py-3 rounded-xl hover:bg-muted/30 px-2 -mx-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={idx === 0 ? "h-8 w-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-xs font-black shrink-0" : "h-8 w-8 rounded-xl bg-muted text-muted-foreground flex items-center justify-center text-xs font-black shrink-0"}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.team}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black tabular-nums text-secondary">{p.goals}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}
