# Panduan Pengguna (User Guide)

Dokumen ini ditujukan untuk pengguna non-teknis (operator turnamen, admin organisasi) dan pengguna teknis (developer/support).

## 1) Instalasi (Developer / Self-hosted)

Prerequisites:
- Node.js 18+
- npm 9+

Langkah:

```bash
npm install
npm run dev
```

Akses:
- Dashboard/Admin: `http://localhost:8080/`
- Public website: `http://localhost:8080/public`

## 2) Cara Pakai (User Flows)

### Organizations
- Buka **Organizations**: `/organizations`
- Cari organisasi menggunakan search di bagian “Directory”
- Klik satu baris organisasi untuk masuk detail: `/organizations/:id`
- Di halaman detail:
  - Tab **Overview**: ringkasan turnamen aktif & highlight metadata
  - Tab **Members**: cari & filter anggota berdasarkan role
  - Tab **Metadata**: informasi operasional dan billing

### Public Website
- Home: `/public` (upcoming matches, results, top scorers)
- Matches: `/public/matches` (search + filter status)
- Match detail: `/public/matches/:id` (detail venue, officials, weather)
- Match center: `/public/matches/:id/center`

## 3) Troubleshooting

### Aplikasi blank / error saat start
- Jalankan ulang:
  - `npm install`
  - `npm run dev`
- Pastikan port `8080` tidak dipakai aplikasi lain.

### Error saat test
- Jalankan `npm test` dan cek output.
- Jika terkait browser API (ResizeObserver/URL.createObjectURL), cek mock di:
  - [setup.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/test/setup.ts)

### Peta (Leaflet) tidak muncul
- Pastikan CSS leaflet terimport:
  - [main.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/main.tsx)
- Jika tile gagal dimuat, periksa koneksi internet dan kebijakan CORS di hosting.

## 4) FAQ

### Apakah data sudah real-time dari backend?
Belum. Saat ini masih memakai mock service in-memory dengan polling React Query di beberapa halaman public.

### Bagaimana mengganti data demo?
Update file service terkait:
- Organizations: [organizations.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/organizations.ts)
- Matches: [matches.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/lib/matches.ts)
- Teams: [teamService.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/modules/teams/services/teamService.ts)
- Players: [playerService.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/modules/players/services/playerService.ts)

### Bagaimana menambah halaman baru?
- Tambahkan page di `src/pages/...`
- Tambahkan route di [App.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/App.tsx)

