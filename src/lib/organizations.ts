/**
 * Organizations domain model + mock service layer.
 *
 * Current behavior:
 * - In-memory storage (demo dataset)
 * - Artificial latency via setTimeout
 * - ID uniqueness assertions to prevent accidental collisions in UI joins
 */
export type OrganizationStatus = "active" | "inactive";
export type MemberStatus = "active" | "invited" | "suspended";

export type OrganizationMemberRole = "Admin" | "Manager" | "Coordinator" | "Referee Manager" | "Analyst";

export type OrganizationMember = {
  id: string;
  name: string;
  email: string;
  role: OrganizationMemberRole;
  status: MemberStatus;
  lastActiveISO: string;
};

export type OrganizationTournament = {
  id: string;
  name: string;
  teams: number;
  status: "active" | "upcoming" | "draft";
};

export type Organization = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  location: { city: string; country: string };
  foundedYear: number;
  plan: "Starter" | "Pro" | "Enterprise";
  status: OrganizationStatus;
  metrics: {
    activeTournaments: number;
    totalTeams: number;
    totalPlayers: number;
    monthlyRevenueUsd: number;
    users: number;
  };
  metadata: {
    timezone: string;
    website: string;
    contactEmail: string;
    createdISO: string;
    lastBillingISO: string;
    region: string;
  };
  members: OrganizationMember[];
  tournaments: OrganizationTournament[];
};

