export type TournamentFormat = "League" | "Knockout" | "Group Stage + Knockout" | "Round Robin";
export type AgeCategory = "Senior" | "U-21" | "U-19" | "U-17" | "U-15";

export interface TournamentRules {
  halfDuration: number;
  extraTimeAllowed: boolean;
  penaltyShootout: boolean;
  pointsWin: number;
  pointsDraw: number;
  pointsLoss: number;
  tiebreakers: string[];
  yellowCardThreshold: number;
  maxSubstitutions: number;
}

export interface TournamentScheduling {
  matchDays: string[];
  defaultKickoffTimes: string[];
  venueAssignments: Record<string, string>;
  autoGenerate: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  format: TournamentFormat;
  ageCategory: AgeCategory;
  startDate: string;
  endDate: string;
  location: string;
  maxTeams: number;
  venueId?: string;
  registrationDeadline?: string;
  logoUrl?: string;
  organizationId: string;
  status: "draft" | "upcoming" | "active" | "completed";
}

export type CreateTournamentInput = Omit<Tournament, "id" | "status"> & {
  rules?: TournamentRules;
  scheduling?: TournamentScheduling;
  selectedTeamIds?: string[];
};

export const DEFAULT_RULES: TournamentRules = {
  halfDuration: 45,
  extraTimeAllowed: false,
  penaltyShootout: true,
  pointsWin: 3,
  pointsDraw: 1,
  pointsLoss: 0,
  tiebreakers: ["goal_difference", "head_to_head"],
  yellowCardThreshold: 5,
  maxSubstitutions: 5,
};

export const DEFAULT_SCHEDULING: TournamentScheduling = {
  matchDays: ["saturday", "sunday"],
  defaultKickoffTimes: ["15:00", "19:00"],
  venueAssignments: {},
  autoGenerate: false,
};
