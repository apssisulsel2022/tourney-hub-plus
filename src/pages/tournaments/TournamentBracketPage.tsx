import { TournamentBracket } from "@/modules/tournaments/components/TournamentBracket";
import { BracketMatch } from "@/modules/tournaments/components/BracketMatchCard";

const quarterfinals: BracketMatch[] = [
  { home: "FC Thunder", away: "Metro FC", homeScore: 3, awayScore: 0, completed: true },
  { home: "Golden Stars", away: "Blue Eagles", homeScore: 1, awayScore: 2, completed: true },
  { home: "Red Lions", away: "Phoenix SC", homeScore: 2, awayScore: 1, completed: true },
  { home: "United FC", away: "Dynamo City", homeScore: 1, awayScore: 1, completed: false },
];

const semifinals: BracketMatch[] = [
  { home: "FC Thunder", away: "Blue Eagles", homeScore: 2, awayScore: 0, completed: true },
  { home: "Red Lions", away: "TBD", completed: false },
];

const final: BracketMatch[] = [
  { home: "FC Thunder", away: "TBD", completed: false },
];

export default function TournamentBracketPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Tournament Bracket</h1>
        <p className="text-muted-foreground">Premier Cup 2026 · Knockout Stage</p>
      </div>

      <TournamentBracket 
        quarterfinals={quarterfinals}
        semifinals={semifinals}
        final={final}
      />
    </div>
  );
}
