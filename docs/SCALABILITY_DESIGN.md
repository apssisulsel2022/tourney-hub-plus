# Backend Scalability Design & Architecture

**Purpose:** Design backend system to support scale: thousands of players, hundreds of tournaments, multiple organizations  
**Date:** March 13, 2026  
**Target Scale:** 10,000+ players, 500+ tournaments, 100+ organizations (Phase 2)

---

## 📊 Scale Requirements & Projections

### Data Growth Model (Year 1)

```
MONTHS    ORGANIZATIONS    TOURNAMENTS    TEAMS      PLAYERS      MATCHES
1         10               20             100        500          50
3         25               75             400        3,000        400
6         50               150            1,000      10,000       2,500
9         75               250            2,000      25,000       8,000
12        100              500            5,000      50,000       20,000
```

### Request Volume Projections

```
CONCURRENT USERS    REQUESTS/SEC    QUERIES/SEC    PEAK LOAD
100                 200             1,000          Dashboard refresh
500                 1,000           5,000          Match day
1,000               2,000           10,000         League day
5,000               10,000          50,000+        Tournament finals
```

### Storage Projections (Year 1)

```
Primary Data:       ~5 GB
Player Photos:      ~2.5 GB (500K × 5KB avg)
Match Media:        ~10 GB (1000 matches × 10 photos)
Backups (3 copies): ~52.5 GB
---
Total:              ~70 GB (including backups)
```

---

## 🏗️ Scalable Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CLIENT LAYER (React SPA)                        │
│  Device Cache → HTTP API Calls → WebSocket for Real-time  │
└────────────────┬──────────────────────────────────────────┘
                 │
┌────────────────┼──────────────────────────────────────────┐
│     API GATEWAY / LOAD BALANCER (nginx/HAProxy)           │
│  - Rate limiting (000 req/sec per user)                   │
│  - Request routing to backend servers                     │
│  - SSL/TLS termination                                    │
│  - Compression (gzip)                                     │
└────────────────┬──────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼────────┐   ┌────▼────────────┐
│  Backend Pool  │   │ WebSocket Pool  │
│  (Auto-scaled) │   │ (Real-time)     │
│  - 5-50 servers│   │ - Sticky chats  │
│  - Node.js     │   │ - 10K conn/srvr │
│  - Express     │   │ - Redis adapter │
└───────┬────────┘   └────┬────────────┘
        │                 │
        └────────┬────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
  ┌──▼────────────┐   ┌─────▼──────────────┐
  │  Read Path    │   │  Write Path        │
  ├───────────────┤   ├────────────────────┤
  │ - Cache Layer │   │ - Write-through    │
  │ - Read        │   │ - Transactions     │
  │   Replicas    │   │ - Journal/WAL      │
  │ - Connection  │   │ - Replication      │
  │   pooling     │   │ - Async jobs       │
  └──┬────────────┘   └───────┬────────────┘
     │                        │
     └────────────┬───────────┘
                  │
         ┌────────▼──────────┐
         │  PRIMARY DATABASE │
         │   (PostgreSQL)    │
         │  - Partitioned    │
         │  - Replicated     │
         │  - Sharded (future)
         └───────────────────┘
```

---

## 🗄️ Database Optimization Strategy

### 1. Table Partitioning (For Large Tables)

#### Partitioning Strategy: By Time (Date/Created)

**Tables to Partition:**

```sql
-- MATCHES table: Partition by month (high insert/query volume)
CREATE TABLE matches (
  id UUID,
  tournament_id UUID,
  home_team_id UUID,
  away_team_id UUID,
  match_date TIMESTAMP,
  status VARCHAR(20),
  -- ... other columns
  created_at TIMESTAMP
) PARTITION BY RANGE (DATE_TRUNC('month', created_at));

-- Create partitions for each month
CREATE TABLE matches_2026_01 PARTITION OF matches
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE matches_2026_02 PARTITION OF matches
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... auto-create future partitions

-- MATCH_EVENTS table: Partition by month (high volume)
CREATE TABLE match_events (
  id UUID,
  match_id UUID,
  event_type VARCHAR(30),
  created_at TIMESTAMP
) PARTITION BY RANGE (DATE_TRUNC('month', created_at));

-- PLAYER_STATISTICS table: Partition by year
CREATE TABLE player_statistics (
  id UUID,
  player_id UUID,
  tournament_id UUID,
  season INT,
  created_at TIMESTAMP
) PARTITION BY RANGE (season);

