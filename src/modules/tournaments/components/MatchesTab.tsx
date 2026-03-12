import React, { useState } from "react";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { Search, Calendar, Filter, Plus, Swords, LayoutGrid, List, MoreVertical, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { TournamentBracket } from "./TournamentBracket";
import { cn } from "@/lib/utils";

const initialMatches = [
  { id: "1", homeTeam: "FC Thunder", awayTeam: "Red Lions", homeScore: 2, awayScore: 1, time: "FT", venue: "National Stadium", status: "completed" as const, date: "2026-03-10" },
  { id: "2", homeTeam: "Blue Eagles", awayTeam: "Golden Stars", homeScore: 0, awayScore: 0, time: "FT", venue: "City Arena", status: "completed" as const, date: "2026-03-11" },
  { id: "3", homeTeam: "United FC", awayTeam: "Dynamo City", time: "18:00", venue: "Olympic Park", status: "upcoming" as const, date: "2026-03-13" },
  { id: "4", homeTeam: "Phoenix SC", awayTeam: "Metro FC", time: "20:30", venue: "Phoenix Ground", status: "upcoming" as const, date: "2026-03-13" },
  { id: "5", homeTeam: "FC Thunder", awayTeam: "Blue Eagles", time: "19:00", venue: "Main Pitch", status: "live" as const, homeScore: 1, awayScore: 1, date: "2026-03-12" },
];

export function MatchesTab() {
  const [viewMode, setViewMode] = useState<"list" | "bracket">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatches = initialMatches.filter(m => 
    m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search matches or venues..." 
              className="pl-10 bg-background border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="h-9 p-1 bg-muted rounded-lg flex items-center gap-1">
            <button 
              onClick={() => setViewMode("list")}
              className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-2", viewMode === "list" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <List className="h-3.5 w-3.5" /> LIST
            </button>
            <button 
              onClick={() => setViewMode("bracket")}
              className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-2", viewMode === "bracket" ? "bg-background shadow-sm text-secondary" : "text-muted-foreground")}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> BRACKET
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Matches</DropdownMenuItem>
              <DropdownMenuItem>Live Now</DropdownMenuItem>
              <DropdownMenuItem>Upcoming</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 ml-auto">
            <Plus className="h-4 w-4" /> Add Match
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Group matches by date */}
          {["2026-03-12", "2026-03-13", "2026-03-11"].map((date) => {
            const dateMatches = filteredMatches.filter(m => m.date === date);
            if (dateMatches.length === 0) return null;
            
            return (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                {dateMatches.map((match) => (
                  <div key={match.id} className="relative group">
                    <MatchCard {...match} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Match Management</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2"><Swords className="h-4 w-4" /> Enter Score</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Calendar className="h-4 w-4" /> Reschedule</DropdownMenuItem>
                          <DropdownMenuItem className="gap-2"><Trophy className="h-4 w-4" /> Assign Referee</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive gap-2">Cancel Match</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border p-8 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            <TournamentBracket quarterfinals={[]} semifinals={[]} final={[]} />
          </div>
        </div>
      )}

      {filteredMatches.length === 0 && (
        <div className="py-20 text-center bg-card rounded-2xl border-2 border-dashed border-muted">
          <Swords className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No matches found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-6" onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
