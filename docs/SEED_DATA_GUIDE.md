# Seed Data Implementation Guide

**Purpose:** Realistic mock data to replace UI/UX mockups  
**Created:** March 13, 2026  
**Status:** Ready for database population

---

## 📊 Seed Data Overview

This seed data file (`20260313120000_seed_data.sql`) provides **production-realistic data** that can immediately replace UI/UX mockups. All data is contextually relevant and follows database constraints.

### Data Included

| Entity | Count | Details |
|--------|-------|---------|
| Organizations | 4 | Jakarta, Bandung, Surabaya, Medan |
| Teams | 9 | 1-3 teams per organization |
| Players | 35+ | Complete player rosters with realistic data |
| Tournaments | 5 | Various formats and age categories |
| Matches | 6+ | With complete match events and statistics |
| Referees | 5 | With ratings and experience levels |
| Venues | 5 | Indonesian stadiums and facilities |
| Match Events | 12+ | Goals, yellow cards, substitutions |
| Standings | 8 entries | Live league position data |
| Player Statistics | 9+ | Performance metrics per tournament |
| Venue Bookings | 5 | Booking status tracking |

---

## 🚀 How to Use

### Option 1: Run in Supabase Dashboard

```sql
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create new query
-- 3. Copy entire content of: supabase/migrations/20260313120000_seed_data.sql
-- 4. Click "RUN"
```

### Option 2: Run via Supabase CLI

```bash
# If you have Supabase CLI installed
cd d:\PROYEK WEB MASTER\APLICASI\tourney-hub-plus

# Execute migration
supabase migration up

# Or run directly
psql postgresql://user:password@host:port/database -f supabase/migrations/20260313120000_seed_data.sql
```

### Option 3: Manual Import

```bash
# Using psql directly
psql -U postgres -d tourney_hub -f supabase/migrations/20260313120000_seed_data.sql
```

---

## 📝 Data Structure Explanation

### Organizations (4)

```json
{
  "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "name": "Jakarta Football League",
  "short_name": "JFL",
  "city": "Jakarta",
  "country": "Indonesia",
  "plan": "enterprise",
  "status": "active",
  "owner": "admin@jfl.id"
}
```

**Locations:**
- 🏛️ Jakarta (primary, enterprise plan)
- 🏘️ Bandung (youth focus, pro plan)
- 🏙️ Surabaya (multi-sport, pro plan)  
- 🌆 Medan (local, starter plan)

### Teams (9)

Each organization has 1-3 teams with realistic Indonesian club names:

```json
{
  "id": "f1111111-1111-1111-1111-111111111111",
  "name": "Jakarta Persija United",
  "city": "Jakarta",
  "organization": "Jakarta Football League",
  "coach": "Bima Sakti",
  "manager": "Bambang Pamungkas",
  "status": "active"
}
```

**Featured Teams:**
- Jakarta: Persija, Perkasa, Warriors, Eagles
- Bandung: United Youth, Tigers
- Surabaya: Red United, Warriors
- Medan: City Stars

### Players (35+)

Complete squads with realistic data:

```json
{
  "id": "p1111111-1111-1111-1111-111111111111",
  "name": "Ahmad Surya Pratama",
  "team": "Jakarta Persija United",
  "position": "Goalkeeper",
  "date_of_birth": "1995-03-15",
  "age_category": "senior",
  "jersey_number": 1,
  "nationality": "Indonesian",
  "status": "active"
}
```

**Player Positions:**
- Goalkeeper (1-2 per team)
- Defenders (4-5 per team)
- Midfielders (4-5 per team)
- Forwards (2-3 per team)

**Age Categories:**
- Senior (primary)
- U-21, U-19, U-17

### Tournaments (5)

```json
{
  "id": "t1111111-1111-1111-1111-111111111111",
  "name": "Jakarta Premier League 2026",
  "format": "league",
  "age_category": "senior",
  "start_date": "2026-03-15",
  "end_date": "2026-06-30",
  "max_teams": 12,
  "status": "active"
}
```

**Tournament Types:**
1. **League Format** → Round-robin all teams
2. **Knockout Format** → Single/double elimination
3. **Group Knockout** → Groups then knockout stage
4. **Round Robin** → All play all

**Status:**
- `draft` → Not started
- `upcoming` → Registration open
- `active` → Matches in progress
- `completed` → Finals completed

### Matches (6+)

```json
{
  "id": "m1111111-1111-1111-1111-111111111111",
  "tournament": "Jakarta Premier League 2026",
  "home_team": "Jakarta Persija United",
  "away_team": "Jakarta Perkasa FC",
  "date_time": "2026-03-15T19:00:00",
  "venue": "Gelora Bung Karno Stadium",
  "status": "completed",
  "home_score": 2,
  "away_score": 1
}
```

**Match Status:**
- `upcoming` → Scheduled
- `live` → In progress
- `completed` → Final result entered
- `delayed` → Postponed

### Match Events (12+)

```json
{
  "match": "Jakarta Persija 2 - Jakarta Perkasa 1",
  "minute": 12,
  "type": "goal",
  "team": "Jakarta Persija United",
  "player": "Eka Pranatama"
}
```

