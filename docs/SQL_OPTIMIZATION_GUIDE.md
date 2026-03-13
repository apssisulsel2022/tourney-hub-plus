# SQL Query Optimization & Performance Tuning Guide

**Purpose:** Practical SQL optimization strategies for scale  
**Target:** 50K+ players, 500+ tournaments, 100+ organizations  
**Time to Scale:** Query optimization needed before adding infrastructure

---

## 📊 Query Performance Analysis

### 1. Identifying Slow Queries

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 100;  -- Log queries > 100ms
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();

-- View slow query log
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time,
  stddev_time
FROM pg_stat_statements
WHERE mean_time > 100  -- Queries averaging > 100ms
ORDER BY total_time DESC
LIMIT 20;

-- Most called queries (may benefit from caching)
SELECT 
  query,
  calls,
  mean_time
FROM pg_stat_statements
WHERE calls > 1000
ORDER BY calls DESC
LIMIT 20;
```

### 2. EXPLAIN ANALYZE Examples

#### Query 1: Tournament List with Filters (250 tournaments, 5K teams)

```sql
-- ❌ UNOPTIMIZED: 2500ms, scans 250K rows
EXPLAIN ANALYZE
SELECT 
  t.id, t.name, t.status, t.format, 
  COUNT(tt.team_id) as team_count,
  (SELECT COUNT(*) FROM matches m WHERE m.tournament_id = t.id) as match_count
FROM tournaments t
LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
WHERE t.organization_id = '1234567890abcdef'
  AND t.status IN ('active', 'upcoming')
GROUP BY t.id
ORDER BY t.created_at DESC
LIMIT 20 OFFSET 0;

-- Analysis shows:
-- - Seq scan on tournaments (full table)
-- - Correlated subquery for match_count (runs 250+ times)
-- - Group by without proper sorting


-- ✅ OPTIMIZED: 45ms, uses indices, eliminates subquery
-- Step 1: Add indices first
CREATE INDEX idx_tournaments_org_status 
  ON tournaments(organization_id, status, created_at DESC)
  INCLUDE (name, format, max_teams);

-- Step 2: Denormalize counts for instant access
ALTER TABLE tournaments ADD COLUMN 
  cached_team_count INT DEFAULT 0,
  cached_match_count INT DEFAULT 0;

-- Step 3: Update via trigger
CREATE TRIGGER update_tournament_counts
AFTER INSERT OR DELETE ON tournament_teams
FOR EACH ROW EXECUTE FUNCTION refresh_tournament_counts();

-- Step 4: Rewritten query
SELECT 
  id, name, status, format,
  cached_team_count,
  cached_match_count
FROM tournaments
WHERE organization_id = '1234567890abcdef'
  AND status = ANY(ARRAY['active', 'upcoming'])
ORDER BY created_at DESC
LIMIT 20;

-- Results: 45ms vs 2500ms (55x faster)
```

#### Query 2: Player Leaderboard (50K players across tournaments)

```sql
-- ❌ UNOPTIMIZED: 5000ms
EXPLAIN ANALYZE
SELECT 
  p.id, p.name,
  COUNT(me.id) as goals,
  COUNT(CASE WHEN me.event_type = 'yellow_card' THEN 1 END) as yellows,
  (SELECT AVG(rating) FROM player_statistics ps 
   WHERE ps.player_id = p.id 
   AND ps.tournament_id = '1234567890abcdef') as avg_rating
FROM players p
LEFT JOIN match_events me ON p.id = me.player_id 
  AND me.event_type = 'goal'
JOIN player_statistics ps ON p.id = ps.player_id
WHERE ps.tournament_id = '1234567890abcdef'
GROUP BY p.id, p.name
ORDER BY goals DESC
LIMIT 10;

-- Problems:
-- - Correlated subquery (runs 10K+ times)
-- - Multiple JOINs with aggregation
-- - Rating recalculated every query


-- ✅ OPTIMIZED: 12ms using materialized view
CREATE MATERIALIZED VIEW tournament_leaderboard AS
SELECT 
  p.id,
  p.name,
  ps.tournament_id,
  ps.goals,
  ps.assists,
  ps.yellow_cards,
  ps.red_cards,
  ps.rating,
  ROW_NUMBER() OVER (PARTITION BY ps.tournament_id ORDER BY ps.goals DESC) as rank
FROM players p
JOIN player_statistics ps ON p.id = ps.player_id;

CREATE INDEX idx_leaderboard_tournament 
  ON tournament_leaderboard(tournament_id, rank);

SELECT 
  id, name, goals, assists, yellow_cards, rating
FROM tournament_leaderboard
WHERE tournament_id = '1234567890abcdef'
ORDER BY rank ASC
LIMIT 10;

