import { useState } from "react";
import { TournamentDetailsHeader } from "@/modules/tournaments/components/TournamentDetailsHeader";
import { TournamentTabs } from "@/modules/tournaments/components/TournamentTabs";
import { OverviewTab } from "@/modules/tournaments/components/OverviewTab";
import { TeamsTab } from "@/modules/tournaments/components/TeamsTab";
import { StandingsTab } from "@/modules/tournaments/components/StandingsTab";
import { MatchesTab } from "@/modules/tournaments/components/MatchesTab";
import { PlayersTab } from "@/modules/tournaments/components/PlayersTab";
import { StatisticsTab } from "@/modules/tournaments/components/StatisticsTab";
import { SettingsTab } from "@/modules/tournaments/components/SettingsTab";
import { Tournament } from "@/modules/tournaments/types/tournament";

const tabs = ["Overview", "Teams", "Matches", "Standings", "Players", "Statistics", "Settings"];

const mockTournament: Tournament = {
  id: "1",
  name: "Premier Cup 2026",
  status: "active",
  location: "National Stadium, New York",
  startDate: "Mar 1",
  endDate: "Apr 15, 2026",
  maxTeams: 8,
  ageCategory: "U-21",
  format: "League",
  organizationId: "org-1",
};

export default function TournamentDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6 pb-20">
      <TournamentDetailsHeader tournament={mockTournament} />
      
      <TournamentTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Teams" && <TeamsTab />}
        {activeTab === "Standings" && <StandingsTab />}
        {activeTab === "Matches" && <MatchesTab />}
        {activeTab === "Players" && <PlayersTab />}
        {activeTab === "Statistics" && <StatisticsTab />}
        {activeTab === "Settings" && <SettingsTab />}
      </div>
    </div>
  );
}
