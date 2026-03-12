import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import NotFound from "@/pages/NotFound";

import { RealtimeProvider } from "@/modules/realtime/hooks/useRealtime";

const queryClient = new QueryClient();

const DL = ({ children }: { children: React.ReactNode }) => (
  <RealtimeProvider>
    <DashboardLayout>{children}</DashboardLayout>
  </RealtimeProvider>
);
const AL = ({ children }: { children: React.ReactNode }) => (
  <RealtimeProvider>
    <AdminLayout>{children}</AdminLayout>
  </RealtimeProvider>
);

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));

const PublicTournamentHome = lazy(() => import("@/pages/public/PublicTournamentHome"));
const PublicMatchesPage = lazy(() => import("@/pages/public/PublicMatchesPage"));
const PublicMatchDetailPage = lazy(() => import("@/pages/public/PublicMatchDetailPage"));
const PublicStandingsPage = lazy(() => import("@/pages/public/PublicStandingsPage"));
const PublicTeamsPage = lazy(() => import("@/pages/public/PublicTeamsPage"));
const PublicTeamDetailPage = lazy(() => import("@/pages/public/PublicTeamDetailPage"));
const PublicPlayersPage = lazy(() => import("@/pages/public/PublicPlayersPage"));
const PublicPlayerProfilePage = lazy(() => import("@/pages/public/PublicPlayerProfilePage"));
const PublicStatisticsPage = lazy(() => import("@/pages/public/PublicStatisticsPage"));

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const OrganizationsPage = lazy(() => import("@/pages/OrganizationsPage"));
const OrganizationDetailPage = lazy(() => import("@/pages/organizations/OrganizationDetailPage"));
const TournamentsPage = lazy(() => import("@/pages/TournamentsPage"));
const TournamentDetailPage = lazy(() => import("@/pages/TournamentDetailPage"));
const TournamentCreatePage = lazy(() => import("@/pages/tournaments/TournamentCreatePage"));
const TournamentBracketPage = lazy(() => import("@/pages/tournaments/TournamentBracketPage"));
const TournamentSchedulePage = lazy(() => import("@/pages/tournaments/TournamentSchedulePage"));
const SeasonManagementPage = lazy(() => import("@/pages/tournaments/SeasonManagementPage"));
const TeamsPage = lazy(() => import("@/pages/TeamsPage"));
const TeamDetailPage = lazy(() => import("@/pages/teams/TeamDetailPage"));
const TeamRegistrationPage = lazy(() => import("@/pages/teams/TeamRegistrationPage"));
const PlayersPage = lazy(() => import("@/pages/PlayersPage"));
const PlayerProfilePage = lazy(() => import("@/pages/players/PlayerProfilePage"));
const PlayerRegistrationPage = lazy(() => import("@/pages/players/PlayerRegistrationPage"));
const MatchesPage = lazy(() => import("@/pages/MatchesPage"));
const MatchCenterPage = lazy(() => import("@/pages/MatchCenterPage"));
const MatchDetailPage = lazy(() => import("@/pages/matches/MatchDetailPage"));
const MatchReportPage = lazy(() => import("@/pages/matches/MatchReportPage"));
const VenuesPage = lazy(() => import("@/pages/VenuesPage"));
const VenueProfilePage = lazy(() => import("@/pages/venues/VenueProfilePage"));
const VenueSchedulePage = lazy(() => import("@/pages/venues/VenueSchedulePage"));
const RefereesPage = lazy(() => import("@/pages/RefereesPage"));
const RefereeProfilePage = lazy(() => import("@/pages/referees/RefereeProfilePage"));
const RefereeAssignmentPage = lazy(() => import("@/pages/referees/RefereeAssignmentPage"));
const StandingsPage = lazy(() => import("@/pages/StandingsPage"));
const StatisticsPage = lazy(() => import("@/pages/StatisticsPage"));
const AdvancedStatsPage = lazy(() => import("@/pages/statistics/AdvancedStatsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ProfileSettingsPage = lazy(() => import("@/pages/settings/ProfileSettingsPage"));
const BillingPage = lazy(() => import("@/pages/settings/BillingPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminOrganizationsPage = lazy(() => import("@/pages/admin/AdminOrganizationsPage"));
const SubscriptionManagementPage = lazy(() => import("@/pages/admin/SubscriptionManagementPage"));
const PlatformUsersPage = lazy(() => import("@/pages/admin/PlatformUsersPage"));
const SystemLogsPage = lazy(() => import("@/pages/admin/SystemLogsPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const PlatformSettingsPage = lazy(() => import("@/pages/admin/PlatformSettingsPage"));
const ClubManagerDashboard = lazy(() => import("@/pages/dashboards/ClubManagerDashboard"));

const AppFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-sm font-bold text-muted-foreground">Loading…</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<AppFallback />}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Public */}
            <Route path="/public" element={<PublicTournamentHome />} />
            <Route path="/public/tournament" element={<PublicTournamentHome />} />
            <Route path="/public/matches" element={<PublicMatchesPage />} />
            <Route path="/public/matches/:id" element={<PublicMatchDetailPage />} />
            <Route path="/public/matches/:id/center" element={<MatchCenterPage />} />
            <Route path="/public/standings" element={<PublicStandingsPage />} />
            <Route path="/public/teams" element={<PublicTeamsPage />} />
            <Route path="/public/teams/:id" element={<PublicTeamDetailPage />} />
            <Route path="/public/players" element={<PublicPlayersPage />} />
            <Route path="/public/players/:id" element={<PublicPlayerProfilePage />} />
            <Route path="/public/statistics" element={<PublicStatisticsPage />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AL><AdminDashboardPage /></AL>} />
            <Route path="/admin/organizations" element={<AL><AdminOrganizationsPage /></AL>} />
            <Route path="/admin/subscriptions" element={<AL><SubscriptionManagementPage /></AL>} />
            <Route path="/admin/users" element={<AL><PlatformUsersPage /></AL>} />
            <Route path="/admin/system-logs" element={<AL><SystemLogsPage /></AL>} />
            <Route path="/admin/analytics" element={<AL><AdminAnalyticsPage /></AL>} />
            <Route path="/admin/platform-settings" element={<AL><PlatformSettingsPage /></AL>} />

            {/* Dashboard */}
            <Route path="/" element={<DL><DashboardPage /></DL>} />
            <Route path="/calendar" element={<DL><CalendarPage /></DL>} />
            <Route path="/notifications" element={<DL><NotificationsPage /></DL>} />

            {/* Organizations */}
            <Route path="/organizations" element={<DL><OrganizationsPage /></DL>} />
            <Route path="/organizations/:id" element={<DL><OrganizationDetailPage /></DL>} />

            {/* Tournaments */}
            <Route path="/tournaments" element={<DL><TournamentsPage /></DL>} />
            <Route path="/tournaments/detail" element={<DL><TournamentDetailPage /></DL>} />
            <Route path="/tournaments/create" element={<DL><TournamentCreatePage /></DL>} />
            <Route path="/tournaments/bracket" element={<DL><TournamentBracketPage /></DL>} />
            <Route path="/tournaments/schedule" element={<DL><TournamentSchedulePage /></DL>} />
            <Route path="/tournaments/seasons" element={<DL><SeasonManagementPage /></DL>} />

            {/* Teams */}
            <Route path="/teams" element={<DL><TeamsPage /></DL>} />
            <Route path="/teams/:id" element={<DL><TeamDetailPage /></DL>} />
            <Route path="/teams/create" element={<DL><TeamRegistrationPage /></DL>} />

            {/* Players */}
            <Route path="/players" element={<DL><PlayersPage /></DL>} />
            <Route path="/players/:id" element={<DL><PlayerProfilePage /></DL>} />
            <Route path="/players/register" element={<DL><PlayerRegistrationPage /></DL>} />

            {/* Matches */}
            <Route path="/matches" element={<DL><MatchesPage /></DL>} />
            <Route path="/matches/:id" element={<DL><MatchDetailPage /></DL>} />
            <Route path="/matches/center" element={<DL><MatchCenterPage /></DL>} />
            <Route path="/matches/:id/center" element={<DL><MatchCenterPage /></DL>} />
            <Route path="/matches/report" element={<DL><MatchReportPage /></DL>} />

            {/* Venues */}
            <Route path="/venues" element={<DL><VenuesPage /></DL>} />
            <Route path="/venues/:id" element={<DL><VenueProfilePage /></DL>} />
            <Route path="/venues/:id/schedule" element={<DL><VenueSchedulePage /></DL>} />

            {/* Referees */}
            <Route path="/referees" element={<DL><RefereesPage /></DL>} />
            <Route path="/referees/profile" element={<DL><RefereeProfilePage /></DL>} />
            <Route path="/referees/assignments" element={<DL><RefereeAssignmentPage /></DL>} />

            {/* Standings & Stats */}
            <Route path="/standings" element={<DL><StandingsPage /></DL>} />
            <Route path="/statistics" element={<DL><StatisticsPage /></DL>} />
            <Route path="/statistics/advanced" element={<DL><AdvancedStatsPage /></DL>} />

            {/* Reports & Settings */}
            <Route path="/reports" element={<DL><ReportsPage /></DL>} />
            <Route path="/settings" element={<DL><SettingsPage /></DL>} />
            <Route path="/settings/profile" element={<DL><ProfileSettingsPage /></DL>} />
            <Route path="/settings/billing" element={<DL><BillingPage /></DL>} />

            {/* Club Manager */}
            <Route path="/club-dashboard" element={<DL><ClubManagerDashboard /></DL>} />

            <Route path="/media" element={<DL><div>Media Page</div></DL>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
