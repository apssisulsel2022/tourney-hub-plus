import React, { useState, useMemo } from "react";
import { Trophy, Plus, Search, Filter, ArrowUpDown, Calendar, MapPin, Users, Swords, MoreVertical, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
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

const tournamentsData = [
  { id: "1", name: "Premier Cup 2026", teams: 14, maxTeams: 16, category: "U-21", dates: "Mar 1 – Apr 15", status: "active" as const, matches: 28, location: "New York", type: "Elimination" },
  { id: "2", name: "City League Season 8", teams: 12, maxTeams: 12, category: "Senior", dates: "Feb 10 – Jun 30", status: "active" as const, matches: 66, location: "Los Angeles", type: "League" },
  { id: "3", name: "Youth Championship", teams: 24, maxTeams: 32, category: "U-17", dates: "Apr 1 – May 20", status: "upcoming" as const, matches: 0, location: "Chicago", type: "Group + Knockout" },
  { id: "4", name: "Summer Invitational", teams: 8, maxTeams: 16, category: "U-19", dates: "Jun 15 – Jul 10", status: "draft" as const, matches: 0, location: "Miami", type: "Knockout" },
  { id: "5", name: "Winter Cup 2025", teams: 16, maxTeams: 16, category: "Senior", dates: "Nov 1 – Dec 20", status: "completed" as const, matches: 60, location: "Houston", type: "League" },
];

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTournaments = useMemo(() => {
    return tournamentsData
      .filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "teams") return b.teams - a.teams;
        return 0; // Default newest (mocked)
      });
  }, [searchQuery, statusFilter, sortBy]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your competitions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Link to="/tournaments/create">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 shadow-lg shadow-secondary/20">
              <Plus className="h-5 w-5" /> Create Tournament
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-card rounded-xl border p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or location..." 
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
              <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>Upcoming</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
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
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>Tournament Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("teams")}>Most Teams</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-9 p-1 bg-muted rounded-lg flex items-center gap-1 ml-2">
            <button 
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={cn("px-2 py-1 rounded-md transition-all", viewMode === "grid" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <Trophy className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={cn("px-2 py-1 rounded-md transition-all", viewMode === "list" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tournaments Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTournaments.map((t) => (
            <div key={t.id} className="group relative bg-card rounded-2xl border border-muted hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 overflow-hidden flex flex-col">
              <Link to="/tournaments/detail" className="absolute inset-0 z-10" />
              
              {/* Card Header/Banner */}
              <div className="h-32 bg-gradient-to-br from-secondary/20 via-background to-muted/30 relative flex items-center justify-center border-b border-muted/50 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-1" />
                <Trophy className="h-12 w-12 text-secondary/20 group-hover:scale-110 group-hover:text-secondary/40 transition-all duration-500" />
                <div className="absolute top-4 right-4 z-20">
                  <StatusBadge status={t.status} />
                </div>
                <div className="absolute top-4 left-4 z-20">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider">
                    {t.type}
                  </Badge>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-secondary transition-colors line-clamp-1">{t.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative z-20 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Plus className="h-4 w-4" /> Manage Teams</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Calendar className="h-4 w-4" /> Edit Schedule</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2"><Download className="h-4 w-4" /> Export Stats</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive gap-2">Delete Tournament</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" /> {t.location} · <Badge variant="secondary" className="h-4 text-[9px] px-1 font-bold">{t.category}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Users className="h-3 w-3" /> Capacity
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black">{t.teams}/{t.maxTeams}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary rounded-full" 
                          style={{ width: `${(t.teams / t.maxTeams) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Swords className="h-3 w-3" /> Matches
                    </div>
                    <span className="text-sm font-black">{t.matches} Played</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-muted flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                    <Calendar className="h-3 w-3 text-secondary" />
                    {t.dates}
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-secondary p-0 hover:bg-transparent hover:underline">
                    View Details
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
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tournament Name</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Teams</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredTournaments.map((t) => (
                <tr key={t.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to="/tournaments/detail" className="font-bold text-sm hover:text-secondary transition-colors">
                      {t.name}
                    </Link>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">{t.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {t.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black">{t.teams}/{t.maxTeams}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="font-bold">{t.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                    {t.dates}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-secondary">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Manage Teams</DropdownMenuItem>
                          <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredTournaments.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center bg-card rounded-2xl border-2 border-dashed border-muted text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-xl font-bold">No tournaments found</h3>
          <p className="text-muted-foreground mt-1 max-w-xs">
            We couldn't find any tournaments matching your search or filter criteria.
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
