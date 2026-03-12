import React from "react";
import { BracketMatch, BracketMatchCard } from "./BracketMatchCard";

interface BracketStageProps {
  title: string;
  matches: BracketMatch[];
  className?: string;
  matchSpacing?: string;
}

export function BracketStage({ title, matches, className, matchSpacing = "space-y-4" }: BracketStageProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">{title}</h3>
      <div className={matchSpacing}>
        {matches.map((m, i) => (
          <BracketMatchCard key={i} match={m} />
        ))}
      </div>
    </div>
  );
}
