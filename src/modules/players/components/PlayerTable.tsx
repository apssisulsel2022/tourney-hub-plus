import React, { useState } from "react";
import { 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Shield
} from "lucide-react";
import { Player } from "../types/player";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerTableProps {
  players: Player[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  selectedPlayers: string[];
  onSelectionChange: (ids: string[]) => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  onViewProfile: (id: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function PlayerTable({
  players,
  total,
  page,
  totalPages,
  limit,
  onPageChange,
  selectedPlayers,
  onSelectionChange,
  onDelete,
  onBulkDelete,
  onViewProfile,
  sortBy,
  sortOrder,
  onSort,
}: PlayerTableProps) {
  const isAllSelected = players.length > 0 && selectedPlayers.length === players.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(players.map(p => p.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedPlayers.includes(id)) {
      onSelectionChange(selectedPlayers.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedPlayers, id]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-3 w-3" />;
      case "suspended": return <XCircle className="h-3 w-3" />;
      case "inactive": return <Clock className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "suspended": return "bg-destructive/10 text-destructive border-destructive/20";
      case "inactive": return "bg-warning/10 text-warning border-warning/20";
      default: return "";
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-secondary" /> : <ArrowDown className="h-3.5 w-3.5 text-secondary" />;
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedPlayers.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/10 border border-secondary/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-secondary uppercase tracking-widest">
              {selectedPlayers.length} PLAYERS SELECTED
            </span>
            <div className="h-4 w-px bg-secondary/20" />
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onBulkDelete}
              className="h-8 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-destructive/20"
            >
              <Trash2 className="h-3 w-3" /> Bulk Delete
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSelectionChange([])}
            className="text-[10px] font-black uppercase tracking-widest hover:bg-secondary/10"
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted transition-colors">
                <th className="px-6 py-5 w-12">
                  <Checkbox 
                    checked={isAllSelected} 
                    onCheckedChange={toggleAll}
                    className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  />
                </th>
                <th 
                  className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors group"
                  onClick={() => onSort('name')}
                >
                  <div className="flex items-center gap-2">
                    PLAYER <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground transition-colors hidden lg:table-cell"
                  onClick={() => onSort('clubName')}
                >
                  <div className="flex items-center gap-2">
                    CLUB <SortIcon field="clubName" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden sm:table-cell">POSITION</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden xl:table-cell">AGE CATEGORY</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">STATUS</th>
                <th className="px-6 py-5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {players.map((player) => (
                <tr 
                  key={player.id} 
                  className={cn(
                    "hover:bg-muted/30 transition-all group cursor-pointer",
                    selectedPlayers.includes(player.id) && "bg-secondary/5"
                  )}
                  onClick={() => onViewProfile(player.id)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedPlayers.includes(player.id)} 
                      onCheckedChange={() => toggleOne(player.id)}
                      className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 rounded-xl border-2 border-muted group-hover:border-secondary/30 transition-all">
                        <AvatarImage src={player.photoUrl} alt={player.name} className="object-cover" />
                        <AvatarFallback className="bg-secondary/10 text-secondary font-black text-xs">
                          {player.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-black text-sm group-hover:text-secondary transition-colors truncate max-w-[150px] sm:max-w-none">{player.name}</span>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">{player.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                        <Shield className="h-3 w-3 text-secondary" />
                      </div>
                      <span className="font-bold text-sm text-muted-foreground">{player.clubName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest rounded-lg px-2 py-0.5 border-muted-foreground/20">
                      {player.primaryPosition}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                      {player.ageCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "font-black text-[9px] uppercase tracking-widest rounded-full px-2.5 py-1 gap-1.5 border",
                        getStatusColor(player.status)
                      )}
                    >
                      {getStatusIcon(player.status)}
                      {player.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 shadow-xl border-muted">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Player Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5"
                          onClick={() => onViewProfile(player.id)}
                        >
                          <ExternalLink className="h-4 w-4 text-secondary" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5">
                          <Edit2 className="h-4 w-4 text-secondary" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2 rounded-xl font-bold text-sm px-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/5"
                          onClick={() => onDelete(player.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Player
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Optimized Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-muted/20 gap-4">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            Showing <span className="text-foreground">{Math.min(total, (page - 1) * limit + 1)}-{Math.min(total, page * limit)}</span> of <span className="text-foreground">{total}</span> Players
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              className="h-9 rounded-xl font-bold gap-1 border-muted hover:bg-background transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const p = i + 1;
                const isCurrent = p === page;
                return (
                  <Button
                    key={p}
                    variant={isCurrent ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(p)}
                    className={cn(
                      "h-9 w-9 rounded-xl font-black text-xs transition-all",
                      isCurrent ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20" : "text-muted-foreground"
                    )}
                  >
                    {p}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-muted-foreground opacity-50">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-9 rounded-xl font-bold gap-1 border-muted hover:bg-background transition-all"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
