import React, { useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Plus, Filter, MoreVertical, UserPlus, Mail, Phone, ExternalLink, Trash2, Edit2, Shield } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const initialTeams = [
  { id: "1", name: "FC Thunder", city: "New York", coach: "Marco Rossi", players: 22, status: "active" as const, email: "coach@fcthunder.com", phone: "+1 234 567 890" },
  { id: "2", name: "Red Lions", city: "Chicago", coach: "David Chen", players: 20, status: "active" as const, email: "david.chen@redlions.org", phone: "+1 312 456 789" },
  { id: "3", name: "Blue Eagles", city: "Los Angeles", coach: "Sarah Johnson", players: 21, status: "active" as const, email: "sarah.j@blueeagles.net", phone: "+1 213 567 123" },
  { id: "4", name: "Golden Stars", city: "Miami", coach: "Alex Petrov", players: 19, status: "active" as const, email: "alex@goldenstars.miami", phone: "+1 305 789 456" },
  { id: "5", name: "United FC", city: "Houston", coach: "James Lee", players: 23, status: "active" as const, email: "j.lee@unitedfc.com", phone: "+1 713 123 456" },
  { id: "6", name: "Dynamo City", city: "Seattle", coach: "Omar Faruk", players: 20, status: "active" as const, email: "omar@dynamocity.io", phone: "+1 206 456 789" },
  { id: "7", name: "Phoenix SC", city: "Phoenix", coach: "Luca Bianchi", players: 21, status: "active" as const, email: "luca@phoenixsc.com", phone: "+1 602 567 890" },
  { id: "8", name: "Metro FC", city: "Denver", coach: "Chris Park", players: 22, status: "active" as const, email: "chris@metrofc.org", phone: "+1 303 789 123" },
];

export function TeamsTab() {
  const [teams, setTeams] = useState(initialTeams);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.coach.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search teams, coaches, or cities..." 
            className="pl-10 bg-background border-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold gap-2 ml-auto">
            <Plus className="h-4 w-4" /> Add Team
          </Button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeams.map((t) => (
          <div key={t.id} className="group bg-card rounded-2xl border border-muted hover:border-secondary/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center border-2 border-secondary/10 group-hover:border-secondary/30 transition-all">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg group-hover:text-secondary transition-colors">{t.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] font-black uppercase px-1.5 py-0">{t.city}</Badge>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Team Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer gap-2"><Edit2 className="h-4 w-4" /> Edit Team Details</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2"><UserPlus className="h-4 w-4" /> Manage Roster</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2"><Mail className="h-4 w-4" /> Contact Coach</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive gap-2"><Trash2 className="h-4 w-4" /> Remove Team</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-muted/50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Head Coach</p>
                    <p className="text-sm font-bold">{t.coach}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center">
                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Squad Size</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black">{t.players}</span>
                      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1 rounded">FULL</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Matches</p>
                    <span className="text-lg font-black">12/16</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-muted flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" title={t.email}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" title={t.phone}>
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-secondary gap-2 hover:bg-secondary/5">
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Team Placeholder */}
        <button className="group relative h-full min-h-[250px] rounded-2xl border-2 border-dashed border-muted hover:border-secondary/50 hover:bg-secondary/5 transition-all flex flex-col items-center justify-center p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-muted group-hover:bg-secondary/10 flex items-center justify-center mb-4 transition-colors">
            <Plus className="h-8 w-8 text-muted-foreground group-hover:text-secondary transition-colors" />
          </div>
          <h4 className="font-bold text-lg">Add New Team</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-[180px]">Register a new participant to the tournament</p>
        </button>
      </div>

      {filteredTeams.length === 0 && (
        <div className="py-20 text-center bg-card rounded-2xl border-2 border-dashed border-muted">
          <Shield className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No teams found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-6" onClick={() => setSearchQuery("")}>Clear Search</Button>
        </div>
      )}
    </div>
  );
}
