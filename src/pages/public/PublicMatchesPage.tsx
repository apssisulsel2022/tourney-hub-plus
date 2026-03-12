import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { matchService, MatchStatus } from "@/lib/matches";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareButton } from "@/components/public/ShareButton";
import { cn } from "@/lib/utils";

const formatKickoff = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function PublicMatchesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MatchStatus | "all">("all");

  const matchesQuery = useQuery({
    queryKey: ["public", "matches", { search, status }],
    queryFn: async () => {
      const res = await matchService.list({ page: 1, limit: 80, search: search || undefined, status, sort: "date_asc" });
      return res.items;
    },
    refetchInterval: 15000,
    staleTime: 8000,
  });

  const grouped = useMemo(() => {
    const items = matchesQuery.data ?? [];
    return {
      live: items.filter((m) => m.status === "live"),
      upcoming: items.filter((m) => m.status === "upcoming" || m.status === "delayed"),
      completed: items.filter((m) => m.status === "completed"),
    };
  }, [matchesQuery.data]);

  const toolbarItem = (value: MatchStatus | "all", label: string) => (
    <Button
      type="button"
      variant={status === value ? "default" : "outline"}
      className={cn("h-11 rounded-2xl font-bold", status === value && "bg-secondary hover:bg-secondary/90 text-white")}
      onClick={() => setStatus(value)}
    >
      {label}
    </Button>
  );

  return (
    <PublicLayout
      seo={{
        title: "Matches · Premier Cup 2026",
        description: "Full match schedule, live scores, and results.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Matches</h1>
            <p className="text-sm text-muted-foreground">Live updates refresh automatically.</p>
          </div>
          <ShareButton title="Premier Cup 2026 Matches" text="Match schedule, live scores, and results" url={`${window.location.origin}/public/matches`} />
        </div>

        <div className="bg-card rounded-3xl border p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team, venue, match ID…"
                className="h-12 rounded-2xl pl-11 font-medium"
                aria-label="Search matches"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto py-1 [-webkit-overflow-scrolling:touch]">
              {toolbarItem("all", "All")}
              {toolbarItem("live", "Live")}
              {toolbarItem("upcoming", "Upcoming")}
              {toolbarItem("completed", "Results")}
            </div>
          </div>
        </div>

        {matchesQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[108px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.live.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-live" aria-hidden="true" /> Live
                </h2>
                <div className="space-y-3">
                  {grouped.live.map((m) => (
                    <div key={m.id} className="bg-card rounded-2xl border p-3 sm:p-4">
                      <Link to={`/public/matches/${m.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <MatchCard
                          homeTeam={m.home.name}
                          awayTeam={m.away.name}
                          homeScore={m.score.home}
                          awayScore={m.score.away}
                          time={`${m.minute ?? 0}'`}
                          venue={`${m.venue.name}, ${m.venue.city}`}
                          status={m.status}
                          tournament={m.tournament}
                        />
                      </Link>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-muted-foreground">{formatKickoff(m.dateTime)}</div>
                        <ShareButton title={`${m.home.name} vs ${m.away.name}`} text={`Live match · ${m.tournament}`} url={`${window.location.origin}/public/matches/${m.id}`} size="icon" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {grouped.upcoming.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-black tracking-tight">Upcoming</h2>
                <div className="space-y-3">
                  {grouped.upcoming.map((m) => (
                    <div key={m.id} className="bg-card rounded-2xl border p-3 sm:p-4">
                      <Link to={`/public/matches/${m.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <MatchCard
                          homeTeam={m.home.name}
                          awayTeam={m.away.name}
                          time={formatKickoff(m.dateTime)}
                          venue={`${m.venue.name}, ${m.venue.city}`}
                          status={m.status}
                          tournament={m.tournament}
                        />
                      </Link>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-muted-foreground">{m.round}</div>
                        <ShareButton title={`${m.home.name} vs ${m.away.name}`} text={`Kickoff ${formatKickoff(m.dateTime)} · ${m.venue.name}`} url={`${window.location.origin}/public/matches/${m.id}`} size="icon" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {grouped.completed.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-black tracking-tight">Results</h2>
                <div className="space-y-3">
                  {grouped.completed.map((m) => (
                    <div key={m.id} className="bg-card rounded-2xl border p-3 sm:p-4">
                      <Link to={`/public/matches/${m.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-muted-foreground">{formatKickoff(m.dateTime)}</div>
                        <ShareButton title={`${m.home.name} ${m.score.home}-${m.score.away} ${m.away.name}`} text={`Final score · ${m.tournament}`} url={`${window.location.origin}/public/matches/${m.id}`} size="icon" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(matchesQuery.data?.length ?? 0) === 0 && (
              <div className="text-center text-sm text-muted-foreground bg-card rounded-3xl border p-10">No matches found.</div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
