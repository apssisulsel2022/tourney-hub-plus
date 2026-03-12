import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardPage from "@/pages/DashboardPage";
import OrganizationsPage from "@/pages/OrganizationsPage";
import OrganizationDetailPage from "@/pages/organizations/OrganizationDetailPage";
import TournamentsPage from "@/pages/TournamentsPage";
import TournamentDetailPage from "@/pages/TournamentDetailPage";
import TournamentCreatePage from "@/pages/tournaments/TournamentCreatePage";
import TournamentBracketPage from "@/pages/tournaments/TournamentBracketPage";
import TournamentSchedulePage from "@/pages/tournaments/TournamentSchedulePage";
import SeasonManagementPage from "@/pages/tournaments/SeasonManagementPage";
import TeamsPage from "@/pages/TeamsPage";
import TeamDetailPage from "@/pages/teams/TeamDetailPage";
import TeamRegistrationPage from "@/pages/teams/TeamRegistrationPage";
import PlayersPage from "@/pages/PlayersPage";
import PlayerProfilePage from "@/pages/players/PlayerProfilePage";
import PlayerRegistrationPage from "@/pages/players/PlayerRegistrationPage";
import MatchesPage from "@/pages/MatchesPage";
import MatchCenterPage from "@/pages/MatchCenterPage";
import MatchDetailPage from "@/pages/matches/MatchDetailPage";
import MatchReportPage from "@/pages/matches/MatchReportPage";
import VenuesPage from "@/pages/VenuesPage";
import VenueDetailPage from "@/pages/venues/VenueDetailPage";
import RefereesPage from "@/pages/RefereesPage";
import RefereeProfilePage from "@/pages/referees/RefereeProfilePage";
import RefereeAssignmentPage from "@/pages/referees/RefereeAssignmentPage";
import StandingsPage from "@/pages/StandingsPage";
import StatisticsPage from "@/pages/StatisticsPage";
import AdvancedStatsPage from "@/pages/statistics/AdvancedStatsPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import ProfileSettingsPage from "@/pages/settings/ProfileSettingsPage";
import BillingPage from "@/pages/settings/BillingPage";
import CalendarPage from "@/pages/CalendarPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminOrganizationsPage from "@/pages/admin/AdminOrganizationsPage";
import SubscriptionManagementPage from "@/pages/admin/SubscriptionManagementPage";
import PlatformUsersPage from "@/pages/admin/PlatformUsersPage";
import SystemLogsPage from "@/pages/admin/SystemLogsPage";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import PlatformSettingsPage from "@/pages/admin/PlatformSettingsPage";
import ClubManagerDashboard from "@/pages/dashboards/ClubManagerDashboard";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import PublicTournamentHome from "@/pages/public/PublicTournamentHome";
import PublicMatchesPage from "@/pages/public/PublicMatchesPage";
import PublicStandingsPage from "@/pages/public/PublicStandingsPage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Public */}
          <Route path="/public/tournament" element={<PublicTournamentHome />} />
          <Route path="/public/matches" element={<PublicMatchesPage />} />
          <Route path="/public/standings" element={<PublicStandingsPage />} />

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
          <Route path="/organizations/detail" element={<DL><OrganizationDetailPage /></DL>} />

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
          <Route path="/venues/detail" element={<DL><VenueDetailPage /></DL>} />

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
