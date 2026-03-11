import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { Users, Swords, BarChart3, UserCircle } from "lucide-react";

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Teams" value={8} icon={Users} />
        <StatCard title="Matches Played" value={20} change="of 28 total" icon={Swords} />
        <StatCard title="Goals Scored" value={58} change="2.9 per match" changeType="positive" icon={BarChart3} />
        <StatCard title="Avg. Attendance" value="2.4K" icon={UserCircle} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Matches</h2>
          <div className="space-y-3">
            <MatchCard homeTeam="FC Thunder" awayTeam="Red Lions" homeScore={2} awayScore={1} time="FT" venue="National Stadium" status="completed" />
            <MatchCard homeTeam="Blue Eagles" awayTeam="Golden Stars" homeScore={0} awayScore={0} time="FT" venue="City Arena" status="completed" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Upcoming</h2>
          <div className="space-y-3">
            <MatchCard homeTeam="United FC" awayTeam="Dynamo City" time="Tomorrow 18:00" venue="Olympic Park" status="upcoming" />
            <MatchCard homeTeam="Phoenix SC" awayTeam="Metro FC" time="Tomorrow 20:30" venue="Phoenix Ground" status="upcoming" />
          </div>
        </div>
      </div>
    </div>
  );
}