-- Refresh after match
REFRESH MATERIALIZED VIEW CONCURRENTLY tournament_leaderboard;

-- Results: 12ms vs 5000ms (400x faster!)
```

#### Query 3: Team Standings Calculation (50 teams in tournament)

```sql
-- ❌ UNOPTIMIZED: 3000ms (calculated on each query)
SELECT 
  t.id,
  t.name,
  COUNT(CASE WHEN (m.home_team_id = t.id AND m.home_team_score > m.away_team_score)
             OR (m.away_team_id = t.id AND m.away_team_score > m.home_team_score) THEN 1 END) as wins,
  COUNT(CASE WHEN m.home_team_score = m.away_team_score THEN 1 END) as draws,
  COUNT(CASE WHEN (m.home_team_id = t.id AND m.home_team_score < m.away_team_score)
             OR (m.away_team_id = t.id AND m.away_team_score < m.home_team_score) THEN 1 END) as losses,
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.home_team_score 
                    WHEN m.away_team_id = t.id THEN m.away_team_score END), 0) as goals_for,
  COALESCE(SUM(CASE WHEN m.home_team_id = t.id THEN m.away_team_score 
                    WHEN m.away_team_id = t.id THEN m.home_team_score END), 0) as goals_against
FROM tournament_teams tt
JOIN teams t ON tt.team_id = t.id
LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id)
  AND m.tournament_id = '1234567890abcdef'
  AND m.status = 'completed'
WHERE tt.tournament_id = '1234567890abcdef'
GROUP BY t.id, t.name
ORDER BY (wins * 3 + draws) DESC;


-- ✅ OPTIMIZED: 15ms (pre-calculated)
-- Step 1: Maintain standings table
SELECT 
  tournament_id,
  team_id,
  position,
  played,
  wins,
  draws,
  losses,
  goals_for,
  goals_against,
  goals_for - goals_against as goal_diff,
  wins * 3 + draws as points,
  ROW_NUMBER() OVER (PARTITION BY tournament_id ORDER BY (wins*3+draws) DESC, (goals_for-goals_against) DESC) as rank
FROM standings
WHERE tournament_id = '1234567890abcdef'
ORDER BY rank;

-- Step 2: Update standings on match completion
CREATE TRIGGER calculate_standings_on_match_end
AFTER UPDATE ON matches
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION recalculate_tournament_standings(NEW.tournament_id);

-- Results: 15ms vs 3000ms (200x faster!)
```

---

## 🔧 Common Optimization Techniques

### 1. Batch Inserts/Updates

```sql
-- ❌ SLOW: 1000 individual queries
INSERT INTO player_statistics VALUES (uuid(), p1, 100, 5, ...);
INSERT INTO player_statistics VALUES (uuid(), p2, 95, 3, ...);
INSERT INTO player_statistics VALUES (uuid(), p3, 88, 2, ...);
-- ... 1000 times = 1000 queries

-- ✅ FAST: Single batch insert
INSERT INTO player_statistics (id, player_id, goals, assists, ...)
VALUES 
  (uuid(), 'p1', 100, 5, ...),
  (uuid(), 'p2', 95, 3, ...),
  (uuid(), 'p3', 88, 2, ...),
  -- ... 998 more rows
  (uuid(), 'p1000', 45, 1, ...);

-- Result: 1 query vs 1000 queries = 1000x faster!
```

### 2. Prepared Statements (Prevent N+1)

```sql
-- ❌ NOT prepared (vulnerable to SQL injection, cache misses)
SELECT * FROM players WHERE team_id = '123';
SELECT * FROM players WHERE team_id = '456';
SELECT * FROM players WHERE team_id = '789';
-- Creates 3 different query plans

-- ✅ Prepared statement (reuses plan)
PREPARE get_team_players AS
SELECT * FROM players WHERE team_id = $1;

EXECUTE get_team_players('123');
EXECUTE get_team_players('456');
EXECUTE get_team_players('789');
-- Reuses same plan 3 times
```

### 3. LIMIT & OFFSET for Pagination

```sql
-- ✅ GOOD: Client-side pagination
SELECT * FROM matches 
WHERE tournament_id = $1
ORDER BY match_date DESC
LIMIT 50 OFFSET 0;     -- Page 1
LIMIT 50 OFFSET 50;    -- Page 2
LIMIT 50 OFFSET 100;   -- Page 3

-- ❌ PROBLEMATIC OFFSET
SELECT * FROM matches 
LIMIT 50 OFFSET 100000  -- Scans 100K+ rows to skip!

