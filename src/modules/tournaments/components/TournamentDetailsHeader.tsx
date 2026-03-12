import React from "react";
import { Trophy, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tournament } from "../types/tournament";

interface TournamentDetailsHeaderProps {
  tournament: Tournament;
  onManageClick?: () => void;
}

export function TournamentDetailsHeader({ tournament, onManageClick }: TournamentDetailsHeaderProps) {
  return (
    <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="h-16 w-16 rounded-xl bg-secondary/20 flex items-center justify-center">
          <Trophy className="h-8 w-8 text-secondary-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <StatusBadge status={tournament.status} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {tournament.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {tournament.startDate} – {tournament.endDate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {tournament.maxTeams} Teams · {tournament.ageCategory}
            </span>
          </div>
        </div>
        <Button variant="accent" size="sm" onClick={onManageClick}>Manage Tournament</Button>
      </div>
    </div>
  );
}
