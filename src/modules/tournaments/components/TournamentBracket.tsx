import React from "react";
import { BracketMatch } from "./BracketMatchCard";
import { BracketStage } from "./BracketStage";
import { BracketConnector } from "./BracketConnector";

interface TournamentBracketProps {
  quarterfinals: BracketMatch[];
  semifinals: BracketMatch[];
  final: BracketMatch[];
  champion?: string;
}

export function TournamentBracket({ quarterfinals, semifinals, final, champion }: TournamentBracketProps) {
  return (
    <div className="bg-card rounded-xl border p-6 overflow-x-auto">
      <div className="flex gap-12 min-w-[800px] items-start">
        {/* Quarterfinals */}
        <BracketStage title="Quarterfinals" matches={quarterfinals} />

        {/* Connector lines: Quarterfinals -> Semifinals */}
        <BracketConnector 
          count={2} 
          height="h-16" 
          spacing="space-y-[88px]" 
          className="pt-10" 
        />

        {/* Semifinals */}
        <BracketStage 
          title="Semifinals" 
          matches={semifinals} 
          className="pt-10" 
          matchSpacing="space-y-12" 
        />

        {/* Connector lines: Semifinals -> Final */}
        <BracketConnector 
          count={1} 
          height="h-24" 
          spacing="" 
          className="pt-20" 
        />

        {/* Final */}
        <div className="pt-24 space-y-6">
          <BracketStage title="Final" matches={final} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-lg">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-bold">Champion: {champion || "TBD"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
