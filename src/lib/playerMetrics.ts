export type TimePeriod = "all" | "7d" | "30d" | "90d";

export interface TeamInfo {
  id: string;
  name: string;
  logoUrl?: string;
}

export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";

export interface PlayerMetric {
  id: string;
  name: string;
  photoUrl?: string;
  position: PlayerPosition;
  team: TeamInfo;
  season: string;
  competition: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  passAccuracyPct: number;
  yellowCards: number;
  redCards: number;
  suspensionDays: number;
  violationTypes: string[];
  updatedAt: string;
}

export interface MetricsFilters {
  season: string | "all";
  competition: string | "all";
  teamId: string | "all";
  period: TimePeriod;
  search: string;
}

export const defaultFilters: MetricsFilters = {
  season: "all",
  competition: "all",
  teamId: "all",
  period: "all",
  search: "",
};

export const metricSeasons = ["2024/25", "2025/26", "2026/27"];

export const metricCompetitions = ["Premier Cup 2026", "City League", "Youth Championship"];

export const metricTeams: TeamInfo[] = [
  { id: "T1", name: "FC Thunder" },
  { id: "T2", name: "Red Lions" },
  { id: "T3", name: "Blue Eagles" },
  { id: "T4", name: "Golden Stars" },
  { id: "T5", name: "United FC" },
  { id: "T6", name: "Phoenix SC" },
  { id: "T7", name: "Metro FC" },
  { id: "T8", name: "Dynamo City" },
];

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const goalsPerGame = (p: PlayerMetric) => (p.matchesPlayed > 0 ? p.goals / p.matchesPlayed : 0);
export const assistsPerGame = (p: PlayerMetric) => (p.matchesPlayed > 0 ? p.assists / p.matchesPlayed : 0);

export const disciplineScore = (p: PlayerMetric) => p.yellowCards * 1 + p.redCards * 3;

export const validatePlayerMetric = (p: PlayerMetric) => {
  if (!p || typeof p !== "object") return false;
  const reqNums: Array<keyof PlayerMetric> = [
    "matchesPlayed",
    "goals",
    "assists",
    "passAccuracyPct",
    "yellowCards",
    "redCards",
    "suspensionDays",
  ];
  for (const k of reqNums) {
    const v = p[k] as unknown;
    if (typeof v !== "number" || !Number.isFinite(v)) return false;
  }
  if (!p.id || !p.name || !p.team?.id || !p.team?.name || !p.season || !p.competition) return false;
  if (p.passAccuracyPct < 0 || p.passAccuracyPct > 100) return false;
  return true;
};

export const filterMetrics = (data: PlayerMetric[], f: MetricsFilters) => {
  const search = f.search.trim().toLowerCase();
  let filtered = data.filter(validatePlayerMetric);

  if (f.season !== "all") filtered = filtered.filter((p) => p.season === f.season);
  if (f.competition !== "all") filtered = filtered.filter((p) => p.competition === f.competition);
  if (f.teamId !== "all") filtered = filtered.filter((p) => p.team.id === f.teamId);
  if (search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(search) || p.team.name.toLowerCase().includes(search));
  }

  if (f.period !== "all") {
    const days = f.period === "7d" ? 7 : f.period === "30d" ? 30 : 90;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((p) => new Date(p.updatedAt).getTime() >= threshold);
  }

  return filtered;
};

export const toCsv = (rows: Record<string, string | number>[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: string | number) => {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(","))].join("\n");
};

export const generateMockPlayerMetrics = (count = 28): PlayerMetric[] => {
  const now = new Date();
  const positions: PlayerPosition[] = ["GK", "DEF", "MID", "FWD"];
  const firstNames = ["Carlos", "James", "Ahmed", "Luca", "Kenji", "David", "Tom", "Liam", "Omar", "Alex", "Chris", "Dan", "Ryan", "Sam", "Ben", "Lucas"];
  const lastNames = ["Silva", "Wilson", "Hassan", "Romano", "Tanaka", "Chen", "Baker", "Foster", "Faruk", "Park", "Kim", "Davis", "Lee", "Taylor", "Moore"];
  const violationTypes = ["Dissent", "Foul", "Time wasting", "Violent conduct", "Handball", "Unsporting behavior"];

  return Array.from({ length: count }).map((_, i) => {
    const team = randomFrom(metricTeams);
    const season = randomFrom(metricSeasons);
    const competition = randomFrom(metricCompetitions);
    const matches = 6 + (i % 12);
    const goals = Math.max(0, Math.round((Math.random() * 10) + (i % 3)));
    const assists = Math.max(0, Math.round((Math.random() * 7) + (i % 2)));
    const yellow = Math.round(Math.random() * 4);
    const red = Math.random() > 0.9 ? 1 : 0;
    const suspensionDays = red ? 2 + (i % 3) : yellow >= 5 ? 1 : 0;
    const name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    const updatedAt = new Date(now.getTime() - (i % 40) * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: `PM-${now.getFullYear()}-${String(i + 1).padStart(4, "0")}`,
      name,
      photoUrl: `https://i.pravatar.cc/200?u=${encodeURIComponent(name)}-${i}`,
      position: randomFrom(positions),
      team,
      season,
      competition,
      matchesPlayed: matches,
      goals,
      assists,
      passAccuracyPct: clamp(72 + Math.random() * 20, 0, 100),
      yellowCards: yellow,
      redCards: red,
      suspensionDays,
      violationTypes: Array.from(new Set(Array.from({ length: Math.min(2, yellow + red) }).map(() => randomFrom(violationTypes)))),
      updatedAt,
    };
  });
};

export const applyLiveUpdate = (data: PlayerMetric[]) => {
  const now = new Date().toISOString();
  return data.map((p) => {
    const bump = Math.random();
    const goalInc = bump > 0.92 ? 1 : 0;
    const assistInc = bump > 0.9 && bump <= 0.92 ? 1 : 0;
    const yellowInc = bump > 0.88 && bump <= 0.9 ? 1 : 0;
    const redInc = bump > 0.985 ? 1 : 0;
    return {
      ...p,
      goals: p.goals + goalInc,
      assists: p.assists + assistInc,
      yellowCards: p.yellowCards + yellowInc,
      redCards: p.redCards + redInc,
      suspensionDays: p.suspensionDays + (redInc ? 3 : 0),
      updatedAt: bump > 0.88 ? now : p.updatedAt,
    };
  });
};
