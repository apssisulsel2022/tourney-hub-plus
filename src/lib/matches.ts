/**
 * Matches domain model + mock service layer.
 *
 * Used by:
 * - Admin pages: Matches list/detail/match center
 * - Public pages: schedule/results/match detail
 *
 * Notes:
 * - This is an in-memory demo service (not a real backend).
 * - For production, migrate to a REST/SSE/WebSocket API and replace this service.
 */
export type MatchStatus = "live" | "upcoming" | "completed" | "delayed";

export type MatchEventType = "goal" | "yellow" | "red" | "substitution" | "var";

export interface MatchTeam {
  id: string;
  name: string;
  logo?: string;
}

export interface MatchReferee {
  id: string;
  name: string;
  role: "referee" | "assistant_1" | "assistant_2" | "fourth_official" | "var";
}

export interface MatchWeather {
  condition: "clear" | "cloudy" | "rain" | "storm" | "fog";
  temperatureC: number;
  windKph: number;
  humidityPct: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  team: "home" | "away";
  description: string;
  player?: string;
  playerIn?: string;
  playerOut?: string;
}

export interface MatchLineupPlayer {
  id: string;
  name: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "FWD";
  isStarter: boolean;
  cards: { yellow: number; red: number };
  substitutedInMinute?: number;
  substitutedOutMinute?: number;
}

export interface MatchLineup {
  formation: string;
  starters: MatchLineupPlayer[];
  substitutes: MatchLineupPlayer[];
}

