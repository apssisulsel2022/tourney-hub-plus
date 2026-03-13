# Data Entity Relationship Diagram & Quick Reference

**Purpose:** Visual reference for all data entities and their relationships  
**Generated:** March 13, 2026

---

## 🔗 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION LAYER                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                    ┌──────────────────┐                                 │
│                    │      User        │                                 │
│                    │    (Profile)     │                                 │
│                    │                  │                                 │
│                    │ - id (UUID)      │                                 │
│                    │ - email          │                                 │
│                    │ - name           │                                 │
│                    │ - role           │                                 │
│                    └────────┬─────────┘                                 │
│                             │                                           │
│         ┌───────────────────┼───────────────────┐                      │
│         │                   │                   │                      │
│         ▼                   ▼                   ▼                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      ORGANIZATION CONTEXT LAYER                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                   ┌──────────────────┐                                  │
│                   │  Organization    │                                  │
│                   │                  │                                  │
│                   │ - id             │                                  │
│                   │ - name           │                                  │
│                   │ - owner_id (FK)  │────────────────────┐            │
│                   │ - plan           │                    │            │
│                   │ - status         │                    │            │
│                   └────────┬─────────┘                    │            │
│                            │                              ▼            │
│              ┌─────────────┼──────────────┐        User (Profile)      │
│              │             │              │         (owner)            │
│              ▼             ▼              ▼                            │
│        ┌─────────────┐ ┌──────────┐ ┌────────────┐                    │
│        │   Teams     │ │Venues    │ │ Referees   │                    │
│        │             │ │          │ │            │                    │
│        │ - id        │ │ - id     │ │ - id       │                    │
│        │ - name      │ │ - name   │ │ - name     │                    │
│        │ - city      │ │ - city   │ │ - email    │                    │
│        │ - coach_id  │ │ - type   │ │ - role     │                    │
│        │ - org_id    │ │ - org_id │ │ - org_id   │                    │
│        └─────┬───────┘ └────┬─────┘ └────────────┘                    │
│              │              │                                          │
│              └──────────────┼──────────────┐                          │
│                             │              │                          │
│                  ┌──────────┴──────────┐   │                          │
│      ┌───────────┼─────────────┐       │   │                          │
│      │           │             │       │   │                          │
│      ▼           ▼             ▼       ▼   ▼                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    TOURNAMENT MANAGEMENT LAYER                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│             ┌──────────────────────┐                                    │
│             │   Tournament         │                                    │
│             │                      │                                    │
│             │ - id                 │                                    │
│             │ - name               │                                    │
│             │ - format             │─── League, Knockout, Mixed        │
│             │ - age_category       │─── Senior, U-21, U-19, U-17      │
│             │ - status             │─── draft, upcoming, active, done  │
│             │ - start_date         │                                    │
│             │ - end_date           │                                    │
│             │ - location           │                                    │
│             │ - max_teams          │                                    │
│             │ - org_id             │                                    │
│             └──────────┬───────────┘                                    │
│                        │                                                │
│          ┌─────────────┼──────────────┐                               │
│          │             │              │                               │
│          ▼             ▼              ▼                               │
│    ┌──────────┐  ┌──────────┐  ┌──────────────┐                     │
│    │  Matches │  │Standings │  │tournament    │                     │
│    │          │  │          │  │_teams(JT)    │                     │
│    │ - id     │  │ - id     │  │              │                     │
│    │ - h_team │  │ - team   │  │ - tourn_id   │                     │
│    │ - a_team │  │ - position   │ - team_id   │                     │
│    │ - score  │  │ - points │  └──────────────┘                     │
│    │ - status │  │ - played │         ▲                             │
│    │ - venue  │  │ - W-D-L  │         │                             │
│    │ - tourn  │  │ - GF-GA  │         │ links to                   │
│    │ - date   │  │ - tourn  │         │                             │
│    └─────┬────┘  └──────────┘    ┌────┴──────┐                    │
│          │                        │           │                    │
│          ▼                   ┌────▼───┐  ┌────▼────┐              │
│    ┌──────────────┐         │  Team  │  │ Stadium │              │
│    │ match_events │         │        │  │ /Venue  │              │
│    │              │         │ - id   │  │         │              │
│    │ - id         │         │ - name │  │ - id    │              │
│    │ - match_id   │         │ - city │  │ - name  │              │
│    │ - type       │         │ - logo │  │ - city  │              │
│    │ - player_id  │         │ - org  │  │ - cap   │              │
│    │ - minute     │         └────┬───┘  └────┬────┘              │
│    │ - team_id    │              │           │                   │
│    └──────────────┘              ▼           ▼                   │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      TEAM & PLAYER LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│              ┌────────────────────┐                                     │
│              │      Team          │                                     │
│              │                    │                                     │
│              │ - id               │                                     │
│              │ - name             │                                     │
│              │ - city             │                                     │
│              │ - coach_id (FK)    │                                     │
│              │ - logo             │                                     │
│              │ - founding_date    │                                     │
│              │ - status           │                                     │
│              │ - org_id           │                                     │
│              └────────┬───────────┘                                     │
│                       │                                                 │
│                  ┌────┴──────────────┐                                 │
│                  │                   │                                 │
│                  ▼                   ▼                                 │
│         ┌──────────────┐      ┌───────────────┐                      │
│         │   Player     │      │team_statistics│                      │
│         │              │      │               │                      │
│         │ - id         │      │ - team_id     │                      │
│         │ - name       │      │ - matches     │                      │
│         │ - position   │      │ - wins        │                      │
│         │ - age_cat    │      │ - draws       │                      │
│         │ - dob        │      │ - losses      │                      │
│         │ - photo      │      │ - goals_for   │                      │
│         │ - team_id    │      │ - goals_against                       │
│         │ - org_id     │      └───────────────┘                      │
│         │ - email      │                                              │
│         │ - phone      │                                              │
│         └─────┬────────┘                                              │
│               │                                                       │
│         ┌─────┼──────────────────────────┐                           │
│         │     │                          │                           │
│         ▼     ▼                          ▼                           │
│    ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐    │
│    │player_statistics│  │training_records  │  │player_documents    │
│    │                 │  │                  │  │              │    │
│    │ - id            │  │ - id             │  │ - id         │    │
│    │ - player_id     │  │ - player_id      │  │ - player_id  │    │
│    │ - tournament    │  │ - date           │  │ - name       │    │
│    │ - goals         │  │ - attendance     │  │ - type       │    │
│    │ - assists       │  │ - performance    │  │ - url        │    │
│    │ - cards         │  │ - notes          │  └──────────────┘    │
│    │ - minutes       │  └──────────────────┘                      │
│    │ - rating        │                                            │
│    └─────────────────┘                                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    VENUE & BOOKING LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│            ┌──────────────────┐                                        │
│            │   Venue          │                                        │
│            │                  │                                        │
│            │ - id             │                                        │
│            │ - name           │                                        │
│            │ - city           │                                        │
│            │ - type           │                                        │
│            │ - capacity       │                                        │
│            │ - lat/lng        │                                        │
│            │ - org_id         │                                        │
│            └────────┬─────────┘                                        │
│                     │                                                   │
│        ┌────────────┼────────────┐                                    │
│        │            │            │                                    │
│        ▼            ▼            ▼                                    │
│    ┌─────────┐  ┌───────────┐  ┌────────────────┐                  │
│    │Bookings │  │Amenities  │  │venue_pricing   │                  │
│    │         │  │           │  │                │                  │
│    │ - id    │  │ - id      │  │ - venue_id     │                  │
│    │ - venue │  │ - venue   │  │ - hourly_rate  │                  │
│    │ - team  │  │ - amenity │  │ - daily_rate   │                  │
│    │ - date  │  └───────────┘  │ - currency     │                  │
│    │ - time  │                  └────────────────┘                  │
│    │ - status│                                                       │
│    └─────────┘                                                       │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                   UTILITIES & METADATA LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────┐   │
│    │   Notification   │    │   Report         │    │ Media Files  │   │
│    │                  │    │                  │    │              │   │
│    │ - id             │    │ - id             │    │ - id         │   │
│    │ - user_id        │    │ - org_id         │    │ - uploaded_by│   │
│    │ - title          │    │ - tournament     │    │ - type       │   │
│    │ - message        │    │ - type           │    │ - ref_type   │   │
│    │ - type           │    │ - generated_by   │    │ - ref_id     │   │
│    │ - read           │    │ - data (JSONB)   │    │ - url        │   │
│    │ - created_at     │    │ - created_at     │    │ - created_at │   │
│    └──────────────────┘    └──────────────────┘    └──────────────┘   │
│                                                                           │
│    ┌──────────────────┐    ┌──────────────────┐                        │
│    │match_referees    │    │org_members       │                        │
│    │(junction table)  │    │(junction table)  │                        │
│    │                  │    │                  │                        │
│    │ - match_id       │    │ - org_id         │                        │
│    │ - referee_id     │    │ - user_id        │                        │
│    │ - role           │    │ - role           │                        │
│    └──────────────────┘    └──────────────────┘                        │
│                                                                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Model Quick Reference

