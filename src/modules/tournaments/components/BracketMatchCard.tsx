import React from "react";
import { cn } from "@/lib/utils";

export interface BracketMatch {
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  completed: boolean;
}

export function BracketMatchCard({ match }: { match: BracketMatch }) {
  const homeWin = match.completed && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWin = match.completed && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <div className="bg-card rounded-lg border overflow-hidden w-56 shrink-0">
      <div className={cn("flex items-center justify-between px-3 py-2 border-b", homeWin && "bg-secondary/5")}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
            {match.home.slice(0, 2).toUpperCase()}
          </div>
          <span className={cn("text-sm", homeWin && "font-bold")}>{match.home}</span>
        </div>
        <span className={cn("text-sm font-bold", homeWin && "text-secondary")}>{match.homeScore ?? "—"}</span>
      </div>
      <div className={cn("flex items-center justify-between px-3 py-2", awayWin && "bg-secondary/5")}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
            {match.away.slice(0, 2).toUpperCase()}
          </div>
          <span className={cn("text-sm", awayWin && "font-bold")}>{match.away}</span>
        </div>
        <span className={cn("text-sm font-bold", awayWin && "text-secondary")}>{match.awayScore ?? "—"}</span>
      </div>
    </div>
  );
}
