import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import PublicLayout from "@/components/layout/PublicLayout";
import { LeagueStandingsTable } from "@/components/LeagueStandingsTable";
import { standingsService } from "@/lib/standings";
import { ShareButton } from "@/components/public/ShareButton";

export default function PublicStandingsPage() {
  const standingsQuery = useQuery({
    queryKey: ["public", "standings"],
    queryFn: standingsService.get,
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const retry = useCallback(() => {
    standingsQuery.refetch();
  }, [standingsQuery]);

  return (
    <PublicLayout
      seo={{
        title: "Standings · Premier Cup 2026",
        description: "Live league table and tournament rankings.",
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Standings</h1>
            <p className="text-sm text-muted-foreground">Sorted by points, then goal difference, then goals scored.</p>
          </div>
          <ShareButton title="Premier Cup 2026 Standings" text="League table and rankings" url={`${window.location.origin}/public/standings`} />
        </div>

        <LeagueStandingsTable
          data={standingsQuery.data ?? []}
          loading={standingsQuery.isLoading}
          error={standingsQuery.isError ? "Unable to load standings." : null}
          onRetry={retry}
          locale="en-US"
        />
      </div>
    </PublicLayout>
  );
}
