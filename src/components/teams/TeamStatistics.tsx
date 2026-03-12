import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Goal, Target, Users, TrendingUp } from "lucide-react";

interface StatisticsProps {
  goalsFor: number;
  goalsAgainst: number;
  wins: number;
  draws: number;
  losses: number;
  goalsPerMatch?: Array<{ match: string; goals: number }>;
  performanceData?: Array<{ week: string; points: number }>;
  playerGoals?: Array<{ name: string; goals: number }>;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export function TeamStatistics({
  goalsFor,
  goalsAgainst,
  wins,
  draws,
  losses,
  goalsPerMatch = [],
  performanceData = [],
  playerGoals = [],
}: StatisticsProps) {
  const totalMatches = wins + draws + losses;
  const goalDifference = goalsFor - goalsAgainst;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                GOALS FOR
              </p>
              <p className="text-3xl font-bold text-success">{goalsFor}</p>
            </div>
            <Goal className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                GOALS AGAINST
              </p>
              <p className="text-3xl font-bold text-destructive">{goalsAgainst}</p>
            </div>
            <Target className="h-8 w-8 text-destructive opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                GOAL DIFFERENCE
              </p>
              <p className={`text-3xl font-bold ${goalDifference >= 0 ? "text-success" : "text-destructive"}`}>
                {goalDifference > 0 ? "+" : ""}{goalDifference}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                AVG GOALS/MATCH
              </p>
              <p className="text-3xl font-bold">
                {(goalsFor / Math.max(totalMatches, 1)).toFixed(1)}
              </p>
            </div>
            <Users className="h-8 w-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      {/* Win/Draw/Loss Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Record</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Wins", value: wins },
                  { name: "Draws", value: draws },
                  { name: "Losses", value: losses },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Win %</span>
              <span className="font-bold text-success">
                {totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : 0}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Draw %</span>
              <span className="font-bold text-info">
                {totalMatches > 0 ? ((draws / totalMatches) * 100).toFixed(1) : 0}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Loss %</span>
              <span className="font-bold text-destructive">
                {totalMatches > 0 ? ((losses / totalMatches) * 100).toFixed(1) : 0}%
              </span>
            </p>
          </div>
        </Card>

        {/* Goals Per Match */}
        {goalsPerMatch.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Goals Per Match</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={goalsPerMatch}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="match" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Bar dataKey="goals" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Performance Trend */}
        {performanceData.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Points Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#8b5cf6"
                  dot={{ fill: "#8b5cf6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Top Scorers */}
        {playerGoals.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Scorers</h3>
            <div className="space-y-3">
              {playerGoals.slice(0, 5).map((player, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-sm">{player.name}</span>
                  </div>
                  <span className="font-bold text-xl text-warning">{player.goals}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
