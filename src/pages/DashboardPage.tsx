import React from "react";
import { Trophy, Users, Swords, Calendar, Download, Plus, UserPlus, CalendarDays, MapPin, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TournamentCard, TournamentCardProps } from "@/components/dashboard/TournamentCard";
import { DashboardTimeline } from "@/components/dashboard/DashboardTimeline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRealtime } from "@/modules/realtime/hooks/useRealtime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const activeTournaments: TournamentCardProps[] = [
  {
    name: "Premier Cup 2026",
    category: "Adult",
    teamsCount: 14,
    maxTeams: 16,
    status: "active",
    startDate: "Mar 1",
    endDate: "Apr 15, 2026",
  },
  {
    name: "Youth Championship",
    category: "U16",
    teamsCount: 24,
    maxTeams: 24,
    status: "active",
    startDate: "Apr 1",
    endDate: "May 20, 2026",
  },
  {
    name: "City League Season 8",
    category: "Adult",
    teamsCount: 8,
    maxTeams: 12,
    status: "upcoming",
    startDate: "May 10",
    endDate: "Jun 30, 2026",
  },
];

export default function DashboardPage() {
  const { status, dashboardStats, recentActivities } = useRealtime();

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'connecting': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-secondary bg-secondary/10 border-secondary/20';
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Organizer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of your sports operations</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">Export as CSV</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className={cn("hidden sm:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border", getStatusColor())}>
            <span className="relative flex h-2 w-2">
              {status === 'connected' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
            {status === 'connected' ? 'LIVE SYNC ACTIVE' : status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Primary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Tournaments" 
          value={dashboardStats.activeTournaments || 0} 
          change="+1 vs last month" 
          changeType="positive" 
          icon={Trophy} 
        />
        <StatCard 
          title="Registered Teams" 
          value={dashboardStats.registeredTeams || 0} 
          change="Breakdown by tourney" 
          changeType="neutral" 
          icon={Users} 
        />
        <StatCard 
          title="Matches Today" 
          value={dashboardStats.matchesToday || 0} 
          change={`${dashboardStats.liveMatches || 0} live at National Stadium`} 
          changeType="positive" 
          icon={Swords} 
          iconColor="bg-destructive/10" 
        />
        <StatCard 
          title="Upcoming (7 Days)" 
          value={14} 
          change="Next: United vs Dynamo" 
          changeType="neutral" 
          icon={Calendar} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Actions Control Center */}
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Quick Actions</h2>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Control Center</span>
            </div>
            <QuickActions />
          </div>

          {/* Active Tournaments Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">My Active Tournaments</h2>
              <Button variant="link" className="text-secondary font-bold">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {activeTournaments.map((tournament) => (
                <TournamentCard key={tournament.name} {...tournament} />
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Daily Match Schedule</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">Filter</Button>
                <Button variant="outline" size="sm" className="h-8">Today</Button>
              </div>
            </div>
            <DashboardTimeline />
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-bold">Live Activity Feed</h2>
            </div>
            <div className="space-y-6">
              {recentActivities?.map((activity) => (
                <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 border-l border-muted last:border-0">
                  <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-secondary" />
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {(!recentActivities || recentActivities.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No recent activity</p>
              )}
            </div>
          </div>

          <div className="bg-secondary/5 rounded-xl border border-secondary/10 p-6">
            <h3 className="font-bold mb-2">Platform Pro Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use the "Generate Schedule" tool to automatically resolve venue conflicts and referee overlaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
