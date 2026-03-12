import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { playerService } from "@/modules/players/services/playerService";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/public/ShareButton";

export default function PublicPlayersPage() {
  const [search, setSearch] = useState("");

  const playersQuery = useQuery({
    queryKey: ["public", "players", { search }],
    queryFn: async () => {
      const res = await playerService.getPlayers(1, 60, { search: search || undefined });
      return res.items;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const sorted = useMemo(() => {
    const items = playersQuery.data ?? [];
    return [...items].sort((a, b) => (b.stats?.goals ?? 0) - (a.stats?.goals ?? 0));
  }, [playersQuery.data]);

  return (
    <PublicLayout
      seo={{
        title: "Players · Premier Cup 2026",
        description: "Player profiles, statistics, and achievements.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Players</h1>
            <p className="text-sm text-muted-foreground">Search by name, club, or player ID.</p>
          </div>
          <ShareButton title="Premier Cup 2026 Players" text="Player profiles and stats" url={`${window.location.origin}/public/players`} />
        </div>

        <div className="bg-card rounded-3xl border p-4 sm:p-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players…"
              className="h-12 rounded-2xl pl-11 font-medium"
              aria-label="Search players"
            />
          </div>
        </div>

        {playersQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((p) => (
              <Link
                key={p.id}
                to={`/public/players/${p.id}`}
                className="bg-card rounded-3xl border p-5 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-black truncate">{p.name}</div>
                    <div className="text-xs font-bold text-muted-foreground truncate">{p.clubName}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{p.primaryPosition}</Badge>
                      <Badge variant="secondary" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{p.ageCategory}</Badge>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-3xl bg-muted flex items-center justify-center text-sm font-black text-secondary shrink-0">
                    <Shield className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border bg-muted/20 p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Goals</div>
                    <div className="text-sm font-black tabular-nums text-secondary">{p.stats?.goals ?? 0}</div>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assists</div>
                    <div className="text-sm font-black tabular-nums">{p.stats?.assists ?? 0}</div>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Apps</div>
                    <div className="text-sm font-black tabular-nums">{p.stats?.matchesPlayed ?? 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!playersQuery.isLoading && (sorted.length === 0) ? (
          <div className="text-center text-sm text-muted-foreground bg-card rounded-3xl border p-10">No players found.</div>
        ) : null}
      </div>
    </PublicLayout>
  );
}

