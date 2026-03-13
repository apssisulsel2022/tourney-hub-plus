# Backend API Design & Database Schema

**Generated:** March 13, 2026  
**Analysis Based On:** UI Pages, Components, and Existing Data Models

---

## 📋 Executive Summary

This document defines all backend APIs and database requirements needed to support the existing UI pages and components in Tourney Hub Plus. The analysis identifies **13 core data entities** used across **25+ UI pages** and maps them to required REST endpoints and database tables.

**Status:** 
- ✅ Database schema partially designed (Supabase migrations exist)
- ✅ Core entities identified
- ❌ Backend services not yet implemented
- ❌ Mock services currently in use

---

## 1. Data Entity Analysis

### 1.1 Entities Used by UI (Identified from Pages & Components)

| Entity | UI Pages Using It | Key Properties | Status |
|--------|-------------------|-----------------|--------|
| **Tournament** | TournamentsPage, DashboardPage, MatchesPage, TournamentDetailPage | id, name, format, status, teams, maxTeams, dates, location, ageCategory | Core |
| **Team** | TeamsPage, MatchesPage, TournamentsPage, PlayersPage, StandingsPage, StatisticsPage | id, name, city, coach, players[], status, logo, stats | Core |
| **Match** | MatchesPage, MatchCenterPage, DashboardPage, TournamentDetailPage | id, homeTeam, awayTeam, score, status, date, venue, tournament, events[], referees[] | Core |
| **Player** | PlayersPage, ProfilePage, StatisticsPage, Teams (roster) | id, name, position, club, photo, stats, ageCategory, documents[], training[], matches[] | Core |
| **Venue** | VenuesPage, MatchesPage, VenueDetailPage | id, name, city, capacity, type, amenities, bookings[], location(lat,lng) | Core |
| **Referee** | RefereesPage, Match (officials) | id, name, email, role (Referee/Linesman), assignedMatches[], status | Core |
| **Organization** | OrganizationsPage, DashboardPage (context) | id, name, owner, members[], status, plan, tournaments[], teams[], location | Core |
| **Standing** | StandingsPage, TournamentDetailPage | id, team, tournament, position, played, wins, draws, losses, points, goalsFor, goalsAgainst | Derived |
| **PlayerStatistic** | StatisticsPage | id, player, season, competition, goals, assists, yellowCards, redCards, minutesPlayed | Derived |
| **Match Event** | MatchCenterPage (match details) | id, match, team, type (Goal/Card/Substitution), player, minute, description | Sub-Entity |
| **Notification** | NotificationsPage | id, user, type, title, message, read, createdAt | Core |
| **Report** | ReportsPage | id, tournament, type, generatedBy, data, createdAt | Core |
| **Booking** | VenuesPage (implied) | id, venue, date, team, status | Core |
| **User/Profile** | All pages (Auth context) | id, email, name, role, organization | Core |

### 1.2 Data Entity Relationships

```
Organization
├── members (User)
├── tournaments[] (Tournament)
├── teams[] (Team)
├── venues[] (Venue)
├── referees[] (Referee)
└── reports[] (Report)

Tournament
├── organization (Organization)
├── teams[] (Team via tournament_teams junction)
├── matches[] (Match)
├── standings[] (Standing)
└── format, ageCategory, status

Team
├── organization (Organization)
├── roster[] (Player)
├── matches[] (Match as homeTeam or awayTeam)
├── statistics[] (Standing)
└── coach (User)

Match
├── tournament (Tournament)
├── homeTeam (Team)
├── awayTeam (Team)
├── venue (Venue)
├── events[] (MatchEvent)
├── referees[] (Referee via match_referees junction)
└── status, score, date

Player
├── team (Team)
├── organization (Organization)
├── statistics[] (PlayerStatistic)
├── matchHistory[] (Match participation)
├── documents[] (Media)
└── matchEvents[] (MatchEvent via player_id)

Venue
├── organization (Organization)
├── bookings[] (Booking)
└── matches[] (Match)

Referee
├── organization (Organization)
├── assignedMatches[] (Match via match_referees)
└── user (User)

User/Profile
├── organization[] (as member)
├── tournaments[] (as organizer)
├── matches[] (as referee)
└── preferences, settings

Standing (derived from matches)
├── tournament (Tournament)
├── team (Team)
└── calculated fields (points, goal diff, position)

PlayerStatistic (derived from matches)
├── player (Player)
├── competition/tournament reference
└── aggregated stats

Notification
├── user (User)
└── reference entities (Match, Tournament, etc.)

Report
├── organization (Organization)
├── tournament (Tournament, optional)
└── generatedBy (User)

Booking
├── venue (Venue)
├── team (Team)
└── status, dates
```