### Core Enums

```typescript
// Tournament Format
type TournamentFormat = 'League' | 'Knockout' | 'Group Stage + Knockout' | 'Round Robin'

// Age Category
type AgeCategory = 'Senior' | 'U-21' | 'U-19' | 'U-17' | 'U-15' | 'U-13' | 'U-12' | 'U-11'| 'U-10'| 'U-9'| 'U-8'

// Match Status
type MatchStatus = 'upcoming' | 'live' | 'completed' | 'delayed' | 'postponed'

// Tournament Status
type TournamentStatus = 'draft' | 'upcoming' | 'active' | 'completed'

// Team Status
type TeamStatus = 'active' | 'inactive' | 'pending'

// Player Status
type PlayerStatus = 'active' | 'inactive' | 'retired'

// Player Position
type PlayerPosition = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | 'Multi-position'

// Match Event Type
type MatchEventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury'

// Vessel Type
type VenueType = 'Stadium' | 'Training Ground' | 'Community Sports Center' | 'Multi-purpose'

// Booking Status
type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

// Organization Plan
type OrgPlan = 'starter' | 'pro' | 'enterprise'

// Organization Status
type OrgStatus = 'active' | 'inactive' | 'suspended'

// Organization Member Role
type OrgMemberRole = 'admin' | 'manager' | 'member'

// Referee Role in Match
type RefereeMatchRole = 'Main Referee' | 'Linesman 1' | 'Linesman 2' | 'VAR'
```

