import React from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { AgeCategory, Position } from "../types/player";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface PlayerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedClubs: string[];
  onClubsChange: (value: string[]) => void;
  selectedAges: AgeCategory[];
  onAgesChange: (value: AgeCategory[]) => void;
  selectedPositions: Position[];
  onPositionsChange: (value: Position[]) => void;
  onClearAll: () => void;
}

const mockClubs = [
  { id: "CLB1", name: "FC Thunder" },
  { id: "CLB2", name: "Red Lions" },
  { id: "CLB3", name: "Phoenix SC" },
  { id: "CLB4", name: "United FC" },
  { id: "CLB5", name: "Blue Eagles" },
  { id: "CLB6", name: "Golden Stars" },
];

const ageCategories: AgeCategory[] = ["U8", "U10", "U12", "U14", "U16", "U18", "Senior"];
const positions: Position[] = ["Goalkeeper", "Defender", "Midfielder", "Forward", "Multi-position"];

export function PlayerFilters({
  search,
  onSearchChange,
  selectedClubs,
  onClubsChange,
  selectedAges,
  onAgesChange,
  selectedPositions,
  onPositionsChange,
  onClearAll,
}: PlayerFiltersProps) {
  const activeFiltersCount = selectedClubs.length + selectedAges.length + selectedPositions.length;

  const toggleItem = <T,>(list: T[], item: T, setter: (val: T[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, club, or player ID..."
            className="h-12 w-full rounded-2xl border bg-card pl-10 pr-4 text-sm font-medium outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
          />
          {search && (
            <button 
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Club Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-2xl border bg-card px-5 font-bold gap-2 hover:bg-muted/50 transition-all">
                <Filter className="h-4 w-4 text-secondary" />
                CLUBS
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[220px] rounded-2xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Select Clubs</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockClubs.map((club) => (
                <DropdownMenuCheckboxItem
                  key={club.id}
                  checked={selectedClubs.includes(club.id)}
                  onCheckedChange={() => toggleItem(selectedClubs, club.id, onClubsChange)}
                  className="rounded-xl font-bold text-sm px-3 py-2.5"
                >
                  {club.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Age Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-2xl border bg-card px-5 font-bold gap-2 hover:bg-muted/50 transition-all">
                <Filter className="h-4 w-4 text-secondary" />
                AGE CATEGORY
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] rounded-2xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Select Age Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ageCategories.map((age) => (
                <DropdownMenuCheckboxItem
                  key={age}
                  checked={selectedAges.includes(age)}
                  onCheckedChange={() => toggleItem(selectedAges, age, onAgesChange)}
                  className="rounded-xl font-bold text-sm px-3 py-2.5"
                >
                  {age}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Position Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 rounded-2xl border bg-card px-5 font-bold gap-2 hover:bg-muted/50 transition-all">
                <Filter className="h-4 w-4 text-secondary" />
                POSITION
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] rounded-2xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Select Positions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {positions.map((pos) => (
                <DropdownMenuCheckboxItem
                  key={pos}
                  checked={selectedPositions.includes(pos)}
                  onCheckedChange={() => toggleItem(selectedPositions, pos, onPositionsChange)}
                  className="rounded-xl font-bold text-sm px-3 py-2.5"
                >
                  {pos}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={onClearAll}
              className="h-12 px-5 font-black text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-all"
            >
              Reset All ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {selectedClubs.map(id => (
            <Badge key={id} variant="secondary" className="rounded-full pl-3 pr-1.5 py-1 font-bold gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all">
              {mockClubs.find(c => c.id === id)?.name}
              <button onClick={() => toggleItem(selectedClubs, id, onClubsChange)} className="hover:bg-secondary/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
          {selectedAges.map(age => (
            <Badge key={age} variant="secondary" className="rounded-full pl-3 pr-1.5 py-1 font-bold gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all">
              {age}
              <button onClick={() => toggleItem(selectedAges, age, onAgesChange)} className="hover:bg-secondary/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
          {selectedPositions.map(pos => (
            <Badge key={pos} variant="secondary" className="rounded-full pl-3 pr-1.5 py-1 font-bold gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all">
              {pos}
              <button onClick={() => toggleItem(selectedPositions, pos, onPositionsChange)} className="hover:bg-secondary/20 rounded-full p-0.5"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