---

## 2. Backend API Endpoints Required

### 2.1 Tournaments API

**Base Path:** `/api/v1/tournaments`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List tournaments with filters, search, sort | TournamentsPage |
| GET | `/:id` | Get tournament detail with all tabs | TournamentDetailPage |
| POST | `/` | Create new tournament | TournamentsPage (Create) |
| PUT | `/:id` | Update tournament details | TournamentDetailPage (Edit) |
| DELETE | `/:id` | Delete tournament | TournamentsPage |
| GET | `/:id/matches` | Get all matches in tournament | MatchesPage, TournamentDetailPage |
| GET | `/:id/standings` | Get league standings for tournament | StandingsPage, TournamentDetailPage |
| GET | `/:id/teams` | Get teams registered in tournament | TournamePageDetailPage |
| GET | `/:id/teams/:teamId` | Team details in tournament | TournamentDetailPage |
| POST | `/:id/teams` | Register team in tournament | TournamentDetailPage |
| DELETE | `/:id/teams/:teamId` | Unregister team from tournament | TournamentDetailPage |
| GET | `/:id/statistics` | Get tournament statistics | StatisticsPage |
| GET | `/:id/bracket` | Get tournament bracket structure | TournamentDetailPage |

**Query Params (List endpoint):**
- `search` (string) - search by name/location
- `status` (active|upcoming|completed|draft) - filter by status
- `category` (U-21|U-19|U-17|Senior) - filter by age category
- `sort` (newest|name|teams) - sort order
- `page`, `limit` - pagination

**Response Example (List):**
```json
{
  "items": [
    {
      "id": "t1",
      "name": "Premier Cup 2026",
      "format": "League",
      "status": "active",
      "ageCategory": "Senior",
      "teams": 14,
      "maxTeams": 16,
      "startDate": "2026-03-01",
      "endDate": "2026-04-15",
      "location": "New York",
      "matches": 28,
      "logoUrl": "...",
      "organization": { "id": "o1", "name": "..." }
    }
  ],
  "total": 5,
  "totalPages": 1,
  "page": 1
}
```

---

### 2.2 Matches API

**Base Path:** `/api/v1/matches`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List matches with filters | MatchesPage |
| GET | `/:id` | Get match detail (scores, events, lineups) | MatchCenterPage |
| POST | `/` | Create new match | MatchesPage (Create) |
| PUT | `/:id` | Update match (score, status) | MatchCenterPage |
| DELETE | `/:id` | Delete match | MatchesPage |
| POST | `/:id/events` | Add match event (goal, card, subsitution) | MatchCenterPage |
| DELETE | `/:id/events/:eventId` | Remove match event | MatchCenterPage |
| GET | `/:id/lineups` | Get lineups for match | MatchCenterPage |
| POST | `/:id/lineups` | Set lineups for match | MatchCenterPage |
| POST | `/:id/start` | Start match (status change to live) | MatchCenterPage |
| POST | `/:id/end` | End match (status change to completed) | MatchCenterPage |
| GET | `/teams/:teamId` | Get team's matches | TeamsPage (detail) |

**Query Params (List endpoint):**
- `search` (string) - search by teams/venue/tournament
- `status` (live|completed|upcoming|delayed|all) - filter by status
- `tournament` (id) - filter by tournament
- `sort` (date_desc|date_asc|status) - sort order
- `page`, `limit` - pagination

**Response Example (Detail):**
```json
{
  "id": "m1",
  "tournament": { "id": "t1", "name": "Premier Cup 2026" },
  "homeTeam": {
    "id": "tm1",
    "name": "FC Thunder",
    "logo": "...",
    "score": 2
  },
  "awayTeam": {
    "id": "tm2",
    "name": "Red Lions",
    "logo": "...",
    "score": 1
  },
  "status": "completed",
  "date": "2026-03-05T14:00:00Z",
  "venue": { "id": "v1", "name": "Central Stadium", "city": "New York" },
  "referee": { "id": "r1", "name": "John Smith" },
  "lineAssistants": [{ "id": "r2", "name": "Jane Doe" }],
  "events": [
    {
      "id": "e1",
      "type": "goal",
      "minute": 15,
      "team": { "id": "tm1", "name": "FC Thunder" },
      "player": { "id": "p1", "name": "Ahmed Hassan" },
      "description": "Penalty goal"
    }
  ],
  "weather": { "condition": "Sunny", "temperature": 25 }
}
```