---

## 🔄 Data Flow Sequences

### Tournament Creation & Team Registration Flow
```
1. User creates tournament
   POST /api/v1/tournaments
   ↓ Creates: tournaments record

2. Teams register for tournament
   POST /api/v1/tournaments/:id/teams
   ↓ Creates: tournament_teams record (junction)

3. System initializes standings
   Automatic: Creates standings records (1 per team)
   
4. User views tournament
   GET /api/v1/tournaments/:id
   ↓ Returns: Tournament + teams + current standings

5. Match played, score updated
   PUT /api/v1/matches/:id
   ↓ Triggers: standings recalculation
   ↓ Updates: standings table
```

### Player Stats Flow
```
1. Player plays in match
   - Match recorded in matches table
   - Player appears in match lineups
   
2. Player events recorded
   POST /api/v1/matches/:id/events { type: 'goal', player_id: 'p1' }
   ↓ Creates: match_events record
   
3. Match concludes
   POST /api/v1/matches/:id/end
   ↓ Triggers: Player statistics aggregation
   ↓ Updates: player_statistics table
   
4. View player stats
   GET /api/v1/players/:id/statistics
   ↓ Returns: Aggregated stats from player_statistics
   
5. View leaderboards
   GET /api/v1/statistics/players/scorers
   ↓ Returns: Top 10 players ranked by goals
```

---

## 📋 Database Table Hierarchy

```
TIER 1: Core Authentication
├── profiles (users)
└── user_roles

TIER 2: Organization & Context
├── organizations
├── organization_members
└── user_organization_roles

TIER 3: Primary Entities
├── tournaments
├── teams
├── players
├── venues
└── referees

TIER 4: Relationships
├── tournament_teams (junction)
├── match_referees (junction)
├── team_statistics
├── player_statistics
├── venue_amenities
├── venue_pricing
└── venue_bookings

TIER 5: Operations
├── matches
├── match_events
├── training_records
└── player_documents

TIER 6: Derived & Metadata
├── standings (calculated)
├── notifications
├── reports
└── media_files
```

