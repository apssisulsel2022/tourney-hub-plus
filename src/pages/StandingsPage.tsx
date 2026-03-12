import React, { useCallback, useEffect, useState } from "react";
import { LeagueStandingsTable, StandingsTeamRow } from "@/components/LeagueStandingsTable";
import { toast } from "sonner";

const demoStandings: StandingsTeamRow[] = [
  { position: 1, teamName: "FC Thunder", played: 10, win: 8, draw: 1, loss: 1, goalsFor: 24, goalsAgainst: 8, points: 25 },
  { position: 2, teamName: "Red Lions", played: 10, win: 7, draw: 2, loss: 1, goalsFor: 20, goalsAgainst: 10, points: 23 },
  { position: 3, teamName: "Blue Eagles", played: 10, win: 6, draw: 2, loss: 2, goalsFor: 18, goalsAgainst: 12, points: 20 },
  { position: 4, teamName: "Golden Stars", played: 10, win: 5, draw: 3, loss: 2, goalsFor: 16, goalsAgainst: 11, points: 18 },
  { position: 5, teamName: "United FC", played: 10, win: 4, draw: 3, loss: 3, goalsFor: 14, goalsAgainst: 13, points: 15 },
  { position: 6, teamName: "Dynamo City", played: 10, win: 3, draw: 2, loss: 5, goalsFor: 12, goalsAgainst: 16, points: 11 },
  { position: 7, teamName: "Phoenix SC", played: 10, win: 2, draw: 1, loss: 7, goalsFor: 9, goalsAgainst: 20, points: 7 },
  { position: 8, teamName: "Metro FC", played: 10, win: 1, draw: 0, loss: 9, goalsFor: 5, goalsAgainst: 28, points: 3 },
];

export default function StandingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<StandingsTeamRow[]>([]);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 250));
      setRows(demoStandings);
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
