import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { Users, Swords, BarChart3, UserCircle, MapPin, Calendar, Clock, Trophy, ArrowRight, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function OverviewTab() {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 5, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Teams" value={8} change="2 spots left" changeType="positive" icon={Users} />
        <StatCard title="Matches Played" value={20} change="of 28 total (71%)" icon={Swords} />
        <StatCard title="Goals Scored" value={58} change="2.9 per match" changeType="positive" icon={BarChart3} />
        <StatCard title="Avg. Attendance" value="2.4K" icon={UserCircle} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Details & Map */}
        <div className="xl:col-span-2 space-y-8">
          {/* Banner & Countdown */}
          <div className="relative h-[300px] rounded-3xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600" 
              alt="Tournament Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Badge className="bg-secondary text-secondary-foreground font-bold px-3 py-1">PREMIUM TOURNAMENT</Badge>
                <h2 className="text-3xl font-black text-white tracking-tight">Premier Cup 2026</h2>
                <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> National Stadium, NY</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-secondary" /> Mar 1 - Apr 15</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex gap-4">
                {[
                  { label: "DAYS", value: timeLeft.days },
                  { label: "HRS", value: timeLeft.hours },
                  { label: "MINS", value: timeLeft.minutes },
                  { label: "SECS", value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center min-w-[50px]">
                    <p className="text-2xl font-black text-white leading-none">{String(item.value).padStart(2, '0')}</p>
                    <p className="text-[10px] font-bold text-white/60 mt-1 uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Map Placeholder */}
          <div className="bg-card rounded-2xl border p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold">Tournament Venue</h3>
                  <p className="text-sm text-muted-foreground">National Stadium & Training Grounds</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowRight className="h-4 w-4" /> Get Directions
              </Button>
            </div>
            
            <div className="aspect-[21/9] rounded-xl bg-muted overflow-hidden relative border border-muted group cursor-crosshair">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-73.935242,40.730610,13,0/800x400?access_token=pk.mock')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-secondary/20 rounded-full animate-ping" />
                  <MapPin className="h-8 w-8 text-secondary relative z-10 drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg border shadow-sm text-xs space-y-1 max-w-[200px]">
                <p className="font-bold">National Stadium</p>
                <p className="text-muted-foreground">123 Sports Ave, Queens, NY 11101, United States</p>
              </div>
            </div>
          </div>

          {/* Participant Preview */}
          <div className="bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Confirmed Teams</h3>
              <Button variant="link" className="text-secondary p-0 h-auto font-bold">View All 14 Teams</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {["FC Thunder", "Red Lions", "Blue Eagles", "Golden Stars", "United FC", "Dynamo City"].map((team, i) => (
                <div key={team} className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted transition-colors text-center">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-transparent group-hover:border-secondary transition-all">
                    <Trophy className="h-6 w-6 text-secondary" />
                  </div>
                  <span className="text-xs font-bold truncate w-full">{team}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted hover:border-secondary transition-colors cursor-pointer group">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-secondary/10">
                  <Users className="h-6 w-6 text-muted-foreground group-hover:text-secondary" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-secondary">+8 MORE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Progress */}
        <div className="space-y-8">
          {/* Tournament Progress */}
          <div className="bg-card rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold mb-6">Match Statistics</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Tournament Completion</span>
                  <span className="text-secondary">71%</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 border border-muted">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Goals</p>
                  <p className="text-2xl font-black">58</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-muted">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Clean Sheets</p>
                  <p className="text-2xl font-black">12</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-muted">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Yellow Cards</p>
                  <p className="text-2xl font-black text-yellow-500">42</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-muted">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Red Cards</p>
                  <p className="text-2xl font-black text-destructive">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Match Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Match Feed</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Share2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Printer className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative pl-6 pb-6 border-l-2 border-secondary">
                <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-secondary border-4 border-background" />
                <p className="text-xs font-bold text-secondary uppercase mb-2">Ongoing</p>
                <MatchCard homeTeam="FC Thunder" awayTeam="Red Lions" homeScore={2} awayScore={1} time="78'" venue="Pitch 1" status="live" />
              </div>

              <div className="relative pl-6 pb-6 border-l-2 border-muted">
                <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-muted border-4 border-background" />
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Next Match</p>
                <MatchCard homeTeam="United FC" awayTeam="Dynamo City" time="Tomorrow 18:00" venue="Main Stadium" status="upcoming" />
              </div>
            </div>
            
            <Button variant="outline" className="w-full font-bold">Full Schedule</Button>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20 space-y-4">
            <h4 className="font-bold text-secondary">Organizer Tools</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" className="font-bold text-[11px]">EXPORT STATS</Button>
              <Button variant="secondary" size="sm" className="font-bold text-[11px]">PRINT ROSTERS</Button>
              <Button variant="secondary" size="sm" className="font-bold text-[11px]">NOTIFY TEAMS</Button>
              <Button variant="secondary" size="sm" className="font-bold text-[11px]">GENERATE PDF</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
