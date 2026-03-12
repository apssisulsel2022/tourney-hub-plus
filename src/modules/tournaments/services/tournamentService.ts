import { Tournament, CreateTournamentInput } from "../types/tournament";

export const tournamentService = {
  create: async (input: CreateTournamentInput): Promise<Tournament> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...input,
          id: Math.random().toString(36).substr(2, 9),
          status: "draft",
        });
      }, 1000);
    });
  },

  getAll: async (): Promise<Tournament[]> => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  },
};
