import React, { useState } from "react";
import { Search, UserPlus, MoreVertical, Mail, Phone, ExternalLink, Shield, Star, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const playersData = [
  { id: "1", name: "Marcus Rashford", team: "FC Thunder", position: "Forward", goals: 12, assists: 4, rating: 8.5, status: "Active", age: 24, image: "" },
  { id: "2", name: "Kevin De Bruyne", team: "Blue Eagles", position: "Midfielder", goals: 4, assists: 15, rating: 9.0, status: "Active", age: 31, image: "" },
  { id: "3", name: "Virgil van Dijk", team: "Red Lions", position: "Defender", goals: 2, assists: 1, rating: 8.2, status: "Suspended", age: 30, image: "" },
  { id: "4", name: "Alisson Becker", team: "Golden Stars", position: "Goalkeeper", goals: 0, assists: 1, rating: 8.8, status: "Active", age: 29, image: "" },
  { id: "5", name: "Erling Haaland", team: "United FC", position: "Forward", goals: 18, assists: 2, rating: 9.2, status: "Active", age: 22, image: "" },
  { id: "6", name: "Pedri", team: "Dynamo City", position: "Midfielder", goals: 3, assists: 6, rating: 8.1, status: "Injured", age: 19, image: "" },
];

export function PlayersTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = playersData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search players, teams, or positions..." 
            className="pl-10 bg-background border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 ml-auto">
            <UserPlus className="h-4 w-4" /> Register Player
          </Button>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="group bg-card rounded-2xl border border-muted hover:border-secondary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <Avatar className="h-16 w-16 rounded-xl border-2 border-muted group-hover:border-secondary/30 transition-all">
                  <AvatarImage src={player.image} alt={player.name} />
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
                      <DropdownMenuLabel>Player Profile</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2"><ExternalLink className="h-4 w-4" /> View Full Stats</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2"><Star className="h-4 w-4" /> Add to Scouting</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2"><Shield className="h-4 w-4" /> Edit Registration</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Badge variant={
                    player.status === 'Active' ? 'success' : 
                    player.status === 'Suspended' ? 'destructive' : 'secondary'
                  } className="text-[9px] font-black px-1.5 py-0">
                    {player.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-lg leading-tight group-hover:text-secondary transition-colors">{player.name}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Shield className="h-3 w-3" /> {player.team} · {player.position}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6">
                <div className="p-2 rounded-xl bg-muted/50 border border-muted/50 text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Goals</p>
                  <p className="text-sm font-black">{player.goals}</p>
                </div>
                <div className="p-2 rounded-xl bg-muted/50 border border-muted/50 text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase">Assists</p>
                  <p className="text-sm font-black">{player.assists}</p>
                </div>
                <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
                  <p className="text-[9px] font-black text-secondary uppercase">Rating</p>
                  <p className="text-sm font-black text-secondary">{player.rating}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-muted flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground">AGE: {player.age}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:text-secondary"><Mail className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:text-secondary"><Phone className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Register Player CTA */}
        <button className="group relative h-full min-h-[220px] rounded-2xl border-2 border-dashed border-muted hover:border-secondary/50 hover:bg-secondary/5 transition-all flex flex-col items-center justify-center p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-muted group-hover:bg-secondary/10 flex items-center justify-center mb-4 transition-colors">
            <UserPlus className="h-7 w-7 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
          <h4 className="font-bold">Register New Player</h4>
          <p className="text-xs text-muted-foreground mt-1">Add a player to an existing team roster</p>
        </button>
      </div>

      {filteredPlayers.length === 0 && (
        <div className="py-20 text-center bg-card rounded-2xl border-2 border-dashed border-muted">
          <Shield className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No players found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-6" onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
