import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { teamService } from "@/modules/teams/services/teamService";
import { Team } from "@/modules/teams/types/team";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/public/ShareButton";
import { cn } from "@/lib/utils";

export default function PublicTeamsPage() {
  const [search, setSearch] = useState("");

  const teamsQuery = useQuery<Team[]>({
    queryKey: ["public", "teams", { search }],
    queryFn: () => teamService.getTeams(),
    refetchInterval: 60000,
    staleTime: 20000,
  });

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const teams = teamsQuery.data ?? [];
    if (!s) return teams;
    return teams.filter((t) => t.name.toLowerCase().includes(s) || t.city.toLowerCase().includes(s) || t.coachName.toLowerCase().includes(s));
  }, [search, teamsQuery.data]);

  return (
    <PublicLayout
      seo={{
        title: "Teams · Premier Cup 2026",
        description: "Team profiles, rosters, and performance stats.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Teams</h1>
            <p className="text-sm text-muted-foreground">Browse clubs, rosters, and season form.</p>
          </div>
          <ShareButton title="Premier Cup 2026 Teams" text="Team profiles and rosters" url={`${window.location.origin}/public/teams`} />
        </div>

        <div className="bg-card rounded-3xl border p-4 sm:p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by team, city, or coach…"
              className="h-12 rounded-2xl pl-11 font-medium"
              aria-label="Search teams"
            />
          </div>
        </div>

        {teamsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[156px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((team) => {
              const winRate = team.stats.matchesPlayed > 0 ? Math.round((team.stats.wins / team.stats.matchesPlayed) * 100) : 0;
              return (
                <Link
                  key={team.id}
                  to={`/public/teams/${team.id}`}
                  className="group bg-card rounded-3xl border p-5 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-sm font-black text-secondary shrink-0">
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg font-black truncate group-hover:text-secondary transition-colors">{team.name}</div>
                        <div className="text-xs font-bold text-muted-foreground truncate">{team.city} · Coach {team.coachName}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("rounded-2xl font-black text-[10px] uppercase tracking-widest", team.status === "inactive" && "text-muted-foreground")}>
                      {team.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border bg-muted/20 p-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Played</div>
                      <div className="text-sm font-black tabular-nums">{team.stats.matchesPlayed}</div>
                    </div>
                    <div className="rounded-2xl border bg-muted/20 p-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Win Rate</div>
                      <div className="text-sm font-black tabular-nums text-secondary">{winRate}%</div>
                    </div>
                    <div className="rounded-2xl border bg-muted/20 p-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GD</div>
                      <div className="text-sm font-black tabular-nums">{team.stats.goalsScored - team.stats.goalsConceded}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-secondary" aria-hidden="true" />
                      Founded {new Date(team.foundingDate).getFullYear()}
                    </div>
                    <span className="text-secondary">View profile</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!teamsQuery.isLoading && filtered.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground bg-card rounded-3xl border p-10">No teams found.</div>
        ) : null}
      </div>
    </PublicLayout>
  );
}
