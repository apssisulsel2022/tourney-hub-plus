import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Trophy, Swords, BarChart3, Calendar, Shield, Mail, Phone, Edit2, MoreVertical, ExternalLink, Trash2, UserPlus, TrendingUp, Target, Activity, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const performanceData = [
  { match: "R1", pts: 3 }, { match: "R2", pts: 6 }, { match: "R3", pts: 9 },
  { match: "R4", pts: 10 }, { match: "R5", pts: 13 }, { match: "R6", pts: 16 },
  { match: "R7", pts: 19 }, { match: "R8", pts: 22 }, { match: "R9", pts: 22 },
  { match: "R10", pts: 25 },
];

const roster = [
  { id: "p1", name: "Mike Johnson", pos: "GK", age: 28, num: 1, goals: 0, apps: 10, rating: 7.8 },
  { id: "p2", name: "Tom Baker", pos: "RB", age: 25, num: 2, goals: 1, apps: 10, rating: 7.2 },
  { id: "p3", name: "Jake Williams", pos: "CB", age: 27, num: 4, goals: 2, apps: 10, rating: 8.1 },
  { id: "p4", name: "Ryan Davis", pos: "CB", age: 26, num: 5, goals: 0, apps: 9, rating: 7.5 },
  { id: "p5", name: "Sam Lee", pos: "LB", age: 24, num: 3, goals: 0, apps: 10, rating: 7.1 },
  { id: "p6", name: "Chris Park", pos: "CM", age: 26, num: 8, goals: 3, apps: 10, rating: 8.4 },
  { id: "p7", name: "Alex Park", pos: "CM", age: 24, num: 6, goals: 1, apps: 8, rating: 7.9 },
  { id: "p8", name: "Dan Kim", pos: "RW", age: 25, num: 7, goals: 4, apps: 10, rating: 8.2 },
  { id: "p9", name: "Carlos Silva", pos: "ST", age: 24, num: 9, goals: 8, apps: 10, rating: 8.9 },
  { id: "p10", name: "Lucas Moore", pos: "LW", age: 22, num: 11, goals: 3, apps: 9, rating: 8.0 },
  { id: "p11", name: "Ben Taylor", pos: "CAM", age: 23, num: 10, goals: 2, apps: 10, rating: 8.5 },
];

const matchHistory = [
  { id: "m1", date: "2026-03-10", opponent: "Red Lions", score: "2 - 1", result: "win", competition: "Premier Cup" },
  { id: "m2", date: "2026-03-05", opponent: "Blue Eagles", score: "3 - 1", result: "win", competition: "Premier Cup" },
  { id: "m3", date: "2026-02-28", opponent: "Golden Stars", score: "0 - 0", result: "draw", competition: "Friendly" },
  { id: "m4", date: "2026-02-20", opponent: "United FC", score: "1 - 2", result: "loss", competition: "City League" },
];

const tabs = [
  { id: "overview", label: "Team Info", icon: Shield },
  { id: "roster", label: "Roster", icon: Users },
  { id: "matches", label: "Match History", icon: Swords },
  { id: "stats", label: "Statistics", icon: BarChart3 },
];