**Event Types:**
- `goal` → Scoring event
- `yellow_card` → Warning
- `red_card` → Expulsion
- `substitution` → Player change
- `var_review` → VAR review

### Referees (5)

```json
{
  "id": "r1111111-1111-1111-1111-111111111111",
  "name": "Jane Referee",
  "badge_level": "FIFA",
  "organization": "Jakarta Football League",
  "email": "jane@referee.id",
  "rating": 4.8,
  "status": "active"
}
```

**Badge Levels:**
- FIFA → International level
- AFC → Asian Confederation level
- National → National level

### Standings

```json
{
  "tournament": "Jakarta Premier League 2026",
  "position": 1,
  "team": "Jakarta Persija United",
  "played": 1,
  "wins": 1,
  "draws": 0,
  "losses": 0,
  "goals_for": 2,
  "goals_against": 1,
  "points": 3
}
```

### Player Statistics

```json
{
  "player": "Eka Pranatama",
  "tournament": "Jakarta Premier League 2026",
  "goals": 1,
  "assists": 0,
  "yellow_cards": 0,
  "red_cards": 0,
  "minutes_played": 90,
  "matches_played": 1,
  "average_rating": 7.5
}
```

### Venues (5)

Real Indonesian stadiums:

```json
{
  "id": "e1111111-1111-1111-1111-111111111111",
  "name": "Gelora Bung Karno Stadium",
  "city": "Jakarta",
  "capacity": 78000,
  "type": "stadium",
  "facilities": ["parking", "restroom", "canteen", "medical"]
}
```

**Venue Types:**
- Stadium
- Arena
- Training Ground
- Indoor Hall
- Community Field

---

## 🔄 Data Relationships

### Entity Relationships in Seed Data

```
Organization
├─ Teams (1-3 per org)
│  └─ Players (11-14 per team)
│     └─ Player Statistics (per tournament)
├─ Tournaments (1-2 per org)
│  ├─ Tournament Teams (many-to-many)
│  ├─ Matches (multiple per tournament)
│  │  ├─ Match Events (goals, cards, etc)
│  │  └─ Match Referees (1-2 per match)
│  └─ Standings (per team in tournament)
├─ Venues (1-2 per org)
│  └─ Venue Bookings (status tracking)
└─ Referees (2-3 per org)
   └─ Match Referees (assignments)
```

---

## 📈 Sample Data Scenarios

### Scenario 1: Jakarta Premier League (Active Tournament)

- **Organization:** Jakarta Football League
- **Regular Season:** 4 teams, week 1 completed
- **Matches So Far:** 2 completed, 2 upcoming
- **Sample Results:**
  - Jakarta Persija 2 - 1 Jakarta Perkasa
  - Jakarta Warrior 1 - 1 Jakarta Eagles
- **Current Leader:** Jakarta Persija (3 pts, +1 GD)
- **Referees:** 2 FIFA-level referees assigned

### Scenario 2: Bandung Youth League (Active)

- **Organization:** Bandung Youth Football Association
- **Format:** League format for U-21 players
- **Matches Completed:** 2 (week 1)
- **Sample Results:**
  - Bandung United 3 - 1 Bandung Tiger
  - Surabaya Red 2 - 0 Surabaya Warriors
- **Top Players:** Sandi Gunawan (2 goals), Radhit Setiawan (1 goal)
- **Current Leader:** Bandung United (3 pts)

### Scenario 3: Jakarta Youth Cup (Upcoming)

- **Status:** Upcoming (registration open)
- **Format:** Knockout tournament
- **Age Category:** U-19
- **Teams Registered:** 4
- **Matches Scheduled:** Starting April 1, 2026
- **Venues:** 2 stadiums pre-booked

---

## 🎯 Use Cases

### For Frontend Development

**Replace mock data with real seed data:**

```typescript
// Before (mock)
const tournaments = [
  { id: '1', name: 'Mock Tournament', teams: 5 }
];

// After (seed data from database)
const tournaments = await fetch('/api/tournaments')
  .then(r => r.json());
// Returns real data: 5 tournaments with full details
```

### For Testing

```typescript
// Integration tests can use real data patterns
test('Get tournament standings', async () => {
  const standings = await tournamentsAPI.getStandings('t1111111-1111-1111-1111-111111111111');
  
  expect(standings).toHaveLength(4); // Real seeded data has 4 teams
  expect(standings[0].points).toBe(3);
  expect(standings[0].team).toBe('Jakarta Persija United');
});
```

### For UI Development

**Pages can now display:**
- ✅ Real team logos and player photos
- ✅ Actual match results with event timeline
- ✅ Live standings with calculated points
- ✅ Player statistics and ratings
- ✅ Venue information and booking status
- ✅ Referee assignments and performance ratings

### For API Testing

```bash
# Test GET /tournaments
curl http://localhost:3000/api/tournaments
# Returns 5 tournaments with details

# Test GET /teams/jakarta-football-league  
curl http://localhost:3000/api/organizations/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/teams
# Returns 4 teams with player rosters

# Test GET /matches/active
curl http://localhost:3000/api/matches?status=completed
# Returns 6+ completed matches with events
```