-- NOTIFICATIONS table: Partition by week (high insert/delete rate)
CREATE TABLE notifications (
  id UUID,
  user_id UUID,
  created_at TIMESTAMP
) PARTITION BY RANGE (DATE_TRUNC('week', created_at));
```

**Benefits:**
- ✅ Faster queries on date ranges (match analytics by month)
- ✅ Easier deletion of old data (drop entire partition)
- ✅ Parallel sequential scans across partitions
- ✅ Reduced index size per partition

#### Partitioning Strategy: By Shard (Organization)

**Future scaling** (100+ GB data):

```sql
-- Shard players by organization_id (more balanced than time-based)
CREATE TABLE players (
  id UUID,
  organization_id UUID,
  team_id UUID,
  name TEXT,
  -- ...
) PARTITION BY HASH (organization_id);

-- Create 10 shards (can increase)
CREATE TABLE players_shard_0 PARTITION OF players
  FOR VALUES WITH (MODULUS 10, REMAINDER 0);
CREATE TABLE players_shard_1 PARTITION OF players
  FOR VALUES WITH (MODULUS 10, REMAINDER 1);
-- ... shard 2-9

-- Same for matches (hash by tournament_id)
CREATE TABLE matches (...) PARTITION BY HASH (tournament_id);
```

**Benefits:**
- ✅ Distributes data evenly across shards
- ✅ Each shard independently scalable
- ✅ Can migrate shards to different servers
- ✅ Predictable partition routing (query router)

---

### 2. Advanced Indexing Strategy

#### A. Columnar Index for Aggregations

**For high-volume read queries:**

```sql
-- Install BRIN (Block Range Index) for range queries
CREATE INDEX idx_matches_date_brin ON matches 
  USING BRIN (match_date) WITH (pages_per_range = 128);

-- Install GiST for spatial + temporal queries
CREATE INDEX idx_match_location_date ON matches 
  USING GIST (venue_location, match_date);

-- Install HASH for equality lookups
CREATE INDEX idx_player_org_hash ON players 
  USING HASH (organization_id);
```

#### B. Composite Indices for Multi-Column Queries

```sql
-- Tournament queries: org + status + date
CREATE INDEX idx_tournaments_query 
  ON tournaments(organization_id, status DESC, start_date DESC)
  INCLUDE (name, max_teams);

-- Player queries: org + team + position + age
CREATE INDEX idx_players_org_team_pos 
  ON players(organization_id, team_id, position_primary, age_category);

-- Match queries: tournament + date + status
CREATE INDEX idx_matches_tournament_status 
  ON matches(tournament_id, status, match_date DESC);

-- Real-time match queries: date range + status
CREATE INDEX idx_matches_date_status 
  ON matches(match_date DESC, status) 
  WHERE status IN ('live', 'upcoming');

-- Notification queries: user + read status + date
CREATE INDEX idx_notifications_user 
  ON notifications(user_id, is_read, created_at DESC);
```

#### C. Expression Indices for Derived Calculations

```sql
-- Calculate win-loss ratio efficiently
CREATE INDEX idx_team_winrate 
  ON team_statistics(
    CASE WHEN matches_played > 0 
         THEN wins::float / matches_played 
         ELSE 0 
    END DESC
  );

-- Calculate goal differential
CREATE INDEX idx_team_goaldiff 
  ON team_statistics((goals_for - goals_against) DESC);

-- Filter active tournaments by date range
CREATE INDEX idx_tournaments_active 
  ON tournaments(organization_id) 
  WHERE status = 'active' 
    AND start_date <= CURRENT_DATE 
    AND end_date >= CURRENT_DATE;
```

#### D. Bitmap Index for Boolean/Status Fields

```sql
-- High-cardinality boolean queries
CREATE INDEX idx_players_active 
  ON players(organization_id) 
  WHERE status = 'active';

CREATE INDEX idx_teams_active 
  ON teams(organization_id) 
  WHERE status = 'active';

CREATE INDEX idx_matches_live 
  ON matches(tournament_id) 
  WHERE status = 'live';
```

#### E. Partial Indices to Reduce Size

```sql
-- Only index active objects (most queries)
CREATE INDEX idx_tournaments_active_org 
  ON tournaments(organization_id, name) 
  WHERE status != 'completed' 
    AND status != 'deleted';

-- Only index recent notifications
CREATE INDEX idx_notifications_recent 
  ON notifications(user_id, created_at DESC) 
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- Only index high-value players (starters)
CREATE INDEX idx_players_starters 
  ON players(team_id, position_primary) 
  WHERE status = 'active' 
    AND jersey_number IS NOT NULL;
