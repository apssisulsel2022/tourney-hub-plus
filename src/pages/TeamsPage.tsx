import React, { useState, useMemo } from "react";
import { Search, Filter, Plus, Users, Calendar, Trophy, MoreVertical, Shield, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const teamsData = [
  { id: "1", name: "FC Thunder", city: "New York", coach: "Marco Rossi", players: 22, status: "active" as const, foundingDate: "2010-05-15", matchesPlayed: 45, wins: 30, losses: 10, draws: 5 },
  { id: "2", name: "Red Lions", city: "Chicago", coach: "David Chen", players: 20, status: "active" as const, foundingDate: "2012-08-20", matchesPlayed: 38, wins: 22, losses: 12, draws: 4 },
  { id: "3", name: "Blue Eagles", city: "Los Angeles", coach: "Sarah Johnson", players: 21, status: "active" as const, foundingDate: "2015-03-10", matchesPlayed: 32, wins: 18, losses: 8, draws: 6 },
  { id: "4", name: "Golden Stars", city: "Miami", coach: "Alex Petrov", players: 19, status: "active" as const, foundingDate: "2018-11-05", matchesPlayed: 28, wins: 15, losses: 10, draws: 3 },
  { id: "5", name: "United FC", city: "Houston", coach: "James Lee", players: 23, status: "active" as const, foundingDate: "2008-01-25", matchesPlayed: 55, wins: 35, losses: 15, draws: 5 },
  { id: "6", name: "Dynamo City", city: "Seattle", coach: "Omar Faruk", players: 20, status: "active" as const, foundingDate: "2014-06-30", matchesPlayed: 40, wins: 20, losses: 15, draws: 5 },
  { id: "7", name: "Phoenix SC", city: "Phoenix", coach: "Luca Bianchi", players: 21, status: "active" as const, foundingDate: "2016-09-12", matchesPlayed: 35, wins: 15, losses: 15, draws: 5 },
  { id: "8", name: "Metro FC", city: "Denver", coach: "Chris Park", players: 22, status: "inactive" as const, foundingDate: "2011-04-01", matchesPlayed: 42, wins: 18, losses: 20, draws: 4 },
];

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTeams = useMemo(() => {
    return teamsData
      .filter((team) => {
        const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            team.city.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || team.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "date") return new Date(b.foundingDate).getTime() - new Date(a.foundingDate).getTime();
        return 0;
      });
  }, [searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-1">Manage and track all registered clubs</p>
        </div>
        <Link to="/teams/create">
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 shadow-lg shadow-secondary/20">
            <Plus className="h-5 w-5" /> Register New Team
          </Button>
        </Link>
      </div>

      {/* Filters & Controls */}
      <div className="bg-card rounded-xl border p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search teams by name or city..." 
            className="pl-10 bg-background border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[130px] justify-between">
                <Filter className="h-4 w-4" />
                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[130px] justify-between">
                <ArrowUpDown className="h-4 w-4" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => setSortBy("name")}>Team Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")}>Founding Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-9 p-1 bg-muted rounded-lg flex items-center gap-1 ml-2">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("px-2 py-1 rounded-md transition-all", viewMode === "grid" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("px-2 py-1 rounded-md transition-all", viewMode === "list" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="group relative bg-card rounded-2xl border border-muted hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 overflow-hidden flex flex-col">
              <Link to={`/teams/${team.id}`} className="absolute inset-0 z-10" />
              
              {/* Card Header/Banner */}
              <div className="h-24 bg-gradient-to-br from-secondary/20 via-background to-muted/30 relative flex items-center justify-center border-b border-muted/50">
                <div className="h-16 w-16 rounded-2xl bg-card border-2 border-muted flex items-center justify-center text-xl font-black text-secondary shadow-sm group-hover:scale-110 transition-transform duration-500 z-20">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <StatusBadge status={team.status} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-secondary transition-colors line-clamp-1">{team.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative z-20 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuLabel>Team Options</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Users className="h-4 w-4" /> Manage Roster</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Trophy className="h-4 w-4" /> Match History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive gap-2">Disband Team</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <Shield className="h-3 w-3" /> {team.city} · <span className="font-medium">{team.coach}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Squad Size</p>
                    <p className="text-sm font-black">{team.players} Players</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Win Rate</p>
                    <p className="text-sm font-black text-secondary">{Math.round((team.wins / team.matchesPlayed) * 100)}%</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-muted flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Calendar className="h-3 w-3 text-secondary" />
                    Est. {new Date(team.foundingDate).getFullYear()}
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-secondary p-0 hover:bg-transparent hover:underline">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-muted overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Coach</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Players</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">W/L/D</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black group-hover:bg-secondary group-hover:text-white transition-colors">
                        {team.name.slice(0, 2).toUpperCase()}
                      </div>
                      <Link to={`/teams/${team.id}`} className="font-bold text-sm hover:text-secondary transition-colors">
                        {team.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={team.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {team.city}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {team.coach}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant="secondary" className="font-black">{team.players}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-bold">
                    <span className="text-green-600">{team.wins}</span> / <span className="text-red-600">{team.losses}</span> / <span className="text-muted-foreground">{team.draws}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Team</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Disband</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center bg-card rounded-2xl border-2 border-dashed border-muted text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-xl font-bold">No teams found</h3>
          <p className="text-muted-foreground mt-1 max-w-xs">
            We couldn't find any teams matching your search or filter criteria.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
