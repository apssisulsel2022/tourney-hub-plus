
import { supabase } from "@/integrations/supabase/client";

export const verificationService = {
  verifyTeam: async (tournamentId: string, teamId: string, status: 'verified' | 'rejected', notes?: string) => {
    const { data, error } = await supabase
      .from("tournament_teams")
      .update({
        status: status as any,
        verification_notes: notes || null
      })
      .eq("tournament_id", tournamentId)
      .eq("team_id", teamId)
      .select()
      .single();

    if (error) throw error;

    // Send notification to team manager
    const { data: teamData } = await supabase.from("teams").select("organization_id").eq("id", teamId).single();
    if (teamData) {
        const { data: managerData } = await supabase
            .from("organization_members")
            .select("user_id")
            .eq("organization_id", teamData.organization_id)
            .eq("role", "admin")
            .single();
            
        if (managerData) {
            await supabase.from("notifications").insert({
                user_id: managerData.user_id,
                title: `Registration ${status === 'verified' ? 'Approved' : 'Rejected'}`,
                message: `Your registration for the tournament has been ${status}. ${notes ? 'Note: ' + notes : ''}`,
                type: status === 'verified' ? 'success' : 'error'
            });
        }
    }

    return data;
  },

  verifyPlayer: async (playerId: string, status: 'verified' | 'rejected', notes?: string) => {
    const { data, error } = await supabase
      .from("players")
      .update({
        verification_status: status as any,
        verification_notes: notes || null
      })
      .eq("id", playerId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  checkDoubleRegistration: async (playerId: string, tournamentId: string) => {
    // Check if player's team is registered in the tournament
    const { data: player } = await supabase.from("players").select("team_id, name").eq("id", playerId).single();
    if (!player || !player.team_id) return false;

    // In a more complex scenario, we'd check if the player is registered in multiple teams for the same tournament
    // For now, let's assume one team per player per tournament
    return false; // Implement as needed
  }
};