---

### 2.3 Teams API

**Base Path:** `/api/v1/teams`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List teams with filters | TeamsPage |
| GET | `/:id` | Get team detail | Teams detail page |
| POST | `/` | Create new team | TeamsPage (Create) |
| PUT | `/:id` | Update team details | Teams detail page |
| DELETE | `/:id` | Delete team | TeamsPage |
| GET | `/:id/roster` | Get team roster | TeamsPage (detail), MatchCenterPage |
| POST | `/:id/roster` | Add player to roster | Team detail |
| DELETE | `/:id/roster/:playerId` | Remove player from roster | Team detail |
| GET | `/:id/matches` | Get team's match history | TeamsPage (detail) |
| GET | `/:id/statistics` | Get team statistics | StatisticsPage |
| PUT | `/:id/coach` | Update team coach | Teams detail |

**Query Params (List endpoint):**
- `search` (string) - search by name/city
- `status` (active|inactive) - filter by status
- `sort` (name|date|teams) - sort order
- `page`, `limit` - pagination

**Response Example (Detail):**
```json
{
  "id": "tm1",
  "name": "FC Thunder",
  "city": "New York",
  "logo": "...",
  "coach": { "id": "u1", "name": "Marco Rossi" },
  "description": "Technical and aggressive play",
  "foundingDate": "2010-05-15",
  "status": "active",
  "stats": {
    "matchesPlayed": 45,
    "wins": 30,
    "losses": 10,
    "draws": 5,
    "goalsFor": 120,
    "goalsAgainst": 45,
    "winRate": 0.667
  },
  "roster": [
    {
      "id": "p1",
      "firstName": "Ahmed",
      "lastName": "Hassan",
      "position": "Forward",
      "jerseyNumber": 9,
      "age": 28,
      "photo": "..."
    }
  ]
}
```

---

### 2.4 Players API

**Base Path:** `/api/v1/players`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List players with filters | PlayersPage |
| GET | `/:id` | Get player profile | Player profile page |
| POST | `/` | Register new player | PlayersPage (Create) |
| PUT | `/:id` | Update player details | Player profile (edit) |
| DELETE | `/:id` | Delete player | PlayersPage |
| GET | `/:id/statistics` | Get player statistics | Player profile (Statistics tab) |
| GET | `/:id/matches` | Get player match history | Player profile (Matches tab) |
| GET | `/:id/training` | Get training records | Player profile (Training tab) |
| POST | `/:id/documents` | Upload document | Player profile (Documents tab) |
| DELETE | `/:id/documents/:docId` | Delete document | Player profile |
| BULK | `DELETE /bulk` | Delete multiple players | PlayersPage (bulk action) |

**Query Params (List endpoint):**
- `search` (string) - search by name
- `clubId` (string[]) - filter by team/club
- `ageCategory` (U8|U10|U12|U14|U16|U18|Senior) - age filter
- `position` (Goalkeeper|Defender|Midfielder|Forward|Multi-position) - position filter
- `sortBy` (name|age|rating) - sort field
- `sortOrder` (asc|desc) - sort order
- `page`, `limit` - pagination

**Response Example (Detail):**
```json
{
  "id": "p1",
  "name": "Ahmed Hassan",
  "photoUrl": "...",
  "dateOfBirth": "1997-06-15",
  "ageCategory": "Senior",
  "nationality": "Germany",
  "position": {
    "primary": "Forward",
    "secondary": "Midfielder"
  },
  "club": { "id": "tm1", "name": "FC Thunder" },
  "contact": {
    "email": "ahmed@example.com",
    "phone": "+1-555-0001",
    "address": "123 Main St, New York, NY"
  },
  "emergency": {
    "name": "Sarah Hassan",
    "relationship": "Sister",
    "phone": "+1-555-0002"
  },
  "stats": {
    "matchesPlayed": 45,
    "goals": 28,
    "assists": 12,
    "yellowCards": 3,
    "redCards": 0,
    "rating": 7.8
  },
  "documents": [
    { "id": "d1", "name": "Medical Certificate", "type": "medical", "uploadedAt": "2026-01-15" }
  ]
}
```

