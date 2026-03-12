import React, { useCallback, useEffect, useState } from "react";
import { LeagueStandingsTable, StandingsTeamRow } from "@/components/LeagueStandingsTable";
import { toast } from "sonner";
import { standingsService } from "@/lib/standings";

export default function StandingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<StandingsTeamRow[]>([]);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await standingsService.get();
      setRows(data);
    } catch (e) {
      setError("Unable to load standings.");
      toast.error("Failed to load standings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Standings</h1>
        <p className="text-muted-foreground">Premier Cup 2026 · League Table</p>
      </div>

      <LeagueStandingsTable
        data={rows}
        loading={loading}
        error={error}
        onRetry={fetchStandings}
        locale="en-US"
      />
    </div>
  );
}
