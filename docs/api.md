# Dokumentasi API

Catatan: saat ini aplikasi belum terhubung ke backend produksi. “API” yang tersedia adalah **internal service layer** berbasis in-memory/mock di `src/lib` dan `src/modules/**/services`. Dokumen ini memuat:

1) API internal saat ini (method signatures + contoh output)  
2) Proposal REST API untuk integrasi Tournament Management System

## 1) Internal Service Layer (Current)

### Organizations

Sumber: [organizations.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/organizations.ts)

**List**
- Method: `organizationsService.list(): Promise<Organization[]>`
- Contoh response:

```json
[
  {
    "id": "org-cfa",
    "name": "City Football Association",
    "shortName": "CFA",
    "status": "active",
    "plan": "Enterprise",
    "location": { "city": "New York", "country": "USA" },
    "metrics": { "activeTournaments": 5, "totalTeams": 48, "totalPlayers": 960, "monthlyRevenueUsd": 199, "users": 12 }
  }
]
```

**Get by ID**
- Method: `organizationsService.getById(id: string): Promise<Organization | null>`
- Contoh response (berhasil):

```json
{
  "id": "org-cfa",
  "name": "City Football Association",
  "members": [
    { "id": "cfa-m1", "name": "Sarah Connor", "email": "sarah@cityfootball.com", "role": "Admin", "status": "active" }
  ]
}
```

- Contoh response (tidak ditemukan):

```json
null
```

### Matches

Sumber: [matches.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/matches.ts)

**List**
- Method: `matchService.list(params): Promise<{ items: Match[]; total: number }>`
- Params utama: `page`, `limit`, `search`, `status`, `sort`

**Get by ID**
- Method: `matchService.getById(id: string): Promise<Match | undefined>`

### Venues

Sumber: [venues.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/venues.ts)

**List**
- Method: `venueService.list(filters): Promise<{ items: Venue[]; total: number }>`

**Booking**
- `venueService.listBookings(venueId)`
- `venueService.requestBooking(venueId, request)`

### Players

Sumber: [playerService.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/modules/players/services/playerService.ts)

- `getPlayers(page, limit, filters?)`
- `getPlayerById(id)`
- `createPlayer(data)`
- `updatePlayer(id, data)`
- `deletePlayer(id)`

## 2) Proposal REST API (Tournament Management System)

Tujuan: memungkinkan “real-time update” yang sesungguhnya, integrasi SEO, dan konsistensi data lintas modul.

### Model Kontrak Umum

- Semua entity memiliki `id` (UUID/ULID).
- Semua response memiliki `requestId` untuk tracing (opsional).
- Errors mengikuti format konsisten:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Organization not found",
    "details": {}
  }
}
```

### Organizations

**GET /api/organizations**

Query:
- `q` (search)
- `page`, `limit`

Response:

```json
{
  "items": [
    { "id": "org_01", "name": "City Football Association", "status": "active", "plan": "Enterprise" }
  ],
  "total": 1
}
```

**GET /api/organizations/{id}**

Response:

```json
{
  "id": "org_01",
  "name": "City Football Association",
  "description": "…",
  "members": [
    { "id": "mem_01", "name": "Sarah Connor", "email": "sarah@cityfootball.com", "role": "Admin", "status": "active" }
  ],
  "metadata": { "timezone": "America/New_York" }
}
```

### Matches

**GET /api/matches**
- Query: `status`, `from`, `to`, `teamId`, `q`, `page`, `limit`

**GET /api/matches/{id}**
- Response memuat detail match, venue, officials, events, stats.

### Standings

**GET /api/standings**
- Query: `tournamentId`, `seasonId`
- Response: table rows + metadata tie-break.

### Teams / Players

**GET /api/teams**, **GET /api/teams/{id}**  
**GET /api/players**, **GET /api/players/{id}**

### Statistics

**GET /api/statistics**
- Query: `tournamentId`, `seasonId`, `metric`, `limit`

## Catatan Implementasi

- Untuk real-time: gunakan SSE/WebSocket (atau polling + ETag).
- Untuk caching: gunakan `ETag` dan `Cache-Control`.
- Untuk SEO publik: server-side rendering/edge rendering jika dibutuhkan.

