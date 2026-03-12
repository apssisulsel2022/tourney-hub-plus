export type AgeCategory = "U8" | "U10" | "U12" | "U14" | "U16" | "U18" | "Senior";

export type Position = "Goalkeeper" | "Defender" | "Midfielder" | "Forward" | "Multi-position";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PlayerDocument {
  id: string;
  name: string;
  type: "contract" | "medical" | "certification" | "id_verification";
  url: string;
  uploadedAt: string;
}

export interface MatchPerformance {
  matchId: string;
  date: string;
  opponent: string;
  competition: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  rating: number;
}

export interface TrainingRecord {
  id: string;
  date: string;
  attendance: "present" | "absent" | "excused";
  performance: number; // 1-10
  notes: string;
  tracking: string[]; // List of areas to improve
}

export interface Player {
  id: string; // Format: CLB-YYYY-####
  name: string;
  photoUrl?: string;
  dateOfBirth: string;
  clubId: string;
  clubName: string;
  clubLogo?: string;
  ageCategory: AgeCategory;
  primaryPosition: Position;
  secondaryPosition?: Position;
  nationality: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: EmergencyContact;
  
  // Stats
  stats: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    cleanSheets?: number;
    averageRating: number;
    careerHighlights: string[];
  };

  documents: PlayerDocument[];
  matchHistory: MatchPerformance[];
  trainingRecords: TrainingRecord[];
  
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

export interface CreatePlayerInput extends Omit<Player, "id" | "createdAt" | "stats" | "documents" | "matchHistory" | "trainingRecords"> {
  documents?: File[];
}