const organizationsStorage: Organization[] = [
  {
    id: "org-cfa",
    name: "City Football Association",
    shortName: "CFA",
    description:
      "A regional governing body supporting local leagues and tournaments, with a focus on youth development, match officiating standards, and transparent competition operations.",
    location: { city: "New York", country: "USA" },
    foundedYear: 2019,
    plan: "Enterprise",
    status: "active",
    metrics: { activeTournaments: 5, totalTeams: 48, totalPlayers: 960, monthlyRevenueUsd: 199, users: 12 },
    metadata: {
      timezone: "America/New_York",
      website: "https://cityfootball.example.com",
      contactEmail: "support@cityfootball.example.com",
      createdISO: "2019-04-12T10:00:00.000Z",
      lastBillingISO: "2026-03-01T00:00:00.000Z",
      region: "North America",
    },
    members: [
      { id: "cfa-m1", name: "Sarah Connor", role: "Admin", email: "sarah@cityfootball.com", status: "active", lastActiveISO: "2026-03-11T18:42:00.000Z" },
      { id: "cfa-m2", name: "John Doe", role: "Manager", email: "john@cityfootball.com", status: "active", lastActiveISO: "2026-03-11T09:18:00.000Z" },
      { id: "cfa-m3", name: "Lisa Chen", role: "Coordinator", email: "lisa@cityfootball.com", status: "active", lastActiveISO: "2026-03-10T21:05:00.000Z" },
      { id: "cfa-m4", name: "Mike Lee", role: "Referee Manager", email: "mike@cityfootball.com", status: "active", lastActiveISO: "2026-03-09T15:12:00.000Z" },
      { id: "cfa-m5", name: "Alicia Park", role: "Analyst", email: "alicia@cityfootball.com", status: "invited", lastActiveISO: "2026-03-01T08:00:00.000Z" },
      { id: "cfa-m6", name: "Brian Stone", role: "Coordinator", email: "brian@cityfootball.com", status: "suspended", lastActiveISO: "2026-02-02T12:00:00.000Z" },
    ],
    tournaments: [
      { id: "cfa-t1", name: "Premier Cup 2026", teams: 8, status: "active" },
      { id: "cfa-t2", name: "City League Season 8", teams: 12, status: "active" },
      { id: "cfa-t3", name: "Youth Championship", teams: 24, status: "upcoming" },
      { id: "cfa-t4", name: "Summer Invitational", teams: 8, status: "draft" },
      { id: "cfa-t5", name: "Women's Cup 2026", teams: 10, status: "active" },
    ],
  },
  {
    id: "org-nyl",
    name: "National Youth League",
    shortName: "NYL",
    description: "National youth competition operator focused on safe play, coaching development, and consistent league administration.",
    location: { city: "London", country: "UK" },
    foundedYear: 2017,
    plan: "Pro",
    status: "active",
    metrics: { activeTournaments: 3, totalTeams: 26, totalPlayers: 520, monthlyRevenueUsd: 99, users: 8 },
    metadata: {
      timezone: "Europe/London",
      website: "https://youthleague.example.com",
      contactEmail: "help@youthleague.example.com",
      createdISO: "2017-09-05T10:00:00.000Z",
      lastBillingISO: "2026-03-01T00:00:00.000Z",
      region: "Europe",
    },
    members: [
      { id: "nyl-m1", name: "Emma Walsh", role: "Admin", email: "emma@youthleague.example.com", status: "active", lastActiveISO: "2026-03-11T12:30:00.000Z" },
      { id: "nyl-m2", name: "Oliver Reed", role: "Manager", email: "oliver@youthleague.example.com", status: "active", lastActiveISO: "2026-03-10T09:00:00.000Z" },
      { id: "nyl-m3", name: "Noah Patel", role: "Coordinator", email: "noah@youthleague.example.com", status: "active", lastActiveISO: "2026-03-10T16:10:00.000Z" },
    ],
    tournaments: [
      { id: "nyl-t1", name: "U16 National League", teams: 14, status: "active" },
      { id: "nyl-t2", name: "U14 Development Cup", teams: 12, status: "active" },
      { id: "nyl-t3", name: "Winter Youth Series", teams: 10, status: "upcoming" },
    ],
  },
  {
    id: "org-copa",
    name: "Copa Regional",
    shortName: "CR",
    description: "Regional tournament series with integrated scheduling, officiating assignments, and performance reporting.",
    location: { city: "São Paulo", country: "Brazil" },
    foundedYear: 2020,
    plan: "Pro",
    status: "active",
    metrics: { activeTournaments: 2, totalTeams: 18, totalPlayers: 360, monthlyRevenueUsd: 99, users: 5 },
    metadata: {
      timezone: "America/Sao_Paulo",
      website: "https://coparegional.example.com",
      contactEmail: "support@coparegional.example.com",
      createdISO: "2020-02-22T10:00:00.000Z",
      lastBillingISO: "2026-03-01T00:00:00.000Z",
      region: "South America",
    },
    members: [
      { id: "copa-m1", name: "Rafa Silva", role: "Admin", email: "rafa@coparegional.example.com", status: "active", lastActiveISO: "2026-03-11T02:10:00.000Z" },
      { id: "copa-m2", name: "Ana Costa", role: "Coordinator", email: "ana@coparegional.example.com", status: "active", lastActiveISO: "2026-03-10T19:12:00.000Z" },
    ],
    tournaments: [
      { id: "copa-t1", name: "Copa Regional Series A", teams: 10, status: "active" },
      { id: "copa-t2", name: "Copa Regional U21", teams: 8, status: "upcoming" },
    ],
  },
  {
    id: "org-efn",
    name: "Euro Futsal Network",
    shortName: "EFN",
    description: "A futsal-focused competition organizer providing match operations, referee coordination, and standings analytics.",
    location: { city: "Berlin", country: "Germany" },
    foundedYear: 2018,
    plan: "Starter",
    status: "inactive",
    metrics: { activeTournaments: 1, totalTeams: 10, totalPlayers: 180, monthlyRevenueUsd: 29, users: 3 },
    metadata: {
      timezone: "Europe/Berlin",
      website: "https://futsalnet.example.com",
      contactEmail: "support@futsalnet.example.com",
      createdISO: "2018-06-01T10:00:00.000Z",
      lastBillingISO: "2026-02-01T00:00:00.000Z",
      region: "Europe",
    },
    members: [
      { id: "efn-m1", name: "Lena Fischer", role: "Manager", email: "lena@futsalnet.example.com", status: "active", lastActiveISO: "2026-02-20T10:30:00.000Z" },
      { id: "efn-m2", name: "Max Weber", role: "Coordinator", email: "max@futsalnet.example.com", status: "invited", lastActiveISO: "2026-02-01T08:00:00.000Z" },
    ],
    tournaments: [{ id: "efn-t1", name: "Euro Futsal Cup", teams: 10, status: "draft" }],
  },
  {
    id: "org-aco",
    name: "Asian Cup Org",
    shortName: "ACO",
    description: "Multi-division cup organizer supporting qualification formats, venue management, and referee reporting.",
    location: { city: "Tokyo", country: "Japan" },
    foundedYear: 2016,
    plan: "Enterprise",
    status: "active",
    metrics: { activeTournaments: 4, totalTeams: 34, totalPlayers: 720, monthlyRevenueUsd: 199, users: 10 },
    metadata: {
      timezone: "Asia/Tokyo",
      website: "https://asiacup.example.com",
      contactEmail: "support@asiacup.example.com",
      createdISO: "2016-01-12T10:00:00.000Z",
      lastBillingISO: "2026-03-01T00:00:00.000Z",
      region: "Asia",
    },
    members: [
      { id: "aco-m1", name: "Hana Sato", role: "Admin", email: "hana@asiacup.example.com", status: "active", lastActiveISO: "2026-03-11T10:20:00.000Z" },
      { id: "aco-m2", name: "Kenji Tanaka", role: "Manager", email: "kenji@asiacup.example.com", status: "active", lastActiveISO: "2026-03-11T01:05:00.000Z" },
    ],
    tournaments: [
      { id: "aco-t1", name: "Asian Cup 2026", teams: 16, status: "active" },
      { id: "aco-t2", name: "East Division League", teams: 12, status: "active" },
      { id: "aco-t3", name: "U18 Cup", teams: 20, status: "upcoming" },
      { id: "aco-t4", name: "Futsal Invitational", teams: 8, status: "draft" },
    ],
  },
];

const assertUniqueIds = (items: Array<{ id: string }>) => {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate id detected: ${item.id}`);
    seen.add(item.id);
  }
};

assertUniqueIds(organizationsStorage);
for (const org of organizationsStorage) {
  assertUniqueIds(org.members);
  assertUniqueIds(org.tournaments);
}

/**
 * Public API used by pages:
 * - list() for OrganizationsPage
 * - getById() for OrganizationDetailPage (route param :id)
 */
export const organizationsService = {
  list: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return [...organizationsStorage];
  },
  getById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 220));
    return organizationsStorage.find((o) => o.id === id) ?? null;
  },
};