export interface MatchStats {
  possessionPct: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  passingAccuracyPct: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface Match {
  id: string;
  tournament: string;
  round: string;
  dateTime: string;
  venue: {
    name: string;
    city: string;
    capacity: number;
  };
  referees: MatchReferee[];
  weather: MatchWeather;
  status: MatchStatus;
  minute?: number;
  home: MatchTeam;
  away: MatchTeam;
  score: { home: number; away: number };
  preMatch: {
    homeForm: string[];
    awayForm: string[];
    predictedWinPct: { home: number; draw: number; away: number };
  };
  events: MatchEvent[];
  lineups: { home: MatchLineup; away: MatchLineup };
  stats: MatchStats;
}

const teams: MatchTeam[] = [
  { id: "T1", name: "FC Thunder" },
  { id: "T2", name: "Red Lions" },
  { id: "T3", name: "Blue Eagles" },
  { id: "T4", name: "Golden Stars" },
  { id: "T5", name: "United FC" },
  { id: "T6", name: "Phoenix SC" },
  { id: "T7", name: "Metro FC" },
  { id: "T8", name: "Dynamo City" },
];

const tournaments = ["Premier Cup 2026", "City League", "Youth Championship"];

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const pad4 = (n: number) => String(n).padStart(4, "0");

const makeLineupPlayer = (idPrefix: string, number: number, position: MatchLineupPlayer["position"], isStarter: boolean): MatchLineupPlayer => ({
  id: `${idPrefix}-${pad4(number)}`,
  name: `Player ${idPrefix}-${number}`,
  number,
  position,
  isStarter,
  cards: { yellow: 0, red: 0 },
});

const buildLineup = (teamId: string, formation: string): MatchLineup => {
  const starters: MatchLineupPlayer[] = [];
  starters.push(makeLineupPlayer(teamId, 1, "GK", true));
  for (let i = 2; i <= 5; i++) starters.push(makeLineupPlayer(teamId, i, "DEF", true));
  for (let i = 6; i <= 8; i++) starters.push(makeLineupPlayer(teamId, i, "MID", true));
  for (let i = 9; i <= 11; i++) starters.push(makeLineupPlayer(teamId, i, "FWD", true));
  const substitutes: MatchLineupPlayer[] = [];
  for (let i = 12; i <= 18; i++) substitutes.push(makeLineupPlayer(teamId, i, randomFrom(["GK", "DEF", "MID", "FWD"]), false));
  return { formation, starters, substitutes };
};

const buildMatch = (index: number): Match => {
  const home = randomFrom(teams);
  let away = randomFrom(teams);
  while (away.id === home.id) away = randomFrom(teams);

  const status: MatchStatus = index % 9 === 0 ? "delayed" : index % 5 === 0 ? "completed" : index % 3 === 0 ? "live" : "upcoming";
  const minute = status === "live" ? 10 + (index % 80) : undefined;
  const score = status === "upcoming" ? { home: 0, away: 0 } : { home: index % 4, away: (index + 1) % 3 };

  const now = new Date();
  const d = new Date(now.getTime() + (index - 20) * 60 * 60 * 1000);

  return {
    id: `M-${now.getFullYear()}-${pad4(index)}`,
    tournament: randomFrom(tournaments),
    round: `Round ${((index % 12) + 1).toString()}`,
    dateTime: d.toISOString(),
    venue: {
      name: index % 2 === 0 ? "National Stadium" : "City Arena",
      city: index % 2 === 0 ? "New York" : "Houston",
      capacity: index % 2 === 0 ? 45000 : 30000,
    },
    referees: [
      { id: "R1", name: "Alex Morgan", role: "referee" },
      { id: "R2", name: "Jamie Lee", role: "assistant_1" },
      { id: "R3", name: "Sam Patel", role: "assistant_2" },
      { id: "R4", name: "Taylor Kim", role: "fourth_official" },
      { id: "R5", name: "Jordan Smith", role: "var" },
    ],
    weather: {
      condition: randomFrom(["clear", "cloudy", "rain", "fog"]),
      temperatureC: 18 + (index % 10),
      windKph: 8 + (index % 14),
      humidityPct: 40 + (index % 45),
    },
    status,
    minute,
    home,
    away,
    score,
    preMatch: {
      homeForm: ["W", "D", "W", "L", "W"],
      awayForm: ["L", "W", "D", "D", "W"],
      predictedWinPct: { home: 46, draw: 27, away: 27 },
    },
    events: [
      { id: "E1", minute: 12, type: "goal", team: "home", player: "Carlos Silva", description: "Goal by Carlos Silva (Right foot)" },
      { id: "E2", minute: 23, type: "yellow", team: "away", player: "David Chen", description: "Yellow card (Foul)" },
      { id: "E3", minute: 35, type: "goal", team: "away", player: "James Wilson", description: "Goal by James Wilson (Header)" },
      { id: "E4", minute: 45, type: "substitution", team: "home", playerOut: "Marco Rossi", playerIn: "Alex Park", description: "Substitution" },
      { id: "E5", minute: 58, type: "goal", team: "home", player: "Carlos Silva", description: "Goal by Carlos Silva (Penalty)" },
      { id: "E6", minute: 64, type: "var", team: "away", description: "VAR check completed: no penalty" },
    ],
    lineups: {
      home: buildLineup(home.id, "4-3-3"),
      away: buildLineup(away.id, "4-2-3-1"),
    },
    stats: {
      possessionPct: { home: 55, away: 45 },
      shots: { home: 14, away: 9 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 7, away: 4 },
      fouls: { home: 12, away: 15 },
      offsides: { home: 2, away: 1 },
      passingAccuracyPct: { home: 86, away: 81 },
      yellowCards: { home: 1, away: 2 },
      redCards: { home: 0, away: 0 },
    },
  };
};

const matchStorage: Match[] = Array.from({ length: 120 }).map((_, i) => buildMatch(i + 1));

export type MatchListSort = "date_desc" | "date_asc" | "status" | "tournament";

export const matchService = {
  list: async (args: {
    page: number;
    limit: number;
    search?: string;
    status?: MatchStatus | "all";
    tournament?: string | "all";
    sort?: MatchListSort;
  }) => {
    const { page, limit, search, status = "all", tournament = "all", sort = "date_desc" } = args;
    await new Promise((r) => setTimeout(r, 250));

    let data = [...matchStorage];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter((m) =>
        m.id.toLowerCase().includes(s) ||
        m.home.name.toLowerCase().includes(s) ||
        m.away.name.toLowerCase().includes(s) ||
        m.venue.name.toLowerCase().includes(s) ||
        m.tournament.toLowerCase().includes(s),
      );
    }
    if (status !== "all") data = data.filter((m) => m.status === status);
    if (tournament !== "all") data = data.filter((m) => m.tournament === tournament);

    if (sort === "date_desc") data.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    if (sort === "date_asc") data.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    if (sort === "status") data.sort((a, b) => a.status.localeCompare(b.status));
    if (sort === "tournament") data.sort((a, b) => a.tournament.localeCompare(b.tournament));

    const total = data.length;
    const start = (page - 1) * limit;
    return {
      items: data.slice(start, start + limit),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  getById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 200));
    return matchStorage.find((m) => m.id === id);
  },

  updateLive: async (id: string, patch: Partial<Pick<Match, "score" | "status" | "minute" | "events" | "stats">>) => {
    const idx = matchStorage.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    matchStorage[idx] = { ...matchStorage[idx], ...patch };
    return matchStorage[idx];
  },

  tournaments: () => tournaments,
};