---

### 2.5 Venues API

**Base Path:** `/api/v1/venues`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List venues with filters | VenuesPage |
| GET | `/:id` | Get venue detail | Venue detail page |
| POST | `/` | Create new venue | VenuesPage (Create) |
| PUT | `/:id` | Update venue details | Venue detail (edit) |
| DELETE | `/:id` | Delete venue | VenuesPage |
| GET | `/` | List available cities | VenuesPage (filter) |
| GET | `/types` | List venue types | VenuesPage (filter) |
| GET | `/amenities` | List available amenities | VenuesPage (filter) |
| GET | `/:id/bookings` | Get venue bookings | Venue detail |
| POST | `/:id/bookings` | Create venue booking | Venue detail/booking page |
| GET | `/:id/availability` | Get available time slots | Venue detail/booking |

**Query Params (List endpoint):**
- `search` (string) - search by name
- `city` (string) - filter by city / "all"
- `type` (string) - filter by venue type / "all"
- `amenities` (string[]) - filter by amenities
- `capacityMin`, `capacityMax` - filter by capacity range
- `sort` (alphabetical|capacity|distance) - sort order
- `userPos` (lat,lng) - user geolocation for distance sorting
- `page`, `limit` - pagination

**Response Example (Detail):**
```json
{
  "id": "v1",
  "name": "Central Stadium",
  "city": "New York",
  "address": "123 Stadium Ave, New York, NY 10001",
  "type": "Stadium",
  "capacity": 45000,
  "surface": "Natural Grass",
  "amenities": ["Floodlights", "Parking", "VIP Box", "Medical Facility"],
  "pricing": {
    "hourly": 500,
    "daily": 5000,
    "currency": "USD"
  },
  "location": {
    "latitude": 40.7580,
    "longitude": -73.9855
  },
  "bookings": [
    {
      "id": "bk1",
      "team": { "id": "tm1", "name": "FC Thunder" },
      "date": "2026-03-15",
      "startTime": "14:00",
      "endTime": "16:00",
      "status": "confirmed"
    }
  ],
  "photos": ["..."],
  "contact": { "phone": "+1-555-9999", "email": "info@stadium.com" }
}
```

---

### 2.6 Referees API

**Base Path:** `/api/v1/referees`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List referees | RefereesPage |
| GET | `/:id` | Get referee detail | Referee detail page |
| POST | `/` | Register new referee | RefereesPage (Create) |
| PUT | `/:id` | Update referee details | Referee detail (edit) |
| DELETE | `/:id` | Delete referee | RefereesPage |
| GET | `/:id/assignments` | Get referee match assignments | Referee detail |
| POST | `/:id/assignments` | Assign referee to match | Match detail/assignment page |
| DELETE | `/:id/assignments/:matchId` | Unassign from match | Match detail |

**Response Example (List):**
```json
{
  "items": [
    {
      "id": "r1",
      "name": "John Smith",
      "email": "john@referees.com",
      "phone": "+1-555-0010",
      "role": "Referee",
      "certifications": ["FIFA", "National"],
      "status": "active",
      "assignedMatches": 3,
      "organization": { "id": "o1", "name": "City Football Federation" }
    }
  ],
  "total": 15,
  "totalPages": 2
}
```

---

### 2.7 Organizations API

**Base Path:** `/api/v1/organizations`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List organizations | OrganizationsPage |
| GET | `/:id` | Get org detail | Org detail page |
| POST | `/` | Create organization | OrganizationsPage (Create) |
| PUT | `/:id` | Update org details | Org detail (edit) |
| DELETE | `/:id` | Delete organization | OrganizationsPage |
| GET | `/:id/members` | Get org members | Org detail |
| POST | `/:id/members` | Add member to org | Org detail |
| DELETE | `/:id/members/:userId` | Remove member from org | Org detail |
| GET | `/:id/tournaments` | Get org tournaments | Org detail |
| GET | `/:id/teams` | Get org teams | Org detail |
| GET | `/:id/metrics` | Get org metrics (tournaments, players, revenue) | OrganizationsPage |

