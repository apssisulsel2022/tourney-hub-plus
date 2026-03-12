# Public Tournament Website Content Management

## Primary Public Routes

- Home: `/public`
- Matches: `/public/matches` and match detail `/public/matches/:id` and match center `/public/matches/:id/center`
- Standings: `/public/standings`
- Teams: `/public/teams` and team detail `/public/teams/:id`
- Players: `/public/players` and player profile `/public/players/:id`
- Statistics: `/public/statistics`

## Where the Public Content Comes From

This project currently uses in-repo mock services as a stand-in for a real tournament management backend.

- Matches (schedule/results/live):
  - Source: [matches.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/matches.ts)
  - Update seeded teams, tournaments, and match generation inside that file.
- Standings:
  - Source: [standings.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/standings.ts)
  - Replace `demoStandings` or update `standingsService.get()` to fetch from a backend.
- Teams:
  - Source: [teamService.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/modules/teams/services/teamService.ts)
  - Update the initial `teams` array (city, coach, roster, stats).
- Players:
  - Source: [playerService.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/modules/players/services/playerService.ts)
  - Update `generateMockPlayers()` or replace storage with a backend.
- Statistics:
  - Source: [playerMetrics.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/playerMetrics.ts)
  - Update mock generation and filtering logic.

## Real-Time Updates

Public pages poll for updates via React Query:

- Home matches: 15s
- Matches list: 15s
- Standings: 30s
- Players list: 30s

Adjust polling intervals in the relevant public pages under:
- [src/pages/public](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/pages/public)

## SEO and Social Sharing

- Base meta tags and canonical link live in [index.html](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/index.html)
- Per-page meta updates are applied in [PublicLayout.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/components/layout/PublicLayout.tsx)
- Robots and sitemap:
  - [robots.txt](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/public/robots.txt)
  - [sitemap.xml](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/public/sitemap.xml)
- Sharing buttons:
  - [ShareButton.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/components/public/ShareButton.tsx)

## Branding

- Public chrome (top navigation, mobile bottom navigation, footer): [PublicLayout.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/components/layout/PublicLayout.tsx)
- Home hero content: [PublicTournamentHome.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/pages/public/PublicTournamentHome.tsx)