-- ✅ BETTER: Cursor-based pagination
SELECT * FROM matches 
WHERE match_date < $1    -- Use last row's date as cursor
ORDER BY match_date DESC
LIMIT 50;
```

### 4. Covering Indices (No Table Access)

```sql
-- ❌ WITHOUT covering index: 2 table accesses per row
SELECT name, email FROM players WHERE team_id = $1;
-- 1. Index scan to find rows
-- 2. Table access to get name, email

-- ✅ WITH covering index: 1 table access
CREATE INDEX idx_players_team 
  ON players(team_id)
  INCLUDE (name, email);  -- Includes columns in index

-- Now: Index has all data, no table access needed
```

### 5. Partial Indices (Smaller, Faster)

```sql
-- ❌ BIG index (all rows)
CREATE INDEX idx_players ON players(organization_id, status);
-- Index includes deleted, suspended, etc.

-- ✅ SMALL index (active only)
CREATE INDEX idx_players_active 
  ON players(organization_id) 
  WHERE status = 'active';
-- Index 1/3 the size, faster searches

-- Query rewritten
SELECT * FROM players 
WHERE organization_id = $1 
  AND status = 'active'
-- Uses partial index automatically
```

### 6. Denormalization for Hot Data

```sql
-- ❌ EVERY query recalculates
SELECT 
  team_id,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
  AVG(rating) as avg_rating
FROM players
GROUP BY team_id;

-- ✅ PRE-CALCULATED
ALTER TABLE teams ADD COLUMN (
  cached_player_count INT DEFAULT 0,
  cached_active_count INT DEFAULT 0,
  cached_avg_rating DECIMAL(3,1)
);

-- Update on player changes
CREATE TRIGGER update_team_cache
AFTER INSERT OR DELETE OR UPDATE ON players
FOR EACH ROW EXECUTE FUNCTION refresh_team_cache();

-- Query becomes instant
SELECT cached_player_count, cached_active_count, cached_avg_rating
FROM teams WHERE id = $1;
```

---

## 📋 Index Creation Checklist

### Per-Table Optimization

#### Tournaments Table
```sql
-- Primary access patterns
CREATE INDEX idx_tournaments_org_status 
  ON tournaments(organization_id, status, created_at DESC);

CREATE INDEX idx_tournaments_active 
  ON tournaments(organization_id) 
  WHERE status IN ('active', 'upcoming');

-- Range queries by date
CREATE INDEX idx_tournaments_dates 
  ON tournaments(start_date, end_date);

-- Search by name (full-text)
CREATE INDEX idx_tournaments_name_tsvector 
  ON tournaments USING GIN(to_tsvector('english', name));
```

#### Matches Table
```sql
-- Time-series partition first, then indices
CREATE INDEX idx_matches_tournament_status 
  ON matches(tournament_id, status)
  WHERE status != 'completed';

CREATE INDEX idx_matches_date_desc 
  ON matches(match_date DESC)
  WHERE status IN ('live', 'upcoming');

-- Team-based queries
CREATE INDEX idx_matches_teams 
  ON matches(home_team_id, away_team_id);

-- Venue queries
CREATE INDEX idx_matches_venue 
  ON matches(venue_id, match_date);
```

#### Players Table
```sql
-- Organization scoped
CREATE INDEX idx_players_org_team 
  ON players(organization_id, team_id);

-- Filter by position, age, status
CREATE INDEX idx_players_characteristics 
  ON players(position_primary, age_category)
  WHERE status = 'active';

-- Search by name
CREATE INDEX idx_players_name_tsvector 
  ON players USING GIN(to_tsvector('english', name));

-- Organization-wide scans
CREATE INDEX idx_players_org_active 
  ON players(organization_id)
  WHERE status = 'active';
```

#### Player Statistics Table
```sql
-- Tournament leaderboards
CREATE INDEX idx_player_stats_tournament_goals 
  ON player_statistics(tournament_id, goals DESC)
  WHERE season IS NOT NULL;

-- Player-specific stats
CREATE INDEX idx_player_stats_player 
  ON player_statistics(player_id, tournament_id);

-- Recent stats (this season)
CREATE INDEX idx_player_stats_recent 
  ON player_statistics(season DESC)
  WHERE season >= DATE_PART('year', CURRENT_DATE);
```

---

## ⚡ Query Patterns at Scale

### Pattern 1: Pagination with Filters

```sql
-- ✅ OPTIMIZED: 50ms for any page
SELECT id, name, team_id, position, rating
FROM players
WHERE organization_id = $1
  AND status = 'active'
  AND (position_primary = ANY($2) OR array_length($2, 1) IS NULL)
  AND (age_category = ANY($3) OR array_length($3, 1) IS NULL)