---

## 🔀 Join Patterns

### Get Tournament with Teams
```sql
SELECT t.*, 
       json_agg(json_build_object('id', tm.id, 'name', tm.name)) as teams
FROM tournaments t
LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
LEFT JOIN teams tm ON tt.team_id = tm.id
WHERE t.id = $1
GROUP BY t.id
```

### Get Match with Full Details
```sql
SELECT m.*,
       json_build_object('id', ht.id, 'name', ht.name) as home_team,
       json_build_object('id', at.id, 'name', at.name) as away_team,
       json_build_object('id', v.id, 'name', v.name) as venue,
       json_agg(json_build_object('id', me.id, 'type', me.event_type, 'player', p.name)) as events
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
LEFT JOIN venues v ON m.venue_id = v.id
LEFT JOIN match_events me ON m.id = me.match_id
LEFT JOIN players p ON me.player_id = p.id
WHERE m.id = $1
GROUP BY m.id, ht.id, at.id, v.id
```

### Get Team with Full Stats
```sql
SELECT t.*,
       ts.matches_played,
       ts.wins,
       ts.draws,
       ts.losses,
       json_agg(json_build_object('id', p.id, 'name', p.first_name || ' ' || p.last_name, 'position', p.position_primary)) as roster
FROM teams t
LEFT JOIN team_statistics ts ON t.id = ts.team_id
LEFT JOIN players p ON t.id = p.team_id
WHERE t.id = $1
GROUP BY t.id, ts.id
```

---

## 📊 Entity Cardinality

```
Organization          1 --- to --- ∞ Tournament
                      1 --- to --- ∞ Team
                      1 --- to --- ∞ Venue
                      1 --- to --- ∞ Referee
                      1 --- to --- ∞ Report
                      1 --- to --- ∞ OrganizationMember

Tournament           1 --- to --- ∞ Match
                      1 --- to --- ∞ Standing
                      ∞ --- to --- ∞ Team (via tournament_teams)

Team                 1 --- to --- ∞ Match (as home team)
                      1 --- to --- ∞ Match (as away team)
                      1 --- to --- ∞ Player
                      1 --- to --- ∞ Standing
                      1 --- to --- ∞ Booking

Player              1 --- to --- ∞ MatchEvent
                     1 --- to --- ∞ PlayerStatistic
                     1 --- to --- ∞ TrainingRecord
                     1 --- to --- ∞ PlayerDocument

Match               1 --- to --- ∞ MatchEvent
                     1 --- to --- ∞ MatchReferee (via match_referees)
                     ∞ --- to --- 1 Venue

Venue               1 --- to --- ∞ Booking
                     1 --- to --- ∞ VenueAmenity
                     1 --- to --- 1 VenuePricing
```

---

## 🔑 Key Indexing Strategy

```sql
-- Performance Indices by Access Pattern

-- Tournament Access
CREATE INDEX idx_tournaments_org_status ON tournaments(organization_id, status);
CREATE INDEX idx_tournaments_category ON tournaments(age_category);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);

-- Match Access Patterns
CREATE INDEX idx_matches_tournament_status ON matches(tournament_id, status);
CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_venue ON matches(venue_id);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);

-- Player Access
CREATE INDEX idx_players_team_org ON players(team_id, organization_id);
CREATE INDEX idx_players_position ON players(position_primary);
CREATE INDEX idx_players_age_category ON players(age_category);

-- Team Access
CREATE INDEX idx_teams_organization ON teams(organization_id);
CREATE INDEX idx_teams_status ON teams(status);

-- Venue Access
CREATE INDEX idx_venues_organization ON venues(organization_id);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_type ON venues(type);

-- Booking Access
CREATE INDEX idx_bookings_venue_date ON venue_bookings(venue_id, booking_date);
CREATE INDEX idx_bookings_team ON venue_bookings(team_id);
CREATE INDEX idx_bookings_status ON venue_bookings(status);

-- Standings Access
CREATE INDEX idx_standings_tournament ON standings(tournament_id);
CREATE INDEX idx_standings_team ON standings(team_id);
CREATE INDEX idx_standings_position ON standings(tournament_id, position);

-- Statistics Access
CREATE INDEX idx_player_stats_player ON player_statistics(player_id);
CREATE INDEX idx_player_stats_tournament ON player_statistics(tournament_id);

-- Notification Access
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Organization Access
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
```