```

#### Index Maintenance Strategy

```sql
-- Analyze query performance after indexing
ANALYZE tournaments;
ANALYZE matches;
ANALYZE players;

-- Monitor index usage
SELECT 
  schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;

-- Rebuild fragmented indices
REINDEX INDEX idx_tournaments_org_status;

-- Remove unused indices (after 30 days)
SELECT 
  schemaname, tablename, indexname
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 
  AND indexname NOT LIKE '%_pkey'
  AND idx_blks_read + idx_blks_hit < 100;
```

---

### 3. Query Optimization Patterns

#### Pattern 1: N+1 Query Prevention

❌ **ANTI-PATTERN (N+1 queries):**
```javascript
// Fetches 1 tournament + N team queries
const tournament = await db.tournaments.findById(id);
const teams = await Promise.all(
  tournament.teamIds.map(tid => db.teams.findById(tid))
);
```

✅ **OPTIMIZED (Batch loading):**
```javascript
// Single query with JOIN
const tournament = await db.query(`
  SELECT t.*, 
         json_agg(json_build_object('id', tm.id, 'name', tm.name)) as teams
  FROM tournaments t
  LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
  LEFT JOIN teams tm ON tt.team_id = tm.id
  WHERE t.id = $1
  GROUP BY t.id
`, [id]);
```

#### Pattern 2: Projection (Select Only Needed Columns)

❌ **ANTI-PATTERN (Select all columns):**
```sql
SELECT * FROM players WHERE team_id = $1;  -- 20+ columns
```

✅ **OPTIMIZED (Select specific columns):**
```sql
SELECT id, name, position_primary, status, created_at 
FROM players 
WHERE team_id = $1;
```

#### Pattern 3: Pagination vs Full Load

❌ **ANTI-PATTERN (Load all):**
```sql
SELECT * FROM matches WHERE tournament_id = $1;  -- 1000+ rows
```

✅ **OPTIMIZED (Paginated):**
```sql
SELECT * FROM matches 
WHERE tournament_id = $1 
ORDER BY match_date DESC 
LIMIT 50 OFFSET $2;
```

#### Pattern 4: Aggregation Queries

❌ **ANTI-PATTERN (Calculate in app):**
```javascript
const players = await db.players.where({ team_id });
const total = players.length;
const avgRating = players.reduce((s, p) => s + p.rating, 0) / total;
```

✅ **OPTIMIZED (Aggregate in DB):**
```sql
SELECT 
  COUNT(*) as total,
  AVG(rating) as avg_rating,
  MIN(rating) as min_rating,
  MAX(rating) as max_rating
FROM players 
WHERE team_id = $1;
```

#### Pattern 5: Window Functions for Rankings

```sql
-- Get top 10 scorers with rank
SELECT 
  name, 
  goals,
  ROW_NUMBER() OVER (ORDER BY goals DESC) as rank,
  goals - LAG(goals) OVER (ORDER BY goals DESC) as gap_to_next
FROM player_statistics 
WHERE tournament_id = $1 
LIMIT 10;
```

#### Pattern 6: Materialized Views for Complex Queries

```sql
-- Pre-calculate standings (updated after each match)
CREATE MATERIALIZED VIEW standings_view AS
SELECT 
  s.tournament_id,
  s.team_id,
  t.name,
  s.position,
  s.played,
  s.wins,
  s.draws,
  s.losses,
  s.goals_for,
  s.goals_against,
  (s.goals_for - s.goals_against) as goal_diff,
  s.points,
  (CASE WHEN s.played > 0 THEN s.wins::float / s.played ELSE 0 END) as win_rate
FROM standings s
JOIN teams t ON s.team_id = t.id
ORDER BY s.tournament_id, s.position;

-- Index the materialized view
CREATE INDEX idx_standings_view_tournament 
ON standings_view(tournament_id, position);

-- Refresh after match updates
REFRESH MATERIALIZED VIEW CONCURRENTLY standings_view;
```

#### Pattern 7: Denormalization for Hot Data

```sql
-- Cache tournament team count in tournaments table
ALTER TABLE tournaments ADD COLUMN total_teams_count INT;

-- Update on team registration/unregistration
CREATE TRIGGER update_tournament_team_count
AFTER INSERT OR DELETE ON tournament_teams
FOR EACH ROW
EXECUTE FUNCTION update_tournament_count();

