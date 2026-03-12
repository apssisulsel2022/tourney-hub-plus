import { BarChart3, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const topScorers = [
  { name: "Carlos Silva", team: "FC Thunder", goals: 8 },
  { name: "James Wilson", team: "Red Lions", goals: 6 },
  { name: "Ahmed Hassan", team: "Phoenix SC", goals: 5 },
  { name: "Luca Romano", team: "United FC", goals: 5 },
  { name: "Kenji Tanaka", team: "Blue Eagles", goals: 4 },
];

const topAssists = [
  { name: "Kenji Tanaka", team: "Blue Eagles", assists: 6 },
  { name: "James Wilson", team: "Red Lions", assists: 5 },
  { name: "Ahmed Hassan", team: "Phoenix SC", assists: 4 },
  { name: "Carlos Silva", team: "FC Thunder", assists: 3 },
  { name: "Chris Park", team: "Metro FC", assists: 3 },
];

const yellowCards = [
  { name: "David Chen", team: "Golden Stars", cards: 4 },
  { name: "Tom Baker", team: "FC Thunder", cards: 3 },
  { name: "Liam Foster", team: "Red Lions", cards: 3 },
  { name: "Omar Faruk", team: "Dynamo City", cards: 2 },
];

const redCards = [
  { name: "Liam Foster", team: "Red Lions", cards: 1 },
  { name: "Dan Kim", team: "FC Thunder", cards: 1 },
];

type StatRow<K extends string> = { name: string; team: string } & Record<K, number>;

function StatList<K extends string>({ title, data, valueKey, valueLabel, barColor }: { title: string; data: StatRow<K>[]; valueKey: K; valueLabel: string; barColor: string }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="px-4 py-3 border-b bg-muted/50">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold", i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{item.team}</span>
                </div>
                <span className="text-sm font-bold">{item[valueKey]}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${(item[valueKey] / max) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Premier Cup 2026 · Season Stats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatList title="⚽ Top Scorers" data={topScorers} valueKey="goals" valueLabel="Goals" barColor="bg-secondary" />
        <StatList title="🎯 Top Assists" data={topAssists} valueKey="assists" valueLabel="Assists" barColor="bg-info" />
        <StatList title="🟨 Most Yellow Cards" data={yellowCards} valueKey="cards" valueLabel="Cards" barColor="bg-warning" />
        <StatList title="🟥 Most Red Cards" data={redCards} valueKey="cards" valueLabel="Cards" barColor="bg-destructive" />
      </div>
    </div>
  );
}
