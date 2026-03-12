import React from "react";
import { Player } from "../types/player";
import { Trophy, Target, Activity, TrendingUp, BarChart3, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export function ProfileStatsTab({ player }: { player: Player }) {
  const performanceData = [
    { match: "R1", rating: 7.2 }, { match: "R2", rating: 8.5 }, { match: "R3", rating: 6.9 },
    { match: "R4", rating: 7.8 }, { match: "R5", rating: 8.1 }, { match: "R6", rating: 7.4 },
    { match: "R7", rating: 9.0 }, { match: "R8", rating: 8.3 }, { match: "R9", rating: 7.6 },
    { match: "R10", rating: 8.2 },
  ];

  const statCards = [
    { label: "Matches Played", value: player.stats.matchesPlayed, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Goals Scored", value: player.stats.goals, icon: Target, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Total Assists", value: player.stats.assists, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Avg. Rating", value: player.stats.averageRating.toFixed(1), icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-card rounded-3xl border p-6 shadow-sm group hover:shadow-md transition-all">
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Recent Rating Trend</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="match" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} domain={[0, 10]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career Highlights */}
        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Career Highlights</h3>
          </div>
          <div className="space-y-4">
            {player.stats.careerHighlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="font-bold text-sm leading-tight">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