-- Query becomes O(1) lookup instead of COUNT
SELECT total_teams_count FROM tournaments WHERE id = $1;
```

---

## ⚡ Caching Strategy

### 1. Cache Layers

```
HTTP Cache Headers (Browser)
        ↓
CDN Cache (CloudFlare/Akamai)
        ↓
Application Cache (Redis)
        ↓
Database Query Cache
        ↓
PostgreSQL Buffer Pool
```

### 2. Redis Cache Architecture

```javascript
// Cache tier structure
{
  // Tournament data (1 hour TTL)
  'tournament:{tournamentId}': { json },
  'tournament:{tournamentId}:standings': { json },
  'tournament:{tournamentId}:stats': { json },
  
  // Team data (30 min TTL)
  'team:{teamId}': { json },
  'team:{teamId}:roster': { json[] },
  'team:{teamId}:matches': { json[] },
  
  // Player data (1 day TTL - static)
  'player:{playerId}': { json },
  'player:{playerId}:stats': { json },
  
  // Leaderboards (1 hour TTL - high traffic)
  'scorers:tournament:{tournamentId}': { sorted set },
  'assists:tournament:{tournamentId}': { sorted set },
  'discipline:tournament:{tournamentId}': { sorted set },
  
  // Activity feeds (15 min TTL - frequently updated)
  'feed:user:{userId}': { list },
  'feed:organization:{orgId}': { list },
  
  // Session data (24 hour TTL)
  'session:{sessionId}': { user data },
}
```

### 3. Cache Invalidation Strategy

```javascript
// Pattern 1: Time-based (TTL)
Redis.set('tournament:t1', data, 'EX', 3600);  // 1 hour

// Pattern 2: Event-based invalidation
Match.on('updated', (match) => {
  // Invalidate related caches
  Redis.del(`tournament:${match.tournamentId}:standings`);
  Redis.del(`tournament:${match.tournamentId}:stats`);
  Redis.del(`scorers:${match.tournamentId}`);
  Redis.del(`team:${match.homeTeamId}:matches`);
  Redis.del(`team:${match.awayTeamId}:matches`);
});

// Pattern 3: Dependency tracking
const CacheKey = {
  tournament: (id, type) => {
    const key = `tournament:${id}`;
    this.dependencies[key] = this.dependencies[key] || [];
    return [
      `${key}`,
      `${key}:teams`,
      `${key}:matches`,
      `${key}:standings`,
      `${key}:stats`
    ];
  }
};

// Pattern 4: Cache-aside (Lazy loading)
async function getTournament(id) {
  let cached = await Redis.get(`tournament:${id}`);
  if (cached) return JSON.parse(cached);
  
  const data = await db.tournaments.findById(id);
  await Redis.set(`tournament:${id}`, JSON.stringify(data), 'EX', 3600);
  return data;
}

// Pattern 5: Write-through (Eager update)
async function updateTournament(id, updates) {
  const data = await db.tournaments.update(id, updates);
  await Redis.set(`tournament:${id}`, JSON.stringify(data), 'EX', 3600);
  return data;
}
```

### 4. Cache Configuration

```yaml
Redis Cluster:
  nodes: 6                    # 3-node minimum
  replication: 2             # Each node has backup
  memory: 64GB               # Scales with users
  eviction_policy: allkeys-lru
  
Cache TTL Strategy:
  Static Data: 1 day         # Teams, organizations
  Frequently Updated: 15 min # Leaderboards, standings
  User-Specific: 1 hour      # Notifications, feed
  Session Data: 24 hours     # Login tokens
  
Hit Rate Targets:
  Static Data: > 95%
  User Data: > 80%
  Leaderboards: > 70%
  Overall Target: > 85%
```

---

## 🚀 API Optimization & Rate Limiting

### 1. Rate Limiting Strategy

```javascript
// Tier 1: Global rate limiting
const globalLimiter = new RateLimiter({
  type: 'token-bucket',
  capacity: 100000,          // 100k requests/minute cluster-wide
  refillRate: 100000 / 60,   // per second
});

// Tier 2: Per-user rate limiting
const userLimiter = new RateLimiter({
  keyGenerator: (req) => req.user.id,
  limits: {
    free: 1000,              // 1K requests/hour
    starter: 10000,          // 10K requests/hour
    pro: 100000,             // 100K requests/hour
    enterprise: 'unlimited'
  }
});

// Tier 3: Per-endpoint rate limiting
const endpoints = {
  'GET /api/v1/players': {
    limit: 1000,
    window: '1 minute',
    burst: 100
  },
  'POST /api/v1/matches/:id/events': {
    limit: 100,
    window: '1 minute',
    burst: 10
  }
};

