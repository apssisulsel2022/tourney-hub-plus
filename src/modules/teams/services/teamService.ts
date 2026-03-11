import React from "react";
import { CreateTeamInput, Team } from "../types/team";

class TeamService {
  private teams: Team[] = [
    {
      id: "1",
      name: "FC Thunder",
      city: "New York",
      coachName: "Marco Rossi",
      status: "active",
      foundingDate: "2010-05-15",
      createdAt: "2010-05-15",
      stats: {
        matchesPlayed: 45,
        wins: 30,
        losses: 10,
        draws: 5,
        goalsScored: 120,
        goalsConceded: 45,
      },
      roster: [
        { id: "p1", firstName: "Carlos", lastName: "Silva", position: "ST", jerseyNumber: 9, age: 24 },
        { id: "p2", firstName: "Ben", lastName: "Taylor", position: "CAM", jerseyNumber: 10, age: 23 },
      ],
    }
  ];

  async getTeams(): Promise<Team[]> {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.teams), 500);
    });
  }

  async getTeamById(id: string): Promise<Team | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.teams.find(t => t.id === id)), 300);
    });
  }

  async createTeam(input: CreateTeamInput): Promise<Team> {
    return new Promise((resolve) => {
      const newTeam: Team = {
        id: Math.random().toString(36).substr(2, 9),
        ...input,
        status: 'active',
        createdAt: new Date().toISOString(),
        stats: {
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          goalsScored: 0,
          goalsConceded: 0,
        },
        roster: input.roster.map(p => ({ ...p, id: Math.random().toString(36).substr(2, 9) })),
      } as Team;
      
      this.teams.push(newTeam);
      setTimeout(() => resolve(newTeam), 800);
    });
  }
}

export const teamService = new TeamService();
