
import { supabase } from "@/integrations/supabase/client";

export const schedulingService = {
  generateRoundRobin: async (tournamentId: string, organizationId: string, teamIds: string[], startDate: string) => {
    if (teamIds.length < 2) return;

    const teams = [...teamIds];
    if (teams.length % 2 !== 0) {
      teams.push("BYE"); // Handle odd number of teams
    }

    const numTeams = teams.length;
    const numRounds = numTeams - 1;
    const halfNumTeams = numTeams / 2;
    const matches = [];

    let currentDate = new Date(startDate);

    for (let round = 0; round < numRounds; round++) {
      for (let i = 0; i < halfNumTeams; i++) {
        const home = teams[i];
        const away = teams[numTeams - 1 - i];

        if (home !== "BYE" && away !== "BYE") {
          matches.push({
            tournament_id: tournamentId,
            organization_id: organizationId,
            home_team_id: home,
            away_team_id: away,
            status: "upcoming" as any,
            round: `Round ${round + 1}`,
            date_time: currentDate.toISOString(),
          });
        }
      }

      // Rotate teams for next round (keep first team fixed)
      teams.splice(1, 0, teams.pop()!);
      
      // Advance date by 1 week for each round (simple logic for now)
      currentDate.setDate(currentDate.getDate() + 7);
    }

    const { error } = await supabase.from("matches").insert(matches);
    if (error) throw error;
    
    return matches;
  },

  generateKnockout: async (tournamentId: string, organizationId: string, teamIds: string[], startDate: string) => {
    if (teamIds.length < 2) return;

    // Simplified knockout generation (Round of 16, Quarter, Semi, Final)
    // In a real app, this would be more complex to handle seeds and brackets
    const matches = [];
    let currentDate = new Date(startDate);
    
    // Shuffle teams
    const shuffledTeams = [...teamIds].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      if (shuffledTeams[i + 1]) {
        matches.push({
          tournament_id: tournamentId,
          organization_id: organizationId,
          home_team_id: shuffledTeams[i],
          away_team_id: shuffledTeams[i + 1],
          status: "upcoming" as any,
          round: "Round of " + (shuffledTeams.length),
          date_time: currentDate.toISOString(),
        });
      }
    }

    const { error } = await supabase.from("matches").insert(matches);
    if (error) throw error;
    
    return matches;
  }
};