---

## 🎯 Typical Query Patterns

### Simple Lookups (Direct by ID)
```
GET /api/v1/tournaments/:id → Index: PRIMARY KEY
GET /api/v1/teams/:id → Index: PRIMARY KEY
GET /api/v1/players/:id → Index: PRIMARY KEY
```

### Filtered Lists (Organization Scoped)
```
GET /api/v1/tournaments?org=O1&status=active 
→ Index: idx_tournaments_org_status

GET /api/v1/teams?org=O1&status=active
→ Index: idx_teams_org_status & idx_teams_organization
```

### Time-Based Queries
```
GET /api/v1/matches?date=2026-03-15
→ Index: idx_matches_date

GET /api/v1/venues/bookings?date_range=...
→ Index: idx_bookings_venue_date
```

### Aggregate Queries
```
GET /api/v1/statistics/players/scorers?tournament=T1
→ Index: idx_player_stats_tournament + ORDER BY goals DESC

GET /api/v1/standings/tournament/:id
→ Index: idx_standings_tournament + ORDER BY position
```

---

## 💾 Storage Considerations

### Budget Estimation (1 Year Data)

```
Organization:                     ~500 org records        ~100 KB
Tournament:                       ~2,000 tournaments      ~500 KB
Teams:                           ~50,000 teams           ~2 MB
Players:                         ~500,000 players        ~50 MB
Matches:                         ~100,000 matches        ~10 MB
Match Events:                    ~500,000 events         ~30 MB
Player Statistics:               ~5,000,000 stats        ~500 MB
Training Records:                ~5,000,000 records      ~200 MB
Notifications:                   ~1,000,000             ~50 MB
---
Total Core Data:                                        ~843 MB

Media Files:
- Player Photos (500K):          2.5 GB (5 KB avg)
- Team Logos:                    100 MB
- Match Photos:                  10 GB (1000 matches × 10 photos)  
---
Total Media:                                            ~12.6 GB

Total Storage (1 year):                               ~13.5 GB
```

---

## 🔐 Referential Integrity

### Foreign Key Constraints
```sql
-- Teams belong to Organization
ALTER TABLE teams ADD CONSTRAINT fk_teams_org 
FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- Players belong to Team
ALTER TABLE players ADD CONSTRAINT fk_players_team 
FOREIGN KEY (team_id) REFERENCES teams(id);

-- Matches belong to Tournament
ALTER TABLE matches ADD CONSTRAINT fk_matches_tournament
FOREIGN KEY (tournament_id) REFERENCES tournaments(id);

-- Match events belong to Match
ALTER TABLE match_events ADD CONSTRAINT fk_match_events_match
FOREIGN KEY (match_id) REFERENCES matches(id);

-- And so on...
```

### Cascade Rules
```
DELETE Organization → Also delete:
  ✓ Organization_Members
  ✓ Tournaments (and all tournament data)
  ✓ Teams (and all team data)
  ✓ Venues
  ✓ Referees
  ✓ Reports

DELETE Tournament → Also delete:
  ✓ Tournament_Teams
  ✓ Matches (and match events)
  ✓ Standings

DELETE Team → Also delete:
  ✓ Players (and all player data)
  ✓ Team_Statistics
  ✓ Matches (both home/away)
  ✗ Team_Logo (keep in storage)
```

---

## 📝 Summary

- **Total Entities:** 13 core, 6 junction/derived = 19 conceptual entities
- **Total Tables:** 30+ database tables
- **Foreign Key Relationships:** 40+
- **Indices:** 20+ performance indices
- **Storage:** ~13.5 GB per year (with media)
- **Query Complexity:** Simple CRUD to complex aggregations
- **Scalability:** Partitioning recommendations for 10M+ records

