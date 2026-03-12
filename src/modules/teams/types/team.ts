export type TeamStatus = 'active' | 'inactive' | 'pending';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  jerseyNumber: number;
  age: number;
  photo?: string;
}

export interface Team {
  id: string;
  name: string;
  city: string;
  logo?: string;
  description?: string;
  foundingDate: string;
  coachName: string;
  status: TeamStatus;
  createdAt: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    goalsScored: number;
    goalsConceded: number;
  };
  roster: Player[];
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  opponent: string;
  opponentLogo?: string;
  score: string;
  result: 'win' | 'loss' | 'draw';
  competition: string;
}

export interface CreateTeamInput {
  name: string;
  logo?: string;
  description: string;
  foundingDate: string;
  coachName: string;
  roster: Omit<Player, 'id'>[];
}