**Response Example (Detail):**
```json
{
  "id": "o1",
  "name": "City Football Federation",
  "owner": { "id": "u1", "name": "Admin User" },
  "location": {
    "city": "New York",
    "country": "USA"
  },
  "status": "active",
  "plan": "pro",
  "metrics": {
    "activeTournaments": 5,
    "totalPlayers": 450,
    "totalTeams": 15,
    "monthlyRevenueUsd": 12500
  },
  "members": [
    {
      "id": "m1",
      "user": { "id": "u1", "name": "Admin", "email": "admin@org.com" },
      "role": "admin",
      "joinedAt": "2025-01-01"
    }
  ]
}
```

---

### 2.8 Standings API

**Base Path:** `/api/v1/standings`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/tournament/:tournamentId` | Get league standings for tournament | StandingsPage, TournamentDetailPage |
| GET | `/:standingId` | Get single standing record | (detail view) |

**Response Example:**
```json
{
  "items": [
    {
      "id": "s1",
      "position": 1,
      "team": { "id": "tm1", "name": "FC Thunder", "logo": "..." },
      "played": 10,
      "wins": 8,
      "draws": 1,
      "losses": 1,
      "goalsFor": 24,
      "goalsAgainst": 8,
      "goalDifference": 16,
      "points": 25,
      "form": ["W", "W", "D", "W", "W"]
    }
  ],
  "tournament": { "id": "t1", "name": "Premier Cup 2026" }
}
```

---

### 2.9 Statistics API

**Base Path:** `/api/v1/statistics`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/players` | Get player statistics & leaderboards | StatisticsPage |
| GET | `/players/scorers` | Top scorers list | StatisticsPage (scorers tab) |
| GET | `/players/assists` | Top assists list | StatisticsPage (assists tab) |
| GET | `/players/discipline` | Discipline leaderboard | StatisticsPage (discipline tab) |
| GET | `/player/:playerId` | Get single player stats | Player profile (Statistics tab) |
| GET | `/teams` | Get team statistics | (team standings) |
| GET | `/matches/:matchId` | Get match statistics | MatchCenterPage |

**Query Params:**
- `season` (string) - filter by season
- `competition` (string) - filter by tournament/competition
- `team` (string) - filter by team
- `page`, `limit` - pagination

**Response Example (Scorers):**
```json
{
  "items": [
    {
      "name": "Ahmed Hassan",
      "team": { "id": "tm1", "name": "FC Thunder" },
      "goals": 28,
      "avgGoalsPerGame": 1.4,
      "matches": 20
    }
  ]
}
```

---

### 2.10 Notifications API

**Base Path:** `/api/v1/notifications`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | Get user notifications | NotificationsPage |
| GET | `/:id` | Get single notification | Notification detail |
| POST | `/:id/read` | Mark notification as read | NotificationsPage |
| POST | `/read-all` | Mark all as read | NotificationsPage |
| DELETE | `/:id` | Delete notification | NotificationsPage |
| POST | `/` | Create notification (internal) | (admin/system) |

**Query Params:**
- `read` (true|false|all) - filter by read status
- `type` (match|tournament|team|player) - filter by type
- `page`, `limit` - pagination

---

### 2.11 Reports API

**Base Path:** `/api/v1/reports`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List reports | ReportsPage |
| POST | `/` | Generate report | ReportsPage (Generate) |
| GET | `/:id` | Get report details | Report detail page |
| DELETE | `/:id` | Delete report | ReportsPage |
| GET | `/:id/export` | Export report (CSV/PDF) | Report detail |

**Report Types:**
- `tournament_summary` - Tournament statistics and results
- `player_performance` - Player statistics and rankings
- `match_analysis` - Match detailed analysis
- `team_standings` - Final standings
- `season_review` - Full season review

---

### 2.12 Authentication & User API

**Base Path:** `/api/v1/auth`, `/api/v1/users`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| POST | `/auth/login` | User login | Auth flow |
| POST | `/auth/register` | User registration | Auth flow |
| POST | `/auth/logout` | User logout | All pages (user menu) |
| GET | `/users/profile` | Get current user profile | User menu, Settings |
| PUT | `/users/profile` | Update user profile | SettingsPage |
| GET | `/users/:id` | Get user details | User detail page |
| GET | `/users/roles` | Get user roles in organizations | (permission check) |

---

### 2.13 Booking API

**Base Path:** `/api/v1/bookings`

| Method | Endpoint | Purpose | UI Page |
|--------|----------|---------|---------|
| GET | `/` | List bookings | VenuesPage (bookings) |
| POST | `/` | Create booking | Venue booking page |
| PUT | `/:id` | Update booking | Booking detail |
| DELETE | `/:id` | Cancel booking | Booking detail |