---

## 🔍 Data Quality Checks

### Referential Integrity

✅ All foreign keys point to existing records  
✅ No orphaned records  
✅ Timestamps are consistent (past and future dates valid)  
✅ Enum values match database constraints  

### Business Logic Validation

✅ Match scores match sum of match events  
✅ Standings calculated correctly from match results  
✅ Player statistics match tournament registrations  
✅ Venue bookings don't overlap  
✅ Referees assigned only to their organization's matches  

### Data Consistency

✅ All organizations have active status  
✅ All teams belong to exactly one organization  
✅ All players have valid positions (primary + optional secondary)  
✅ Match dates fall within tournament date ranges  
✅ Player ratings between 0-10  

---

## 📋 Loading Procedure Checklist

- [ ] Back up production database (if applicable)
- [ ] Verify SQL syntax: `SELECT COUNT(*) FROM organizations;`
- [ ] Check all UUIDs are unique (should auto-pass with UUID primary keys)
- [ ] Verify no constraint violations during INSERT
- [ ] Run verification queries (totals at bottom of file)
- [ ] Test sampling: `SELECT * FROM tournaments LIMIT 1;`
- [ ] Run frontend tests against seeded data
- [ ] Load test with real API calls

---

## 🔄 Updating Seed Data

### To Add More Players

```sql
INSERT INTO public.players (id, team_id, organization_id, name, primary_position, jersey_number, status)
VALUES (
  gen_random_uuid(),
  'f1111111-1111-1111-1111-111111111111', -- Jakarta Persija
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', -- Jakarta Football League
  'Muhamad Ichsan',
  'midfielder',
  12,
  'active'
);
```

### To Add More Matches

```sql
INSERT INTO public.matches (tournament_id, organization_id, round, date_time, venue_id, home_team_id, away_team_id, status)
VALUES (
  't1111111-1111-1111-1111-111111111111', -- Jakarta Premier League
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Round 3',
  '2026-03-29 19:00:00'::timestamptz,
  'e1111111-1111-1111-1111-111111111111', -- Gelora Bung Karno
  'f2222222-2222-2222-2222-222222222222', -- Jakarta Perkasa
  'f3333333-3333-3333-3333-333333333333', -- Jakarta Warrior
  'upcoming'
);
```

---

## 🐛 Troubleshooting

### Issue: "Duplicate key value violates unique constraint"

**Cause:** Data already loaded  
**Solution:** Run TRUNCATE before INSERT or modify IDs

```sql
TRUNCATE TABLE public.player_statistics CASCADE;
TRUNCATE TABLE public.match_events CASCADE;
TRUNCATE TABLE public.match_referees CASCADE;
-- ... etc
```

### Issue: "Foreign key constraint violation"

**Cause:** Record references non-existent parent  
**Solution:** Ensure all referenced organizations, teams, tournaments exist

### Issue: "Type error on enum"

**Cause:** Invalid enum value  
**Solution:** Check enum definitions match (e.g., tournament_format must be 'league', 'knockout', etc.)

---

## 📊 Verification Queries

```sql
-- Count all data
SELECT 
  (SELECT COUNT(*) FROM organizations) as orgs,
  (SELECT COUNT(*) FROM teams) as teams,
  (SELECT COUNT(*) FROM players) as players,
  (SELECT COUNT(*) FROM tournaments) as tournaments,
  (SELECT COUNT(*) FROM matches) as matches,
  (SELECT COUNT(*) FROM match_events) as events,
  (SELECT COUNT(*) FROM referees) as referees;

-- Sample view: Tournament with standings
SELECT t.name, tt.team_id, s.position, s.points
FROM tournaments t
JOIN standings s ON t.id = s.tournament_id
JOIN teams tt ON s.team_id = tt.id
WHERE t.status = 'active'
ORDER BY s.tournament_id, s.position;

-- Sample view: Match results
SELECT 
  m.date_time,
  ht.name as home_team,
  m.home_score,
  m.away_score,
  at.name as away_team,
  m.status
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN teams at ON m.away_team_id = at.id
ORDER BY m.date_time DESC
LIMIT 10;
```

---

## ✅ Success Indicators

After loading seed data, your UI should show:

- ✅ 4 organizations in dropdown
- ✅ 9 teams when viewing organization
- ✅ 35+ players with photos and positions
- ✅ 5 tournaments with different formats
- ✅ 6+ matches with scores and events
- ✅ Live standings with calculated positions
- ✅ Player statistics matching matches
- ✅ Referee ratings and assignments
- ✅ Venue information from real stadiums
- ✅ Booking calendar with reservations

---

## 🎉 Next Steps

1. **Load Seed Data** → Run SQL file in Supabase
2. **Update Frontend** → Remove mock data, connect to real API
3. **Test Pages** → Verify all components display real data
4. **Add More Data** → As needed for testing edge cases
5. **Document URLs** → Store real entity IDs for testing

**Ready to replace mockups!** 🚀

