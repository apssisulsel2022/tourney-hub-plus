export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: string;
}

export type SocketStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface DashboardUpdatePayload {
  activeTournaments?: number;
  registeredTeams?: number;
  matchesToday?: number;
  liveMatches?: number;
  recentActivity?: {
    id: string;
    type: 'match_started' | 'team_registered' | 'score_updated';
    message: string;
    timestamp: string;
  }[];
}