---

## 3. Database Schema Design

### 3.1 Core Tables

```sql
-- ============ AUTHENTICATION ============
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ ORGANIZATIONS ============
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  location_city TEXT,
  location_country TEXT,
  status VARCHAR(20) DEFAULT 'active',
  plan VARCHAR(20) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  role VARCHAR(20) NOT NULL, -- admin, manager, member
  status VARCHAR(20) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============ TOURNAMENTS ============
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  format VARCHAR(50) NOT NULL, -- League, Knockout, Group Stage + Knockout, Round Robin
  age_category VARCHAR(20) NOT NULL, -- Senior, U-21, U-19, U-17, U-15
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  max_teams INT NOT NULL,
  registration_deadline DATE,
  logo_url TEXT,
  status VARCHAR(20) DEFAULT 'draft', -- draft, upcoming, active, completed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ TEAMS ============
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  city TEXT,
  logo_url TEXT,
  description TEXT,
  founding_date DATE,
  coach_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, pending
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL UNIQUE REFERENCES teams(id),
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ PLAYERS ============
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  team_id UUID REFERENCES teams(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  photo_url TEXT,
  nationality TEXT,
  position_primary VARCHAR(30) NOT NULL,
  position_secondary VARCHAR(30),
  age_category VARCHAR(20) NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE player_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  tournament_id UUID REFERENCES tournaments(id),
  matches_played INT DEFAULT 0,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  minutes_played INT DEFAULT 0,
  rating DECIMAL(3,1),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, tournament_id)
);

CREATE TABLE player_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  name TEXT NOT NULL,
  type VARCHAR(50), -- medical, passport, contract, etc
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  date DATE NOT NULL,
  attendance BOOLEAN NOT NULL,
  performance VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============ TOURNAMENT TEAMS ============
CREATE TABLE tournament_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  registration_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'registered',
  UNIQUE(tournament_id, team_id)
);

-- ============ VENUES ============
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  type VARCHAR(50), -- Stadium, Training Ground, Community Sports Center
  capacity INT,
  surface TEXT, -- Natural Grass, Artificial Turf
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE venue_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  amenity TEXT NOT NULL,
  UNIQUE(venue_id, amenity)
);

CREATE TABLE venue_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL UNIQUE REFERENCES venues(id),
  hourly_rate DECIMAL(10, 2),
  daily_rate DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD'
);

CREATE TABLE venue_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id),
  team_id UUID REFERENCES teams(id),
  booking_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ REFEREES ============
CREATE TABLE referees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role VARCHAR(30) NOT NULL, -- Referee, Linesman, VAR
  certifications TEXT[],
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ MATCHES ============
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  venue_id UUID REFERENCES venues(id),
  match_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, live, completed, delayed, postponed
  home_team_score INT,
  away_team_score INT,
  referee_id UUID REFERENCES referees(id),
  weather_condition TEXT,
  weather_temperature INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  event_type VARCHAR(30) NOT NULL, -- goal, yellow_card, red_card, substitution
  team_id UUID NOT NULL REFERENCES teams(id),
  player_id UUID REFERENCES players(id),
  minute INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE match_referees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id),
  referee_id UUID NOT NULL REFERENCES referees(id),
  role VARCHAR(30), -- Main Referee, Linesman 1, Linesman 2, VAR
  UNIQUE(match_id, referee_id)
);

-- ============ STANDINGS ============
CREATE TABLE standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  position INT,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  draws INT DEFAULT 0,
  losses INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- ============ NOTIFICATIONS ============
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT,
  type VARCHAR(30), -- match, tournament, team, player
  reference_type VARCHAR(30),
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============ REPORTS ============
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  tournament_id UUID REFERENCES tournaments(id),
  type VARCHAR(50), -- tournament_summary, player_performance, match_analysis, standings, season_review
  title TEXT NOT NULL,
  description TEXT,
  generated_by UUID NOT NULL REFERENCES profiles(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============ MEDIA FILES ============
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  reference_type VARCHAR(30), -- match, player, team, organization
  reference_id UUID,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Storage Buckets

```yaml
Public Buckets:
  player-photos:
    - Player avatar images
    - Policy: Public read for all authenticated users
  team-logos:
    - Team logos and images
    - Policy: Public read for all authenticated users
  match-media:
    - Match photos and videos
    - Policy: Public read for all authenticated users
  org-assets:
    - Organization logos and assets
    - Policy: Public read for all authenticated users