export default function TeamDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      {/* Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/teams">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight">Team Profile</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/teams" className="hover:text-secondary transition-colors">Teams</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">FC Thunder</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 font-bold"><Mail className="h-4 w-4" /> Contact Coach</Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-white font-black gap-2 shadow-lg shadow-secondary/20">
            <Edit2 className="h-4 w-4" /> Edit Team
          </Button>
        </div>
      </div>

      {/* Team Profile Header */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/60 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-card rounded-3xl border p-8 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Shield className="h-64 w-64 -rotate-12" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
            <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border-2 border-secondary/10 shadow-inner">
              <Shield className="h-16 w-16 text-secondary" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-black tracking-tighter">FC Thunder</h2>
                  <StatusBadge status="active" />
                </div>
                <p className="text-muted-foreground font-medium max-w-2xl leading-relaxed">
                  Founded in 2010, FC Thunder has established itself as a premier football club in the New York area, focusing on tactical excellence and youth development.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><MapPin className="h-4 w-4 text-secondary" /></div>
                  New York, USA
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><Users className="h-4 w-4 text-secondary" /></div>
                  22 Registered Players
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center"><Calendar className="h-4 w-4 text-secondary" /></div>
                  Est. May 2010
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4 w-full lg:w-auto">
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center lg:text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Win Rate</p>
                <p className="text-2xl font-black text-secondary">67%</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center lg:text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">League Rank</p>
                <p className="text-2xl font-black">#1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-2xl border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all",
              activeTab === tab.id 
                ? "bg-background text-secondary shadow-sm ring-1 ring-black/5" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Matches Played" value={45} icon={Swords} />
              <StatCard title="Total Wins" value={30} change="+2 last month" changeType="positive" icon={Trophy} />
              <StatCard title="Goals Scored" value={120} change="2.6 per match" changeType="neutral" icon={Target} />
              <StatCard title="Clean Sheets" value={15} icon={Activity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-card rounded-3xl border p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black tracking-tight">Performance Trend</h3>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-secondary" /> Points</div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="match" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="pts" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h3 className="text-xl font-black tracking-tight mb-6">Staff Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-muted/50">
                    <Avatar className="h-12 w-12 rounded-xl">
                      <AvatarFallback className="bg-secondary text-white font-black">MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Head Coach</p>
                      <p className="text-lg font-black">Marco Rossi</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-bold">Experience</span>
                      <span className="font-black">12 Years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-bold">License</span>
                      <Badge variant="outline" className="font-black">UEFA PRO</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-bold">Tactical Style</span>
                      <span className="font-black">Attacking 4-3-3</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-muted">
                    <Button variant="outline" className="w-full font-bold gap-2">
                      <ExternalLink className="h-4 w-4" /> View Full History
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roster" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black tracking-tight">Active Roster</h3>
                <Badge variant="secondary" className="font-black px-3">{roster.length} PLAYERS</Badge>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-black gap-2">
                <UserPlus className="h-4 w-4" /> Add Player
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {roster.map((player) => (
                <div key={player.id} className="group bg-card rounded-2xl border border-muted hover:border-secondary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <Avatar className="h-16 w-16 rounded-xl border-2 border-muted group-hover:border-secondary/30 transition-all">
                        <AvatarFallback className="bg-secondary/10 text-secondary font-black text-lg rounded-xl">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Player Management</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2"><Edit2 className="h-4 w-4" /> Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><TrendingUp className="h-4 w-4" /> View Stats</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" /> Release Player</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-2xl font-black text-muted-foreground/30">#{player.num}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-black text-lg leading-tight group-hover:text-secondary transition-colors">{player.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Shield className="h-3 w-3" /> {player.pos} · Age {player.age}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="p-2 rounded-xl bg-muted/50 border border-muted/50 text-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Goals</p>
                        <p className="text-sm font-black">{player.goals}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/50 border border-muted/50 text-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Apps</p>
                        <p className="text-sm font-black">{player.apps}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                        <p className="text-[9px] font-black text-secondary uppercase">Rating</p>
                        <p className="text-sm font-black text-secondary">{player.rating}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-muted">
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Opponent</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-center">Score</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Competition</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {matchHistory.map((match) => (
                    <tr key={match.id} className="hover:bg-muted/20 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <Calendar className="h-4 w-4 text-secondary" />
                          {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black">
                            {match.opponent.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-black text-sm group-hover:text-secondary transition-colors">{match.opponent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-lg tracking-tighter">{match.score}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider">{match.competition}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'destructive' : 'secondary'} className="font-black min-w-[60px] justify-center">
                          {match.result.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h3 className="text-xl font-black tracking-tight mb-8">Goal Scoring Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roster.slice(5, 11)}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="goals" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h3 className="text-xl font-black tracking-tight mb-8">Disciplinary Record</h3>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-yellow-600 uppercase tracking-widest">Yellow Cards</p>
                        <p className="text-2xl font-black">42</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-yellow-600">0.9 per match</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-destructive flex items-center justify-center text-white shadow-lg shadow-destructive/20">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-destructive uppercase tracking-widest">Red Cards</p>
                        <p className="text-2xl font-black">3</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-destructive">0.06 per match</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
