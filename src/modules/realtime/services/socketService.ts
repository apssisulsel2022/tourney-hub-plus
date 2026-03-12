import { SocketEvent, SocketStatus, DashboardUpdatePayload, RealtimeActivityType } from '../types/socket';

type EventHandler = (event: SocketEvent) => void;

class SocketService {
  private status: SocketStatus = 'disconnected';
  private handlers: Set<EventHandler> = new Set();
  private mockInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.connect();
  }

  public connect(): void {
    if (this.status === 'connected' || this.status === 'connecting') return;

    this.status = 'connecting';
    this.notifyHandlers({
      type: 'status_change',
      payload: 'connecting',
      timestamp: new Date().toISOString()
    });

    // Simulate connection delay
    setTimeout(() => {
      this.status = 'connected';
      this.notifyHandlers({
        type: 'status_change',
        payload: 'connected',
        timestamp: new Date().toISOString()
      });
      this.startMocking();
    }, 1000);
  }

  public disconnect(): void {
    this.status = 'disconnected';
    this.stopMocking();
    this.notifyHandlers({
      type: 'status_change',
      payload: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  public subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private notifyHandlers(event: SocketEvent): void {
    this.handlers.forEach(handler => handler(event));
  }

  private startMocking(): void {
    if (this.mockInterval) return;

    this.mockInterval = setInterval(() => {
      // Randomly choose an update type
      const rand = Math.random();
      let event: SocketEvent;

      if (rand < 0.4) {
        // Stats update
        const payload: DashboardUpdatePayload = {
          activeTournaments: 12 + Math.floor(Math.random() * 3),
          registeredTeams: 48 + Math.floor(Math.random() * 10),
          matchesToday: 8 + Math.floor(Math.random() * 5),
          liveMatches: 2 + Math.floor(Math.random() * 3),
        };
        event = {
          type: 'dashboard_stats_update',
          payload,
          timestamp: new Date().toISOString()
        };
      } else if (rand < 0.7) {
        // Recent activity update
        const activities: Array<{ type: RealtimeActivityType; msg: string }> = [
          { type: 'match_started', msg: 'New match started: Team A vs Team B' },
          { type: 'team_registered', msg: 'New team registered: FC Barcelona' },
          { type: 'score_updated', msg: 'Score updated: Team C 2 - 1 Team D' },
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const payload: DashboardUpdatePayload = {
          recentActivity: [{
            id: Math.random().toString(36).substr(2, 9),
            type: activity.type,
            message: activity.msg,
            timestamp: new Date().toISOString()
          }]
        };
        event = {
          type: 'recent_activity_update',
          payload,
          timestamp: new Date().toISOString()
        };
      } else {
        // Heartbeat
        event = {
          type: 'heartbeat',
          payload: { status: 'ok' },
          timestamp: new Date().toISOString()
        };
      }

      this.notifyHandlers(event);
    }, 5000); // Send updates every 5 seconds
  }

  private stopMocking(): void {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  public getStatus(): SocketStatus {
    return this.status;
  }
}

export const socketService = new SocketService();
