import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { SocketEvent, SocketStatus, DashboardUpdatePayload } from '../types/socket';

interface RealtimeContextType {
  status: SocketStatus;
  lastEvent: SocketEvent | null;
  dashboardStats: DashboardUpdatePayload;
  recentActivities: DashboardUpdatePayload['recentActivity'];
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<SocketStatus>(socketService.getStatus());
  const [lastEvent, setLastEvent] = useState<SocketEvent | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardUpdatePayload>({
    activeTournaments: 12,
    registeredTeams: 48,
    matchesToday: 8,
    liveMatches: 2,
  });
  const [recentActivities, setRecentActivities] = useState<DashboardUpdatePayload['recentActivity']>([]);

  useEffect(() => {
    const unsubscribe = socketService.subscribe((event) => {
      setLastEvent(event);

      switch (event.type) {
        case 'status_change':
          setStatus(event.payload as SocketStatus);
          break;
        case 'dashboard_stats_update':
          setDashboardStats(prev => ({
            ...prev,
            ...event.payload
          }));
          break;
        case 'recent_activity_update':
          if (event.payload.recentActivity) {
            setRecentActivities(prev => {
              const newActivities = [...event.payload.recentActivity, ...(prev || [])];
              return newActivities.slice(0, 10); // Keep only last 10
            });
          }
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <RealtimeContext.Provider value={{ status, lastEvent, dashboardStats, recentActivities }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
