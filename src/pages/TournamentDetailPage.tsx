import { useState } from "react";
import { TournamentDetailsHeader } from "@/modules/tournaments/components/TournamentDetailsHeader";
import { TournamentTabs } from "@/modules/tournaments/components/TournamentTabs";
import { OverviewTab } from "@/modules/tournaments/components/OverviewTab";
import { TeamsTab } from "@/modules/tournaments/components/TeamsTab";
import { StandingsTab } from "@/modules/tournaments/components/StandingsTab";
import { MatchesTab } from "@/modules/tournaments/components/MatchesTab";
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
};

export default function TournamentDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      <TournamentDetailsHeader tournament={mockTournament} />
      
      <TournamentTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Tab Content */}
      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Teams" && <TeamsTab />}
      {activeTab === "Standings" && <StandingsTab />}
      {activeTab === "Matches" && <MatchesTab />}

      {(activeTab === "Players" || activeTab === "Statistics" || activeTab === "Settings") && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <p>Content for {activeTab} tab coming soon...</p>
        </div>
      )}
    </div>
  );
}
