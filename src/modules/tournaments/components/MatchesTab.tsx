import React from "react";
import { MatchCard } from "@/components/dashboard/MatchCard";

export function MatchesTab() {
  return (
    <div className="space-y-3">
      <MatchCard homeTeam="FC Thunder" awayTeam="Red Lions" homeScore={2} awayScore={1} time="FT" venue="National Stadium" status="completed" />
      <MatchCard homeTeam="Blue Eagles" awayTeam="Golden Stars" homeScore={0} awayScore={0} time="FT" venue="City Arena" status="completed" />
      <MatchCard homeTeam="United FC" awayTeam="Dynamo City" time="Tomorrow 18:00" venue="Olympic Park" status="upcoming" />
      <MatchCard homeTeam="Phoenix SC" awayTeam="Metro FC" time="Tomorrow 20:30" venue="Phoenix Ground" status="upcoming" />
    </div>
  );
}
