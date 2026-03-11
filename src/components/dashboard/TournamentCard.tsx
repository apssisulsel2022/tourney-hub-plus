import React from "react";
import { Users, Trophy, Calendar, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface TournamentCardProps {
  name: string;
  logo?: string;
  category: "U12" | "U14" | "U16" | "U18" | "Adult";
  teamsCount: number;
  maxTeams: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  className?: string;
}

export function TournamentCard({
  name,
  logo,
  category,
  teamsCount,
  maxTeams,
  status,
  startDate,
  endDate,
  className
}: TournamentCardProps) {
  const capacityPercentage = (teamsCount / maxTeams) * 100;

  return (
    <div className={cn("bg-card rounded-xl border p-6 hover:shadow-md transition-all group", className)}>
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Circular Logo 150x150 */}
        <div className="relative h-[150px] w-[150px] rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {logo ? (
            <img src={logo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <Trophy className="h-16 w-16 text-muted-foreground/40" />
          )}
          <div className="absolute top-2 right-2">
             <StatusBadge status={status} />
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-bold text-lg truncate">{name}</h3>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {startDate}
            </span>
          </div>

          {/* Team Capacity Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> Registered Teams
              </span>
              <span>{teamsCount}/{maxTeams}</span>
            </div>
            <Progress value={capacityPercentage} className="h-2" />
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              Ends {endDate}
            </div>
            <button className="text-secondary hover:text-secondary/80 text-sm font-bold flex items-center gap-1 transition-colors">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