// Tier 4: Per-organization rate limiting
const orgLimiter = new RateLimiter({
  keyGenerator: (req) => req.organization.id,
  limits: {
    starter: 50000,          // 50K/hour for org
    pro: 500000,             // 500K/hour for org
    enterprise: 5000000      // 5M/hour for org
  }
});
```

### 2. Request Prioritization

```javascript
// Queue requests by priority
const requestQueue = new PriorityQueue({
  priorities: {
    critical: 0,    // Emergency updates, finals
    high: 1,        // Match scoring, team updates
    normal: 2,      // Browse pages, statistics
    low: 3          // Reports, exports, backups
  }
});

// Assign priority based on context
function getPriority(req) {
  if (req.path.includes('/matches/') && req.method === 'PUT') return 'high';
  if (req.query.report === 'true') return 'low';
  return 'normal';
}
```

### 3. Request Batching

```javascript
// Client batches multiple requests
POST /api/v1/batch
{
  "requests": [
    { "method": "GET", "path": "/tournaments/t1" },
    { "method": "GET", "path": "/tournaments/t1/standings" },
    { "method": "GET", "path": "/tournaments/t1/matches" }
  ]
}

// Server executes in parallel, returns combined response
Response: 200
{
  "responses": [
    { "status": 200, "body": {...} },
    { "status": 200, "body": {...} },
    { "status": 200, "body": {...} }
  ]
}
```

---

## 📡 Connection Pool Management

### 1. PostgreSQL Connection Pool (PgBouncer)

```ini
[databases]
tourneyhub = host=db.internal port=5432 dbname=tourneyhub

[pgbouncer]
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 100
reserve_pool_size = 10
reserve_pool_timeout = 3
max_db_connections = 500
max_idle_connections = 300
idle_in_transaction_session_timeout = 60000
```

### 2. Connection Pooling per Server

```javascript
const pool = new Pool({
  host: 'db-pool.internal',
  port: 6432,                    // PgBouncer port
  database: 'tourneyhub',
  max: 50,                       // Max connections per app server
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  statement_timeout: 20000,      // 20 second query timeout
  query_timeout: 20000
});

// Monitor pool health
setInterval(() => {
  const stats = pool.totalCount;
  console.log(`Pool: ${stats.totalCount} total, ${stats.idleCount} idle`);
}, 30000);
```

### 3. Read Replica Load Balancing

```javascript
// Route read-heavy queries to replicas
const queryRouter = {
  // Write to primary
  write: (query, params) => pool.write.query(query, params),
  
  // Read from replicas (round-robin)
  read: (query, params) => {
    const replicas = [pool.replica1, pool.replica2, pool.replica3];
    const replica = replicas[Math.floor(Math.random() * replicas.length)];
    return replica.query(query, params);
  }
};

// Usage
const standings = await queryRouter.read(
  'SELECT * FROM standings WHERE tournament_id = $1',
  [tournamentId]
);