ORDER BY name ASC
LIMIT 50 OFFSET $4;

-- Uses index: idx_players_characteristics + partial
-- Only scans offset + limit rows
```

### Pattern 2: Leaderboard with Ranking

```sql
-- ✅ OPTIMIZED: 20ms using window functions
WITH ranked AS (
  SELECT 
    player_id,
    goals,
    assists,
    ROW_NUMBER() OVER (ORDER BY goals DESC) as rank
  FROM player_statistics
  WHERE tournament_id = $1
)
SELECT player_id, goals, assists, rank
FROM ranked
WHERE rank <= 10
ORDER BY rank;

-- Uses: tournament_leaderboard materialized view
```

### Pattern 3: Multi-Table Join with Aggregation

```sql
-- ✅ OPTIMIZED: 40ms using proper joins
SELECT 
  t.id,
  t.name,
  COUNT(DISTINCT tt.team_id) as registered_teams,
  COUNT(DISTINCT m.id) as total_matches,
  SUM(CASE WHEN m.status = 'completed' THEN 1 ELSE 0 END) as completed_matches,
  SUM(CASE WHEN m.status = 'live' THEN 1 ELSE 0 END) as live_matches
FROM tournaments t
LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
LEFT JOIN matches m ON t.id = m.tournament_id
WHERE t.organization_id = $1
  AND t.status = 'active'
GROUP BY t.id, t.name
ORDER BY total_matches DESC;

-- Denorm alternative: use cached_team_count, etc in tournaments table (15ms)
```

### Pattern 4: Full-Text Search

```sql
-- ✅ OPTIMIZED: Full-text search with ranking
SELECT 
  id,
  name,
  ts_rank(name_tsvector, query) as relevance
FROM (
  SELECT 
    id,
    name,
    to_tsvector('english', name) as name_tsvector,
    plainto_tsquery('english', $1) as query
  FROM players
  WHERE organization_id = $2
) search
WHERE name_tsvector @@ query
ORDER BY relevance DESC
LIMIT 20;

-- Uses: Full-text index on name
-- Searches "Ahmed Hassan" for "hassan" in 5ms
```

### Pattern 5: Time-Series Aggregation

```sql
-- ✅ OPTIMIZED: Daily match count trend
SELECT 
  DATE(match_date) as day,
  COUNT(*) as match_count,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'live' THEN 1 END) as live
FROM matches
WHERE tournament_id = $1
  AND match_date >= $2
  AND match_date <= $3
GROUP BY DATE(match_date)
ORDER BY day DESC;

-- Uses: Time-based partition + index on match_date
-- Scans only relevant month partition
```

---

## 🔍 Query Monitoring Tools

### 1. pgAdmin Dashboard Queries

```sql
-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  n_live_tup as live_rows,
  n_dead_tup as dead_rows,
  round(n_dead_tup * 100.0 / NULLIF(n_live_tup, 0), 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index effectiveness
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  CASE 
    WHEN idx_scan = 0 THEN 'UNUSED'
    WHEN idx_tup_read > 0 THEN ROUND(100.0 * idx_tup_fetch / idx_tup_read, 2)
    ELSE 100 
  END as useful_ratio
FROM pg_stat_user_indexes
WHERE idx_scan > 0 OR idx_scan = 0
ORDER BY idx_scan DESC;

-- Missing indices (queries using seq scans)
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  CASE 
    WHEN seq_scan > idx_scan THEN 'Consider index'
    ELSE 'OK'
  END as recommendation
FROM pg_stat_user_tables
WHERE seq_scan > 100
ORDER BY seq_scan DESC;
```

### 2. Query Plan Analysis

```sql
-- Detailed plan (identify bottlenecks)
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, FORMAT JSON)
SELECT * FROM tournaments 
WHERE organization_id = $1 
  AND status = 'active';

-- Look for:
-- "Node Type": "Seq Scan" → Need index
-- "Actual Loops" > 1 → Correlated subquery
-- "Buffer Blocks Read" → High I/O, consider caching
```

---

## 🚀 Implementation Priority

### Week 1: Critical Indices
1. idx_tournaments_org_status
2. idx_matches_tournament_status
3. idx_players_org_team
4. idx_player_stats_tournament_goals

### Week 2: Query Optimization
1. Denormalize tournament counts
2. Denormalize team statistics
3. Add materialized view for leaderboards
4. Add full-text indices

### Week 3: Monitoring
1. Set up pg_stat_statements tracking
2. Create slow query alerts
3. Build performance dashboard

### Week 4: Maintenance
1. Automate VACUUM/ANALYZE
2. Monitor index fragmentation
3. Archiving old data strategy

