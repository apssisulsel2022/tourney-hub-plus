export type TournamentFormat = "League" | "Knockout" | "Group Stage + Knockout" | "Round Robin";
export type AgeCategory = "Senior" | "U-21" | "U-19" | "U-17" | "U-15";

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
  status: "draft" | "upcoming" | "active" | "completed";
}

export type CreateTournamentInput = Omit<Tournament, "id" | "status">;
