import { CreateTournamentInput } from "../types/tournament";
import { supabase } from "@/integrations/supabase/client";

const FORMAT_MAP: Record<string, string> = {
  "League": "league",
  "Knockout": "knockout",
  "Group Stage + Knockout": "group_knockout",
  "Round Robin": "round_robin",
};

const AGE_MAP: Record<string, string> = {
  "Senior": "senior",
  "U-21": "u21",
  "U-19": "u19",
  "U-17": "u17",
  "U-15": "u15",
};

export const tournamentService = {
  create: async (input: CreateTournamentInput, status: "draft" | "upcoming" = "upcoming") => {
    const { data, error } = await supabase
      .from("tournaments")
      .insert({
        name: input.name,
        description: input.description || null,
        format: FORMAT_MAP[input.format] as any,
        age_category: AGE_MAP[input.ageCategory] as any,
        start_date: input.startDate || null,
        end_date: input.endDate || null,
        location: input.location || null,
        max_teams: input.maxTeams || 16,
        registration_deadline: input.registrationDeadline || null,
        logo_url: input.logoUrl || null,
        organization_id: input.organizationId,
        status,
      })
      .select()
      .single();

    if (error) throw error;

    // Register selected teams
    if (input.selectedTeamIds && input.selectedTeamIds.length > 0 && data) {
      const teamRows = input.selectedTeamIds.map((teamId) => ({
        tournament_id: data.id,
        team_id: teamId,
      }));

      const { error: teamsError } = await supabase.from("tournament_teams").insert(teamRows);
      if (teamsError) console.error("Failed to register teams:", teamsError);
    }

    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