const updated = await queryRouter.write(
  'UPDATE tournaments SET status = $1 WHERE id = $2',
  ['active', tournamentId]
);
```

---

## 🔄 Async Job Processing

### 1. Job Queue Architecture

```javascript
// Job queue for long-running operations
const jobQueue = new BullMQ.Queue('background-jobs', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// Job types and priorities
const jobs = {
  // High priority (complete within 5 minutes)
  CALCULATE_STANDINGS: {
    priority: 1,
    timeout: 300000,
    retry: 3
  },
  UPDATE_PLAYER_STATS: {
    priority: 2,
    timeout: 300000,
    retry: 3
  },
  
  // Normal priority (complete within 1 hour)
  GENERATE_REPORT: {
    priority: 5,
    timeout: 3600000,
    retry: 2
  },
  SEND_NOTIFICATIONS: {
    priority: 5,
    timeout: 600000,
    retry: 3
  },
  
  // Low priority (background work)
  CLEANUP_OLD_NOTIFICATIONS: {
    priority: 10,
    timeout: 3600000,
    retry: 1,
    repeat: {
      pattern: '0 2 * * *'  // Run at 2 AM daily
    }
  },
  BACKUP_DATABASE: {
    priority: 10,
    timeout: 7200000,
    repeat: {
      pattern: '0 3 * * *'  // Run at 3 AM daily
    }
  }
};

// Queue job processing
jobQueue.process(10, async (job) => {
  switch (job.data.type) {
    case 'CALCULATE_STANDINGS':
      return calculateStandings(job.data.tournamentId);
    case 'GENERATE_REPORT':
      return generateReport(job.data.reportId);
    // ...
  }
});
```

### 2. Trigger Async Jobs

```javascript
// When match completes, queue standings calculation
Match.on('completed', async (match) => {
  await jobQueue.add(
    'CALCULATE_STANDINGS',
    { tournamentId: match.tournamentId },
    { priority: 1 }  // High priority
  );
  
  await jobQueue.add(
    'UPDATE_PLAYER_STATS',
    { 
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId
    },
    { priority: 1 }
  );
  
  await jobQueue.add(
    'SEND_NOTIFICATIONS',
    { matchId: match.id },
    { priority: 2 }
  );
});
```

---

## 📊 Horizontal Scaling

### 1. Stateless Backend Design

```javascript
// ✅ STATELESS (Can scale horizontally)
app.get('/api/v1/tournaments/:id', async (req, res) => {
  const data = await Cache.get(`tournament:${req.params.id}`);
  if (!data) {
    data = await db.tournaments.findById(req.params.id);
    await Cache.set(`tournament:${req.params.id}`, data);
  }
  res.json(data);
});

// ❌ STATEFUL (Cannot scale horizontally)
let matchCache = {};  // THIS IS BAD - Different servers have different caches
app.get('/api/v1/matches/:id', (req, res) => {
  const data = matchCache[req.params.id] || db.find(...);
  res.json(data);
});
```

### 2. Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  namespace: tourneyhub
spec:
  replicas: 5                          # Initial
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  
  template:
    spec:
      containers:
      - name: backend
        image: tourneyhub/backend:v1.0.0
        ports:
        - containerPort: 3000
        
        resources:
          requests:
            cpu: 500m
            memory: 1024Mi
          limits:
            cpu: 2000m
            memory: 2048Mi
        
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-config
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: cache-config
              key: url
        
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-api
  
  minReplicas: 5
  maxReplicas: 50
  
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 📈 Monitoring & Performance Tracking

### 1. Key Metrics

```javascript
// Performance metrics
metrics = {
  // Database
  db.query_time_p50: 10,         // 10ms median
  db.query_time_p99: 100,        // 100ms 99th percentile
  db.connections_active: 350,
  db.connections_idle: 200,
  db.replication_lag: 100,       // milliseconds
  
  // Cache
  cache.hit_ratio: 0.85,         // 85%
  cache.eviction_rate: 0.05,
  cache.memory_used: 32,         // GB
  
  // API
  api.request_count: 10000,      // per second
  api.response_time_p50: 50,     // ms
  api.response_time_p99: 500,
  api.error_rate: 0.001,         // 0.1%
  api.rate_limit_hits: 50,
  
  // Business
  active_users: 5000,
  concurrent_matches: 50,
  tournament_count: 250,
  player_count: 50000
};
```

### 2. Monitoring Setup

```javascript
// Prometheus scrape config
{
  job_name: 'tourneyhub-backend',
  scrape_interval: '15s',
  static_configs: [
    { targets: ['localhost:9090'] }
  ],
  relabel_configs: [
    { source_labels: ['__meta_pod_name'] }
  ]
}

// Grafana dashboards
- API Response Times (p50, p95, p99)
- Database Performance (connections, queries/sec, replication lag)
- Cache Hit Ratio & Memory Usage
- Error Rates & 5xx Responses
- Request Volume by Endpoint
- Queue Depth (background jobs)
- Disk I/O & Network I/O
```

### 3. Alerting Rules

```yaml
groups:
- name: tourneyhub
  rules:
  - alert: HighDatabaseLatency
    expr: db_query_time_p99 > 1000  # > 1 second
    for: 5m
    annotations:
      summary: "Database latency high"
  
  - alert: CacheHitRatioDegraded
    expr: cache_hit_ratio < 0.70   # < 70%
    for: 10m
    annotations:
      summary: "Cache efficiency degraded"
  
  - alert: HighErrorRate
    expr: api_error_rate > 0.01    # > 1%
    for: 1m
    annotations:
      summary: "API error rate high"
  
  - alert: QueueDepthHigh
    expr: job_queue_depth > 10000
    for: 5m
    annotations:
      summary: "Background job queue backed up"
  
  - alert: ReplicationLagHigh
    expr: db_replication_lag > 5000 # > 5 seconds
    for: 2m
    annotations:
      summary: "Database replication lag"
```

---

## 🔒 Data Consistency at Scale

### 1. Transaction Handling

```javascript
// Read committed isolation (good for concurrency)
BEGIN ISOLATION LEVEL READ COMMITTED;

// Match scoring transaction
BEGIN TRANSACTION;
  UPDATE matches SET home_team_score = 1, status = 'live' 
    WHERE id = 'match1'
    AND status = 'upcoming';  -- Prevent double-scoring
  
  INSERT INTO match_events VALUES (...);
  
  -- If both succeed, automatically recalculate standings
  NOTIFY match_update, 'match1:scored';
  
COMMIT;

// If commit fails, client retries (idempotent if request_id tracked)
```

### 2. Eventual Consistency for Derived Data

```javascript
// Standings are eventually consistent (recalculated async)
// Match result → Queue job → Calculate standings → Update cache

// User might see stale standings briefly
// But consistency is guaranteed within 5 minutes

// Track consistency window
const CONSISTENCY_WINDOW = {
  standings: 300000,      // 5 minutes
  player_stats: 300000,   // 5 minutes
  leaderboards: 600000    // 10 minutes
};
```

### 3. Conflict Resolution

```javascript
// Last-write-wins for non-critical fields
tournament.name = req.body.name;  // OK to overwrite

// Accumulate for critical fields
team.stats.wins += 1;  // Atomic increment
db.update('UPDATE team_statistics SET wins = wins + 1 WHERE team_id = $1', [teamId]);

// Version checking for optimistic locking
UPDATE tournament SET name = $1, version = version + 1 
  WHERE id = $2 AND version = $3;  -- Fails if updated elsewhere
```

---

## 🚨 Failure Handling & Resilience

### 1. Circuit Breaker Pattern

```javascript
const circuitBreaker = new CircuitBreaker({
  threshold: 50,           // Fail after 50 consecutive failures
  timeout: 30000,          // Reset after 30 seconds
  actions: {
    onOpen: () => { /* Switch to fallback */ },
    onClose: () => { /* Resume normal operation */ }
  }
});

// Use circuit breaker for external dependencies
try {
  const data = await circuitBreaker.execute(() => 
    externalAPI.fetchTournament(id)
  );
} catch (err) {
  // Fallback to cached data
  return await Cache.get(`tournament:${id}`);
}
```

### 2. Bulkhead Pattern (Resource Isolation)

```javascript
// Separate thread pools for different operations
const pools = {
  read: new ThreadPool(50),       // 50 threads for reads
  write: new ThreadPool(20),      // 20 threads for writes
  reporting: new ThreadPool(10)   // 10 threads for expensive reports
};

// Ensures expensive operations don't starve critical ones
const matches = await pools.read.execute(() => 
  db.getMatches(filters)
);
```

### 3. Graceful Degradation

```javascript
// Start with full features
const features = {
  leaderboards: true,
  notifications: true,
  reports: true,
  match_scoring: true  // Never disable this
};

// If cache down, disable leaderboards but keep core features
if (!Redis.isHealthy()) {
  features.leaderboards = false;
  features.notifications = false;  // Defer non-critical
  // match_scoring stays true
}

// If DB replicas down, limit read throughput
if (db.replica.isHealthy() === false) {
  rateLimit.adjustLimit(50000);  // Reduce from 100000
}
```

---

## 📋 Scalability Checklist

### Database Layer
- [x] Implement table partitioning (by time + org)
- [x] Create composite indices for all query patterns
- [x] Use partial indices for active records only
- [x] Monitor index usage and rebuild fragmented indices
- [x] Configure connection pooling (PgBouncer)
- [x] Set up read replicas (at minimum 2)
- [x] Configure replication lag monitoring
- [x] Implement query result caching (Redis)
- [x] Set up query timeout (20 seconds)
- [x] Monitor slow queries

### Caching Layer
- [x] Implement Redis cluster (3+ nodes)
- [x] Cache hot data (TTL strategy)
- [x] Set up cache invalidation triggers
- [x] Monitor cache hit ratio (target > 85%)
- [x] Implement circuit breaker for cache failures
- [x] Set up cache size monitoring and eviction

### API Layer
- [x] Implement rate limiting (per user, org, endpoint)
- [x] Set up request prioritization
- [x] Implement request batching
- [x] Add request deduplication
- [x] Implement timeout handling (20s)
- [x] Set up response compression (gzip)
- [x] Implement pagination defaults

### Infrastructure
- [x] Design stateless backend
- [x] Set up container orchestration (Kubernetes)
- [x] Configure auto-scaling (5-50 replicas)
- [x] Set up load balancer
- [x] Implement health checks (liveness + readiness)
- [x] Configure graceful shutdown (30s draining)

### Async Processing
- [x] Implement job queue (BullMQ)
- [x] Set up priority-based job processing
- [x] Implement retry logic with exponential backoff
- [x] Set up dead-letter queue for failed jobs
- [x] Monitor job queue depth

### Monitoring & Observability
- [x] Set up metrics collection (Prometheus)
- [x] Create dashboards (Grafana)
- [x] Define alerting thresholds
- [x] Set up centralized logging (ELK/Loki)
- [x] Implement distributed tracing (Jaeger)
- [x] Set up error tracking (Sentry)

### Security at Scale
- [x] Implement DDoS protection (rate limiting, IP blocking)
- [x] Set up WAF (Web Application Firewall)
- [x] Implement request signing for internal APIs
- [x] Use TLS 1.3 for all connections
- [x] Implement secrets management (HashiCorp Vault)
- [x] Set up VPN for database access

---

## 🎯 Performance Targets

| Metric | Target | Method |
|--------|--------|--------|
| **List Endpoint (paginated)** | < 200ms | Indices + pagination |
| **Detail Endpoint** | < 100ms | Query optimization + cache |
| **Search** | < 500ms | Full-text index + limit |
| **Leaderboards** | < 100ms | Materialized view + cache |
| **Match scoring** | < 50ms | Write optimization + queue |
| **Real-time update** | < 500ms | WebSocket + broadcast |
| **Report generation** | < 5 sec | Async job + pre-aggregation |
| **P95 response time** | < 500ms | Overall target |
| **P99 response time** | < 2 sec | Overall target |
| **Error rate** | < 0.5% | Resilience patterns |
| **Availability** | 99.9% | Redundancy + failover |

---

## 📚 Technology Stack for Scale

```yaml
Language & Framework:
  - Node.js 18+ (LTS)
  - Express.js 4.18+ or Fastify 4.x (higher throughput)
  - TypeScript for type safety

Database:
  - PostgreSQL 14+ (primary)
  - pg-pool (connection pooling)
  - PgBouncer (external pooling)
  
Caching:
  - Redis Cluster 6.2+ (distributed)
  - redis-py or node-redis client
  
Queue & Async:
  - BullMQ (Redis-backed job queue)
  - Alternatives: RabbitMQ, Apache Kafka (if > 100k jobs/sec)

Monitoring:
  - Prometheus (metrics collection)
  - Grafana (dashboards)
  - ELK Stack or Loki (logging)
  - Jaeger (distributed tracing)
  - Sentry (error tracking)

Orchestration:
  - Kubernetes (2+ nodes)
  - Docker for containers
  - Helm for package management
  
Load Balancing:
  - nginx or HAProxy (reverse proxy)
  - Spring Cloud Load Balancer or client-side

CDN & Distribution:
  - Cloudflare or AWS CloudFront
  - Geo-distributed edge caching
```

---

## 🚀 Roadmap to Scale

### Phase 1: Foundation (Now - 50 orgs, 10K players)
- Basic indexing
- Redis caching
- Single database with replicas
- 5-10 backend servers

### Phase 2: Optimization (50-100 orgs, 30K players)
- Advanced indexing (BRIN, GiST)
- Materialized views
- Job queue implementation
- 10-20 backend servers
- Connection pooling

### Phase 3: Partitioning (100+ orgs, 50K+ players)
- Table partitioning (by time + org)
- Read replicas in multiple regions
- Sharding preparation
- 20-50 backend servers
- Advanced monitoring

### Phase 4: Distributed (1000+ orgs, 500K+ players)
- Database sharding (by organization)
- Multi-region deployment
- 50-500 backend servers
- Advanced replication

---

## 📖 References & Best Practices

1. **PostgreSQL Performance:**
   - `EXPLAIN ANALYZE` for query optimization
   - `pg_stat_statements` for slow query identification
   - `autovacuum` configuration for maintenance

2. **Scaling Databases:**
   - The Art of PostgreSQL by Dimitri Fontaine
   - PostgreSQL 14 High Performance by Gregory Smith

3. **Distributed Systems:**
   - Designing Data-Intensive Applications by Martin Kleppmann
   - System Design Interview by Alex Xu

4. **Caching:**
   - Redis in Action by Josiah Carlson
   - Cache patterns documentation