Private Buckets:
  documents:
    - Player documents, contracts, etc.
    - Policy: Only owner and org admins can read/write
```

### 3.3 Key Indices

```sql
-- Performance Indices
CREATE INDEX idx_tournaments_org_id ON tournaments(organization_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_teams_org_id ON teams(organization_id);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_org_id ON players(organization_id);
CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_standings_tournament_id ON standings(tournament_id);
CREATE INDEX idx_player_stats_player_id ON player_statistics(player_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_venue_bookings_venue_id ON venue_bookings(venue_id);
```

---

## 4. Summary of Required Endpoints

| Feature | API Count | Key Endpoints |
|---------|-----------|---------------|
| Tournaments | 12 | List, Create, Update, Delete, Matches, Standings, Teams |
| Matches | 11 | List, Detail, Events, Lineups, Status changes |
| Teams | 10 | List, Create, Update, Delete, Roster, Statistics |
| Players | 11 | List, Profile, Statistics, Matches, Training, Documents |
| Venues | 10 | List, Detail, Bookings, Availability, Amenities |
| Referees | 7 | List, Create, Update, Delete, Assignments |
| Organizations | 10 | List, Create, Update, Members, Metrics |
| Standings | 2 | By Tournament, Single Record |
| Statistics | 7 | Players, Teams, Matches (various leaderboards) |
| Notifications | 5 | List, Create, Read, Delete |
| Reports | 5 | List, Generate, Retrieve, Delete, Export |
| Auth & Users | 6 | Login, Register, Profile, Roles |
| Bookings | 4 | List, Create, Update, Delete |
| **TOTAL** | **110** | Backend endpoints needed |

---

## 5. Implementation Priority

### Phase 1: Core (Required for Dashboard & Main Lists)
1. ✅ Database schema creation
2. ✅ Authentication & User profiles
3. ✅ Organizations & Members
4. ✅ Tournaments CRUD
5. ✅ Teams CRUD
6. ✅ Players CRUD
7. ✅ Matches CRUD

### Phase 2: Features (Required for Detail Pages)
8. Standings calculation
9. Player Statistics
10. Match Events & Lineups
11. Venue Bookings
12. Referees Management

### Phase 3: Advanced (Required for Features)
13. Notifications system
14. Reports generation
15. Real-time socket updates
16. Media upload handlers

---

## 6. Data Validation Rules

### Tournaments
- Start date must be before end date
- Max teams must be >= 4
- Age category cannot be changed after matches start
- Status: draft → upcoming → active → completed (one-way flow)

### Teams
- Each team must have unique name per organization
- Coach must be registered as user
- Team can only register for tournaments before registration deadline

### Matches
- Home team ≠ Away team
- Match date must be within tournament dates
- Status transitions: upcoming → live → completed (or postponed/delayed)
- Score can only be set when status is completed

### Players
- Date of birth must result in age matching age_category
- Position must be from predefined enum
- Jersey number should be 1-99 (if used)

### Venues
- Capacity must be > 0
- Latitude/Longitude must be valid coordinates
- Bookings cannot overlap for same venue

---

## 7. API Pagination Standards

**Query Parameters:**
- `page` (number, default: 1) - page number
- `limit` (number, default: 20, max: 100) - items per page

**Response Format:**
```json
{
  "items": [...],
  "total": 100,
  "totalPages": 5,
  "page": 1,
  "limit": 20
}
```

---

## 8. Error Response Standards

**Format:**
```json
{
  "error": {
    "code": "TOURNAMENT_NOT_FOUND",
    "message": "Tournament with ID xyz not found",
    "details": {}
  }
}
```

**Common Error Codes:**
- `RESOURCE_NOT_FOUND` (404)
- `VALIDATION_ERROR` (422)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `CONFLICT` (409) - Duplicate entry, invalid state transition
- `INTERNAL_ERROR` (500)

---

## 9. Next Steps

1. **Backend Framework Selection** - Node.js/Express, Go, Python/FastAPI, etc.
2. **Database Migration** - Connect Supabase schema to backend
3. **Service Implementation** - Start with Phase 1 endpoints
4. **Authentication Integration** - Supabase Auth + JWT tokens
5. **Testing** - Unit tests for each endpoint
6. **Documentation** - OpenAPI/Swagger specs
7. **Deployment** - CI/CD pipeline setup

