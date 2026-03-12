export type SocketStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export type RealtimeActivityType = 'match_started' | 'team_registered' | 'score_updated';

export interface DashboardUpdatePayload {
  activeTournaments?: number;
  registeredTeams?: number;
  matchesToday?: number;
  liveMatches?: number;
  recentActivity?: {
    id: string;
    type: RealtimeActivityType;
    message: string;
    timestamp: string;
  }[];
}

export type SocketEvent =
  | { type: 'status_change'; payload: SocketStatus; timestamp: string }
  | { type: 'dashboard_stats_update'; payload: DashboardUpdatePayload; timestamp: string }
  | { type: 'recent_activity_update'; payload: DashboardUpdatePayload; timestamp: string }
  | { type: 'heartbeat'; payload: { status: 'ok' }; timestamp: string };
