import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from "@/components/dashboard/StatCard";
import { Trophy, Swords, Users, Target, Activity, TrendingUp, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const goalStats = [
  { name: 'FC Thunder', goals: 24, against: 8 },
  { name: 'Red Lions', goals: 20, against: 10 },
  { name: 'Blue Eagles', goals: 18, against: 12 },
  { name: 'Golden Stars', goals: 16, against: 11 },
  { name: 'United FC', goals: 14, against: 13 },
];

const performanceData = [
  { match: 'M1', score: 8.5 },
  { match: 'M2', score: 7.2 },
  { match: 'M3', score: 9.1 },
  { match: 'M4', score: 8.8 },
  { match: 'M5', score: 8.4 },
];

const matchFormatData = [
  { name: 'Completed', value: 20 },
  { name: 'Live', value: 2 },
  { name: 'Upcoming', value: 6 },
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export function StatisticsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold">Tournament Analytics</h3>
            <p className="text-xs text-muted-foreground">Comprehensive performance metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export PDF Report</Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><Share2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Goals" value={58} change="+4.2% vs avg" changeType="positive" icon={Target} />
        <StatCard title="Matches Completed" value={20} change="71.4% of season" changeType="neutral" icon={Swords} />
        <StatCard title="Active Players" value={184} change="22 teams registered" changeType="neutral" icon={Users} />
        <StatCard title="Clean Sheets" value={12} change="20.7% of matches" changeType="positive" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Goals Distribution */}
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold">Goals Scored vs Conceded</h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-secondary" /> Scored</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-muted" /> Conceded</div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="goals" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="against" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tournament Performance Trend */}
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <h3 className="font-bold mb-8">Tournament Intensity Score</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="match" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Progress Pie Chart */}
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <h3 className="font-bold mb-8">Tournament Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchFormatData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {matchFormatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {matchFormatData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </div>
                  <span className="text-sm font-black">{item.value} Matches</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Scorer Insight Card */}
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl border border-secondary/20 p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-secondary" />
              <h3 className="font-black text-secondary">TOP PERFORMER</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 rounded-2xl bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl font-black text-secondary">EH</span>
                </div>
                <div>
                  <p className="text-3xl font-black">Erling Haaland</p>
                  <p className="text-sm font-bold text-muted-foreground">United FC · Forward</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Goals</p>
                  <p className="text-xl font-black">18</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Rating</p>
                  <p className="text-xl font-black text-secondary">9.2</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">MOM</p>
                  <p className="text-xl font-black">6</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full font-bold">VIEW PLAYER ANALYSIS</Button>
            </div>
          </div>
          <Trophy className="absolute -right-8 -bottom-8 h-48 w-48 text-secondary/10 -rotate-12 transition-transform group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
}
