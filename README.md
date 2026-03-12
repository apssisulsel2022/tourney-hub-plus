# Tourney Hub Plus (KickOff)

Web aplikasi manajemen turnamen (dashboard/admin) + public tournament website, dibangun dengan React + TypeScript + Vite.

## Quick Start

Prerequisites:
- Node.js 18+
- npm 9+

```bash
npm install
npm run dev
```

Dev server:
- http://localhost:8080

## Scripts

- `npm run dev` menjalankan dev server Vite
- `npm run build` build production
- `npm run preview` preview build
- `npm run lint` lint (ESLint)
- `npm test` unit tests (Vitest)

## Routes Utama

**Dashboard/Admin**
- `/` dashboard
- `/organizations` list organizations
- `/organizations/:id` organization detail (routing berbasis ID)
- `/tournaments` tournaments
- `/matches` matches, detail, match center
- `/venues` venues, profile, schedule

**Public Website**
- `/public` home
- `/public/matches`, `/public/matches/:id`, `/public/matches/:id/center`
- `/public/standings`
- `/public/teams`, `/public/teams/:id`
- `/public/players`, `/public/players/:id`
- `/public/statistics`

## Struktur Project (High Level)

- `src/pages` halaman route-level
- `src/components` reusable UI components (shadcn/ui + custom)
- `src/modules` domain modules (players, teams, tournaments, realtime)
- `src/lib` domain services + utilities (matches, venues, standings, organizations, metrics)
- `src/test` unit tests (Vitest + Testing Library)

## Dokumentasi

- Analisis & arsitektur: [docs/architecture.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/architecture.md)
- Ringkasan & roadmap perbaikan: [docs/executive-summary.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/executive-summary.md)
- Temuan detail & rekomendasi: [docs/findings-and-recommendations.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/findings-and-recommendations.md)
- Dependensi: [docs/dependencies.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/dependencies.md)
- Dokumentasi API (internal service layer + proposal REST): [docs/api.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/api.md)
- Panduan pengguna + troubleshooting + FAQ: [docs/user-guide.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/user-guide.md)
- Content management (public): [docs/content-management.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/content-management.md)
- Testing report: [docs/testing-report.md](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/docs/testing-report.md)
