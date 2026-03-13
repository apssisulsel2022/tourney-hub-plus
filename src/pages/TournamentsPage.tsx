import React, { useState, useEffect, useMemo } from "react";
import { Trophy, Plus, Search, Filter, ArrowUpDown, Calendar, MapPin, Users, Swords, MoreVertical, Download, Printer, Loader2 } from "lucide-react";
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
import { tournamentService } from "@/modules/tournaments/services/tournamentService";
import { Tournament } from "@/modules/tournaments/types/tournament";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentService.getAll();
        // Map from DB format to our internal Tournament type
        const mappedData = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          format: t.format,
          ageCategory: t.age_category,
          startDate: t.start_date,
          endDate: t.end_date,
          location: t.location,
          maxTeams: t.max_teams,
          registrationDeadline: t.registration_deadline,
          logoUrl: t.logo_url,
          organizationId: t.organization_id,
          status: t.status,
          registrationFee: t.registration_fee,
          sportType: t.sport_type,
        }));
        setTournaments(mappedData);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  const filteredTournaments = useMemo(() => {
    return tournaments
      .filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "teams") return (b.maxTeams || 0) - (a.maxTeams || 0);
        return 0;
      });
  }, [tournaments, searchQuery, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

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
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="group bg-card rounded-2xl border border-muted/60 overflow-hidden hover:border-secondary/40 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
              <div className="relative h-48 bg-muted/30">
                {tournament.logoUrl ? (
                  <img src={tournament.logoUrl} alt={tournament.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-muted/20" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <StatusBadge status={tournament.status} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground font-bold border-none">
                    {tournament.format}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-bold truncate group-hover:text-secondary transition-colors">{tournament.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{tournament.location || "Online"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-muted/40">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Category</p>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="font-bold text-sm">{tournament.ageCategory}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Schedule</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="font-bold text-sm">
                        {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tournament.id}${i}`} alt="Team" />
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                      +{tournament.maxTeams}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/tournaments/${tournament.id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full font-bold">Details</Button>
                    </Link>
                    {tournament.status === 'upcoming' && (
                      <Link to={`/tournaments/${tournament.id}/register`} className="flex-1">
                        <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">Register</Button>
                      </Link>
                    )}
                  </div>
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
