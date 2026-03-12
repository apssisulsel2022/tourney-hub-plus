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
        { id: "p3", firstName: "Mike", lastName: "Johnson", position: "GK", jerseyNumber: 1, age: 28 },
        { id: "p4", firstName: "Dan", lastName: "Kim", position: "RW", jerseyNumber: 7, age: 25 },
      ],
    },
    {
      id: "2",
      name: "Red Lions",
      city: "Chicago",
      coachName: "David Chen",
      status: "active",
      foundingDate: "2012-08-20",
      createdAt: "2012-08-20",
      stats: { matchesPlayed: 38, wins: 22, losses: 12, draws: 4, goalsScored: 88, goalsConceded: 51 },
      roster: [
        { id: "p21", firstName: "James", lastName: "Wilson", position: "ST", jerseyNumber: 9, age: 25 },
        { id: "p22", firstName: "Ethan", lastName: "Brown", position: "CB", jerseyNumber: 4, age: 26 },
        { id: "p23", firstName: "Noah", lastName: "Taylor", position: "GK", jerseyNumber: 1, age: 29 },
      ],
    },
    {
      id: "3",
      name: "Blue Eagles",
      city: "Los Angeles",
      coachName: "Sarah Johnson",
      status: "active",
      foundingDate: "2015-03-10",
      createdAt: "2015-03-10",
      stats: { matchesPlayed: 32, wins: 18, losses: 8, draws: 6, goalsScored: 62, goalsConceded: 40 },
      roster: [
        { id: "p31", firstName: "Alex", lastName: "Park", position: "CM", jerseyNumber: 6, age: 24 },
        { id: "p32", firstName: "Ryan", lastName: "Davis", position: "CB", jerseyNumber: 5, age: 26 },
        { id: "p33", firstName: "Chris", lastName: "Moore", position: "LW", jerseyNumber: 11, age: 22 },
      ],
    },
    {
      id: "4",
      name: "Golden Stars",
      city: "Miami",
      coachName: "Alex Petrov",
      status: "active",
      foundingDate: "2018-11-05",
      createdAt: "2018-11-05",
      stats: { matchesPlayed: 28, wins: 15, losses: 10, draws: 3, goalsScored: 54, goalsConceded: 46 },
      roster: [
        { id: "p41", firstName: "Ivan", lastName: "Kuznetsov", position: "CM", jerseyNumber: 8, age: 27 },
        { id: "p42", firstName: "Liam", lastName: "Nguyen", position: "RB", jerseyNumber: 2, age: 25 },
      ],
    },
    {
      id: "5",
      name: "United FC",
      city: "Houston",
      coachName: "James Lee",
      status: "active",
      foundingDate: "2008-01-25",
      createdAt: "2008-01-25",
      stats: { matchesPlayed: 55, wins: 35, losses: 15, draws: 5, goalsScored: 130, goalsConceded: 70 },
      roster: [
        { id: "p51", firstName: "Sam", lastName: "Lee", position: "LB", jerseyNumber: 3, age: 24 },
        { id: "p52", firstName: "Tom", lastName: "Baker", position: "RB", jerseyNumber: 2, age: 25 },
        { id: "p53", firstName: "Lucas", lastName: "Moore", position: "LW", jerseyNumber: 11, age: 22 },
      ],
    },
    {
      id: "6",
      name: "Dynamo City",
      city: "Seattle",
      coachName: "Omar Faruk",
      status: "active",
      foundingDate: "2014-06-30",
      createdAt: "2014-06-30",
      stats: { matchesPlayed: 40, wins: 20, losses: 15, draws: 5, goalsScored: 70, goalsConceded: 66 },
      roster: [
        { id: "p61", firstName: "Omar", lastName: "Faruk", position: "CM", jerseyNumber: 6, age: 28 },
        { id: "p62", firstName: "David", lastName: "Chen", position: "CB", jerseyNumber: 4, age: 27 },
      ],
    },
    {
      id: "7",
      name: "Phoenix SC",
      city: "Phoenix",
      coachName: "Luca Bianchi",
      status: "active",
      foundingDate: "2016-09-12",
      createdAt: "2016-09-12",
      stats: { matchesPlayed: 35, wins: 15, losses: 15, draws: 5, goalsScored: 58, goalsConceded: 60 },
      roster: [
        { id: "p71", firstName: "Ahmed", lastName: "Hassan", position: "ST", jerseyNumber: 9, age: 24 },
        { id: "p72", firstName: "Marco", lastName: "Rossi", position: "CB", jerseyNumber: 5, age: 28 },
      ],
    },
    {
      id: "8",
      name: "Metro FC",
      city: "Denver",
      coachName: "Chris Park",
      status: "inactive",
      foundingDate: "2011-04-01",
      createdAt: "2011-04-01",
      stats: { matchesPlayed: 42, wins: 18, losses: 20, draws: 4, goalsScored: 64, goalsConceded: 82 },
      roster: [
        { id: "p81", firstName: "Chris", lastName: "Park", position: "CM", jerseyNumber: 8, age: 26 },
        { id: "p82", firstName: "Ben", lastName: "Taylor", position: "CAM", jerseyNumber: 10, age: 23 },
      ],
    },
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
        city: "Unknown",
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
      };
      
      this.teams.push(newTeam);
      setTimeout(() => resolve(newTeam), 800);
    });
  }
}

export const teamService = new TeamService();
