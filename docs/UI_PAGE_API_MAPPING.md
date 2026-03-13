# UI Pages to Backend API Mapping

**Document Purpose:** Maps each UI page to required backend APIs and data entities  
**Generated:** March 13, 2026  
**Total Pages Analyzed:** 25+

---

## 📍 Page-to-API Mapping Matrix

### 1. DashboardPage
**Location:** `src/pages/DashboardPage.tsx`  
**Route:** `/dashboard`  
**Role:** Event Organizer  
**Primary Purpose:** Real-time overview of sports operations  

**Data Entities Used:**
- Tournament (active/upcoming list)
- Match (today's matches, live matches)
- Organization (context)
- Realtime Activity

**Required API Endpoints:**
```
GET /api/v1/tournaments?status=active,upcoming&limit=3
GET /api/v1/matches?status=live,upcoming&sort=date_asc&limit=5
GET /api/v1/organizations/:orgId/metrics
GET /api/v1/notifications?read=false&limit=5
```

**UI Components:**
- `StatCard` - Shows tournament count, team count, match count
- `QuickActions` - Links to create tournament, register team
- `TournamentCard` - Displays active tournaments
- `DashboardTimeline` - Timeline of recent activities

**Load Strategy:**
- Parallel load all dashboard data on page mount
- Refresh metrics every 30 seconds (realtime updates)
- Use React Query with 30s stale time

---

### 2. TournamentsPage
**Location:** `src/pages/TournamentsPage.tsx`  
**Route:** `/tournaments`  
**Role:** Organizer/Admin  
**Primary Purpose:** Manage and track all competitions  

**Data Entities Used:**
- Tournament (full list with all properties)
- Organization (filter by org context)

**Required API Endpoints:**
```
GET /api/v1/tournaments?search=...&status=...&sort=...&page=...&limit=...
POST /api/v1/tournaments (Create)
PUT /api/v1/tournaments/:id (Update)
DELETE /api/v1/tournaments/:id (Delete)
GET /api/v1/tournaments?search=...&status=active (Export data)
```

**UI Components:**
- `SearchInput` - Search by name/location
- `StatusFilter` - Filter by status (All, Active, Upcoming, Completed, Draft)
- `SortDropdown` - Sort by (Newest, Name, Teams)
- `ViewModeToggle` - Toggle grid/list view
- Tournament cards/rows with action menu (Edit, View, Delete, Export)

**Load Strategy:**
- Paginated list (25 items per page)
- Lazy load as user scrolls or changes page
- Cache with 1 minute stale time

**Features:**
- Search bar (real-time)
- Status filter dropdown
- Sort dropdown
- View mode toggle (grid/list)
- Export button
- Create new button

---

### 3. TournamentDetailPage
**Location:** `src/pages/TournamentDetailPage.tsx`  
**Route:** `/tournaments/:id`  
**Role:** Organizer/Admin  
**Primary Purpose:** Detailed tournament management with tabs  

**Data Entities Used:**
- Tournament (single, full detail)
- Team (tournament teams)
- Match (tournament matches)
- Standing (league standings)
- Player (tournament players)
- Statistics (tournament stats)

**Required API Endpoints:**
```
GET /api/v1/tournaments/:id (Overview)
GET /api/v1/tournaments/:id/teams
GET /api/v1/tournaments/:id/matches
GET /api/v1/tournaments/:id/standings
GET /api/v1/tournaments/:id/statistics
GET /api/v1/tournaments/:id/bracket
PUT /api/v1/tournaments/:id (Update - Settings tab)
```

**Tab Structure:**
1. **Overview Tab** - Tournament details, status, dates
2. **Matches Tab** - All tournament matches
3. **Teams Tab** - Registered teams
4. **Players Tab** - All players in tournament
5. **Standings Tab** - League standings/bracket
6. **Statistics Tab** - Tournament statistics
7. **Settings Tab** - Edit tournament details

**Load Strategy:**
- Load tournament overview on mount
- Lazy load each tab when clicked
- Cache each tab with 2 minute stale time

---

### 4. MatchesPage
**Location:** `src/pages/MatchesPage.tsx`  
**Route:** `/matches`  
**Role:** Organizer/Admin  
**Primary Purpose:** Search, filter, and manage all matches  

**Data Entities Used:**
- Match (full list)
- Tournament (for filter options)
- Team (in match details)

**Required API Endpoints:**
```
GET /api/v1/matches?search=...&status=...&tournament=...&sort=...&page=...&limit=...
GET /api/v1/tournaments (for filter dropdown)
GET /api/v1/matches/:id (Open match details)
PUT /api/v1/matches/:id (Update match)
DELETE /api/v1/matches/:id (Delete match)
```

**Filter Options:**
- Search (teams, venue, tournament, match ID)
- Status (All, Live, Upcoming, Completed, Delayed)
- Tournament (dropdown)
- Sort (Date Descending, Date Ascending, Status)

**Load Strategy:**
- Paginated list (25 items per page)
- Fetch tournaments list for filter dropdown on mount
- Refresh match list on filter/search change
- Cache with 30 second stale time (due to live status)

---

### 5. MatchCenterPage
**Location:** `src/pages/MatchCenterPage.tsx`  
**Route:** `/matches/:id`  
**Role:** Organizer/Referee/Admin  
**Primary Purpose:** Match detail with live scoring and events  

**Data Entities Used:**
- Match (single, full detail)
- Team (home/away teams with rosters)
- Player (lineups, player details)
- Referee (match officials)
- MatchEvent (goals, cards, substitutions)

**Required API Endpoints:**
```
GET /api/v1/matches/:id (Full details)
GET /api/v1/matches/:id/lineups (Lineups for both teams)
POST /api/v1/matches/:id/events (Add event - goal, card, substitution)
DELETE /api/v1/matches/:id/events/:eventId (Remove event)
PUT /api/v1/matches/:id (Update score/status)
POST /api/v1/matches/:id/start (Start match)
POST /api/v1/matches/:id/end (End match)
POST /api/v1/matches/:id/lineups (Set lineups)
```

**Sections:**
- Match header (teams, score, status, time)
- Live timeline (events, substitutions)
- Lineups (starting 11 + substitutes)
- Match statistics
- Referee information
- Weather conditions

**Load Strategy:**
- Load match on mount
- Real-time updates for live matches (WebSocket)
- Polling every 5 seconds if no WebSocket
- Cache with 5 second stale time (high frequency updates)

---

### 6. TeamsPage
**Location:** `src/pages/TeamsPage.tsx`  
**Route:** `/teams`  
**Role:** Organizer/Admin  
**Primary Purpose:** Manage and track all registered clubs  

**Data Entities Used:**
- Team (full list)
- Organization (context)

**Required API Endpoints:**
```
GET /api/v1/teams?search=...&status=...&sort=...&page=...&limit=...
POST /api/v1/teams (Create new team)
GET /api/v1/teams/:id (Team detail)
PUT /api/v1/teams/:id (Update team)
DELETE /api/v1/teams/:id (Delete team)
```

**Filter Options:**
- Search (name, city)
- Status (All, Active, Inactive)
- Sort (Name, Date, Matches)
- View Mode (Grid, List)

**Load Strategy:**
- Paginated list (20 items per page)
- Cache with 1 minute stale time

---

### 7. PlayersPage
**Location:** `src/pages/PlayersPage.tsx`  
**Route:** `/players`  
**Role:** Organizer/Admin  
**Primary Purpose:** Manage and view all registered players  

**Data Entities Used:**
- Player (full list)
- Team (for filter options)
- Organization (context)

**Required API Endpoints:**
```
GET /api/v1/players?search=...&clubId=...&ageCategory=...&position=...&sortBy=...&sortOrder=...&page=...&limit=...
GET /api/v1/teams (for club filter dropdown)
POST /api/v1/players (Register new player)
GET /api/v1/players/:id (Player profile)
PUT /api/v1/players/:id (Update player)
DELETE /api/v1/players/:id (Delete player)
DELETE /api/v1/players/bulk (Bulk delete)
GET /api/v1/players?export=true (Export players)
```

**Filter Options:**
- Search (player name)
- Club/Team (multi-select dropdown)
- Age Category (multi-select dropdown)
- Position (multi-select dropdown)
- Sort By (Name, Age, Rating)
- View Mode (Table, Grid cards)

**Load Strategy:**
- Paginated list (10 per page in table, 20 in grid)
- Lazy load teams dropdown on mount
- Cache with 1 minute stale time
- Fetch teams once and cache for filter

---

### 8. Player Profile Page
**Location:** `src/pages/players/:id`  
**Route:** `/players/:id`  
**Role:** Organizer/Admin/Coach  
**Primary Purpose:** View/edit individual player profile  

**Data Entities Used:**
- Player (single, full detail)
- Team (player's team)
- PlayerStatistic (career stats)
- MatchEvent (match history)
- TrainingRecord (training data)
- PlayerDocument (documents)

**Required API Endpoints:**
```
GET /api/v1/players/:id (Player profile)
PUT /api/v1/players/:id (Update profile)
GET /api/v1/players/:id/statistics (Career stats)
GET /api/v1/players/:id/matches (Match history)
GET /api/v1/players/:id/training (Training records)
POST /api/v1/players/:id/documents (Upload document)
DELETE /api/v1/players/:id/documents/:docId (Delete document)
```

**Tabs:**
1. **Info Tab** - Personal details, contact, emergency contact
2. **Statistics Tab** - Career stats, ratings
3. **Matches Tab** - Match history with performance
4. **Training Tab** - Training records
5. **Documents Tab** - Uploaded documents

**Load Strategy:**
- Load player info on mount
- Lazy load each tab when clicked
- Cache player profile with 5 minute stale time

---

### 9. StandingsPage
**Location:** `src/pages/StandingsPage.tsx`  
**Route:** `/standings`  
**Role:** Public/Organizer  
**Primary Purpose:** View league standings/tables  

**Data Entities Used:**
- Standing (league table)
- Team (team details in standings)
- Tournament (selected tournament context)

**Required API Endpoints:**
```
GET /api/v1/standings/tournament/:tournamentId
GET /api/v1/tournaments (to show which tournament)
```

**Sections:**
- League table with columns: Position, Team, Played, W-D-L, Points, GF-GA, GD, Form

**Load Strategy:**
- Load standings on mount (specific tournament context)
- Refresh on demand
- Cache with 2 minute stale time

---

### 10. StatisticsPage
**Location:** `src/pages/StatisticsPage.tsx`  
**Route:** `/statistics`  
**Role:** Public/Organizer  
**Primary Purpose:** Player statistics and leaderboards  

**Data Entities Used:**
- PlayerStatistic (aggregated stats)
- Player (player details)
- Team (team context)
- Tournament (tournament filter)

**Required API Endpoints:**
```
GET /api/v1/statistics/players?season=...&competition=...&team=...&page=...&limit=...
GET /api/v1/statistics/players/scorers
GET /api/v1/statistics/players/assists
GET /api/v1/statistics/players/discipline
GET /api/v1/tournaments (for filter)
GET /api/v1/teams (for filter)
```

**Leaderboards:**
1. **Top Scorers** - Goals per game, total goals
2. **Top Assists** - Assists per game, total assists
3. **Discipline** - Yellow cards, red cards, suspensions

**Filters:**
- Season dropdown
- Competition dropdown
- Team dropdown

**Load Strategy:**
- Load scorers list on mount
- Lazy load other leaderboards when tab clicked
- Cache with 1 hour stale time

---

### 11. VenuesPage
**Location:** `src/pages/VenuesPage.tsx`  
**Route:** `/venues`  
**Role:** Organizer/Admin  
**Primary Purpose:** Manage venues and view availability  

**Data Entities Used:**
- Venue (full list)
- VenueAmenity (amenity options)
- VenueBooking (bookings for availability)
- Organization (context)

**Required API Endpoints:**
```
GET /api/v1/venues?search=...&city=...&type=...&amenities=...&capacityMin=...&capacityMax=...&sort=...&page=...&limit=...
GET /api/v1/venues (list available cities)
GET /api/v1/venues/types (list venue types)
GET /api/v1/venues/amenities (list amenities)
GET /api/v1/venues/:id (Venue detail)
POST /api/v1/venues (Create venue)
PUT /api/v1/venues/:id (Update venue)
DELETE /api/v1/venues/:id (Delete venue)
GET /api/v1/venues/:id/bookings (Bookings for venue)
GET /api/v1/venues/:id/availability (Available time slots)
```

**Filter Options:**
- Search (name)
- City (dropdown)
- Type (dropdown)
- Amenities (multi-select checkboxes)
- Capacity range (min-max sliders)
- Sort (Alphabetical, Capacity, Distance from me)

**Features:**
- Map view (requires geolocation)
- Card view with distance calculation
- Booking availability display

**Load Strategy:**
- Load venues list with initial filters on mount
- Fetch filter options (cities, types, amenities) once
- Lazy load as user scrolls or changes page
- Cache with 10 minute stale time
- Request geolocation for distance sorting

---

### 12. RefereesPage
**Location:** `src/pages/RefereesPage.tsx`  
**Route:** `/referees`  
**Role:** Organizer/Admin  
**Primary Purpose:** Manage referees and assignments  

**Data Entities Used:**
- Referee (full list)
- Match (for assignments)

**Required API Endpoints:**
```
GET /api/v1/referees?search=...&sort=...&page=...&limit=...
GET /api/v1/referees/:id (Referee detail)
POST /api/v1/referees (Register referee)
PUT /api/v1/referees/:id (Update referee)
DELETE /api/v1/referees/:id (Delete referee)
GET /api/v1/referees/:id/assignments (Assigned matches)
POST /api/v1/referees/:id/assignments (Assign to match)
DELETE /api/v1/referees/:id/assignments/:matchId (Unassign from match)
```

**Columns:**
- Name, Email, Phone, Role, Certifications, Status, Assigned Matches

**Load Strategy:**
- Paginated list (20 per page)
- Cache with 5 minute stale time

---

### 13. OrganizationsPage
**Location:** `src/pages/OrganizationsPage.tsx`  
**Route:** `/organizations`  
**Role:** Super Admin  
**Primary Purpose:** Platform-wide organization management  

**Data Entities Used:**
- Organization (full list)
- Organization metrics (stats)

**Required API Endpoints:**
```
GET /api/v1/organizations?search=...&page=...&limit=...
GET /api/v1/organizations/:id (Organization detail)
POST /api/v1/organizations (Create organization)
PUT /api/v1/organizations/:id (Update organization)
DELETE /api/v1/organizations/:id (Delete organization)
GET /api/v1/organizations/:id/metrics (Tournaments, players, revenue)
GET /api/v1/organizations/:id/members (Organization members)
POST /api/v1/organizations/:id/members (Add member)
DELETE /api/v1/organizations/:id/members/:userId (Remove member)
```

**Display:**
- Top stat cards: Total Orgs, Active Tournaments, Registered Players, Revenue
- Searchable table with columns: Organization, Country, Tournaments, Users, Plan, Status

**Load Strategy:**
- Load organizations list with metrics on mount
- Cache with 5 minute stale time

---

### 14. NotificationsPage
**Location:** `src/pages/NotificationsPage.tsx`  
**Route:** `/notifications`  
**Role:** All authenticated users  
**Primary Purpose:** View and manage user notifications  

**Data Entities Used:**
- Notification (user's notifications)

**Required API Endpoints:**
```
GET /api/v1/notifications?read=...&type=...&page=...&limit=...
GET /api/v1/notifications/:id (Notification detail)
POST /api/v1/notifications/:id/read (Mark as read)
POST /api/v1/notifications/read-all (Mark all as read)
DELETE /api/v1/notifications/:id (Delete notification)
```

**Filter Options:**
- All/Unread/Read
- Type filter (Match, Tournament, Team, Player)

**Load Strategy:**
- Load notifications on mount with pagination
- Auto-refresh every 30 seconds for new notifications
- Cache with 0 second stale time (frequent updates)

---

### 15. ReportsPage
**Location:** `src/pages/ReportsPage.tsx`  
**Route:** `/reports`  
**Role:** Organizer/Admin  
**Primary Purpose:** Generate and view reports  

**Data Entities Used:**
- Report (list of generated reports)
- Tournament (for report context)

**Required API Endpoints:**
```
GET /api/v1/reports?type=...&page=...&limit=...
GET /api/v1/reports/:id (Report details)
POST /api/v1/reports (Generate new report)
DELETE /api/v1/reports/:id (Delete report)
GET /api/v1/reports/:id/export (Export as CSV/PDF)
```

**Report Types:**
- Tournament Summary
- Player Performance
- Match Analysis
- Team Standings
- Season Review

**Load Strategy:**
- Load reports list on mount
- Cache with 10 minute stale time

---

### 16. SettingsPage
**Location:** `src/pages/SettingsPage.tsx`  
**Route:** `/settings`  
**Role:** All authenticated users  
**Primary Purpose:** User preferences and account management  

**Data Entities Used:**
- User/Profile (settings)

**Required API Endpoints:**
```
GET /api/v1/users/profile (Get settings)
PUT /api/v1/users/profile (Update settings)
```

**Sections:**
- Account settings (email, name, password)
- Notification preferences
- Organization preferences
- Theme/Display settings

**Load Strategy:**
- Load user profile on mount
- Cache with session duration

---

## 📊 Data Entity Usage Matrix

| Data Entity | Pages Used | Core | Derived |
|------------|-----------|------|---------|
| **Tournament** | Dashboard, Tournaments, TournamentDetail, Matches, MatchCenter, Statistics | ✅ | |
| **Match** | Dashboard, Matches, MatchCenter, StandingsDetail, TournamentDetail | ✅ | |
| **Team** | Tournaments, Matches, Teams, Players, Statistics, Standings | ✅ | |
| **Player** | Players, Profile, Tournaments, Statistics, MatchCenter | ✅ | |
| **Venue** | Venues, Matches, MatchCenter | ✅ | |
| **Referee** | Referees, MatchCenter, Matches | ✅ | |
| **Organization** | Organizations, Dashboard, Settings | ✅ | |
| **Standing** | StandingsPage, TournamentDetail | | ✅ |
| **PlayerStatistic** | Statistics, PlayerProfile, Tournament | | ✅ |
| **MatchEvent** | MatchCenter, Statistics | ✅ | |
| **Notification** | Notifications, All pages (header) | ✅ | |
| **Report** | Reports | ✅ | |
| **Booking** | Venues, MatchCenter | ✅ | |
| **User/Profile** | All, Settings, Auth | ✅ | |

---

## 🔄 API Dependency Graph

```
Dashboard
├── GET /tournaments?status=active
├── GET /matches?status=live
├── GET /organizations/:id/metrics
└── GET /notifications?unread=true

TournamentsPage
├── GET /tournaments (list)
├── POST /tournaments (create)
├── PUT /tournaments/:id (edit)
└── DELETE /tournaments/:id (delete)

TournamentDetails
├── GET /tournaments/:id (overview)
├── GET /tournaments/:id/teams
├── GET /tournaments/:id/matches
├── GET /tournaments/:id/standings
├── GET /tournaments/:id/statistics
└── GET /tournaments/:id/bracket

MatchesPage
├── GET /tournaments (for filter)
└── GET /matches (list with filters)

MatchCenterPage
├── GET /matches/:id
├── GET /matches/:id/lineups
├── POST /matches/:id/events
└── PUT /matches/:id (update score)

TeamsPage
├── GET /teams (list)
├── POST /teams (create)
├── PUT /teams/:id (edit)
└── DELETE /teams/:id (delete)

PlayersPage
├── GET /teams (for dropdown)
├── GET /players (list with filters)
├── POST /players (create)
└── DELETE /players/:id (delete)

PlayerProfile
├── GET /players/:id
├── GET /players/:id/statistics
├── GET /players/:id/matches
├── GET /players/:id/training
└── GET /players/:id/documents

StandingsPage
└── GET /standings/tournament/:id

StatisticsPage
├── GET /statistics/players/scorers
├── GET /statistics/players/assists
└── GET /statistics/players/discipline

VenuesPage
├── GET /venues/types (options)
├── GET /venues/cities (options)
├── GET /venues/amenities (options)
└── GET /venues (list with filters)

RefereesPage
├── GET /referees (list)
└── GET /referees/:id/assignments

OrganizationsPage
├── GET /organizations (list)
└── GET /organizations/:id/metrics

NotificationsPage
└── GET /notifications (list)

ReportsPage
├── GET /reports (list)
└── POST /reports (generate)
```

---

## ⚡ Performance Optimization Strategy

### Caching Strategy
| Resource | Stale Time | Reason |
|----------|-----------|--------|
| Tournaments list | 1 min | Frequently filtered/sorted |
| Matches list | 30 sec | Live status changes |
| Standings | 2 min | Calculated after matches |
| Players list | 1 min | Roster changes |
| Venues | 10 min | Relatively static |
| Statistics | 1 hour | Historical data |
| Organizations | 5 min | Membership changes |
| Notifications | 0 sec | Real-time updates |

### Parallel Loading
- Dashboard loads all 4 queries in parallel
- Tournament Detail tabs load sequentially but cached
- Operations list pages load on mount with pagination

### Polling & WebSocket
- Live matches: WebSocket priority, fallback to 5s polling
- Notifications: 30s polling (or WebSocket)
- Dashboard: 30s polling for updates

---

## 📱 Page Load Sequence Diagram

```
User navigates to page
  ↓
Page component mounts
  ↓
  ├─ Fetch initial data (in parallel if possible)
  ├─ Update component state
  ├─ Render skeleton/loading states
  └─ Trigger fetch completion
  ↓
Data arrives
  ├─ Update React state
  ├─ Replace skeletons with actual content
  └─ Set up polling/WebSocket if needed
  ↓
User interacts (search, filter, sort, pagination)
  ├─ Validate input
  ├─ Update URL params
  ├─ Trigger API call
  └─ Show loading state
  ↓
New data arrives
  └─ Update state and render
```

