# Executive Summary & Roadmap

Tanggal: 2026-03-12

## Executive Summary

Aplikasi ini adalah platform turnamen end-to-end yang terdiri dari:

- **Dashboard/Admin** untuk pengelolaan turnamen, organisasi, pertandingan, venue, pemain, dan statistik.
- **Public website** untuk konsumsi publik: jadwal, hasil, standings, tim, pemain, dan statistik.

Secara umum, codebase sudah memiliki:

- Fondasi UI kuat berbasis **shadcn/ui (Radix UI) + Tailwind**, React Router, dan TypeScript.
- Layer data *mock/in-memory* (service) yang memudahkan prototyping UI.
- Unit tests untuk bagian-bagian kritis (timeline, standings, statistik, organisasi, venues util).
- Optimasi performa awal melalui **route-level code splitting** di [App.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/App.tsx).

Namun, untuk menuju produksi/scale, ada beberapa gap utama:

- Layer backend/API belum terdefinisi sebagai kontrak formal (masih mock service).
- Risiko keamanan: dependency mencurigakan dan pola output HTML ke `window.open().document.write()`.
- Konsistensi data antar modul (teams/players/matches/standings/organizations) belum terstandardisasi.
- Observability/performance measurement belum ada (tidak ada profiling budget, error reporting).

## Prioritas Temuan (Top 10)

1. **[SEC-01] Hapus dependency `eact` yang bertipe `0.0.1-security`**  
   - Dampak: potensi supply-chain risk & audit gagal.  
   - Effort: S (0.5–1 jam)  
   - Sukses: `package.json` bersih, `npm audit` tidak memuat package tersebut.

2. **[SEC-02] Hilangkan `document.write()` untuk export PDF** di [StatisticsPage.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/pages/StatisticsPage.tsx)  
   - Dampak: vector XSS bila HTML mengandung input user.  
   - Effort: M (1–2 hari)  
   - Sukses: export PDF memakai library generator atau server-side rendering; tanpa `document.write()`.

3. **[ARCH-01] Standarisasi service layer (list/getById/create/update/delete)** untuk semua domain  
   - Dampak: duplikasi pola, sulit migrasi ke backend.  
   - Effort: M (2–4 hari)  
   - Sukses: interface service seragam + typed DTO + error handling konsisten.

4. **[PERF-01] Kurangi payload awal dan heavy chunks (Leaflet/Recharts)**  
   - Dampak: TTI/TBT naik di device low-end.  
   - Effort: M (2–3 hari)  
   - Sukses: Lighthouse mobile naik, chunk heavy hanya diload saat route terkait.

5. **[UX-01] Konsistensi navigasi dan deep link**  
   - Dampak: user bingung saat pindah dashboard ↔ public.  
   - Effort: S–M (1–2 hari)  
   - Sukses: header/nav konsisten, breadcrumb jelas, back behavior benar.

6. **[SEC-03] Validasi & sanitasi data sebelum render HTML (dangerous HTML)**  
   - Dampak: potensi XSS jika suatu saat data berasal dari backend.  
   - Effort: M (2–3 hari)  
   - Sukses: tidak ada `dangerouslySetInnerHTML` untuk data yang tidak trusted.

7. **[QA-01] Tambah coverage reporting & baseline target**  
   - Dampak: kualitas sulit terukur.  
   - Effort: S (0.5–1 hari)  
   - Sukses: coverage report tersedia (lines/branches/functions), threshold jelas.

8. **[OBS-01] Tambah error boundary + logging**  
   - Dampak: runtime crash sulit ditangkap.  
   - Effort: M (1–2 hari)  
   - Sukses: error boundary per route + opsi integrasi Sentry/LogRocket.

9. **[DX-01] Standarkan lint rules & remove warnings**  
   - Dampak: noise tinggi di CI.  
   - Effort: S (0.5–1 hari)  
   - Sukses: lint clean (0 warning) atau policy warning yang jelas.

10. **[DATA-01] Konsistensi IDs antar entity** (teams ↔ matches ↔ players ↔ standings)  
   - Dampak: sulit join data dan analitik.  
   - Effort: M (2–4 hari)  
   - Sukses: semua relasi pakai id, bukan string name matching.

## Roadmap Implementasi (4 Minggu)

### Minggu 1: Security & Baseline Quality
- SEC-01 remove `eact`
- SEC-02 refactor export PDF
- QA-01 setup coverage reporting + CI gate

### Minggu 2: Service Layer & API Contract
- ARCH-01 standard service interface + error model
- DATA-01 perbaiki relasi antar entity berbasis id
- Mulai definisi API (OpenAPI draft)

### Minggu 3: Performance & UX
- PERF-01 lazy load heavy libs (Leaflet, Recharts)
- UX-01 navigation consistency + deep link policies

### Minggu 4: Hardening & Observability
- OBS-01 error boundary + logging
- Audit aksesibilitas (WCAG) + perbaikan
- Dokumentasi final untuk stakeholder

