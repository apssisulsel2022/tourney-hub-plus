# Temuan & Rekomendasi Perbaikan (Lengkap)

Dokumen ini merangkum hasil analisis arsitektur, kode, performa, keamanan, UX, dan praktik pengembangan.

Format setiap temuan:
- **Deskripsi**
- **Dampak**
- **Solusi & Langkah Implementasi**
- **Estimasi Effort**
- **Kriteria Keberhasilan**

## A) Arsitektur & Maintainability

### ARCH-01: Service layer tidak seragam antar domain

- **Deskripsi**: Ada beberapa service/mock layer di `src/lib` dan `src/modules/**/services` dengan kontrak berbeda (pagination, filter, return types, error handling).
- **Dampak**: Migrasi ke backend sulit, banyak adapter di UI, duplikasi pola.
- **Solusi & Langkah Implementasi**:
  1. Definisikan kontrak generic: `ListResult<T>`, `ServiceError`, `PaginationParams`, `SortParams`.
  2. Standarkan semua service: `list(params)`, `getById(id)`, `create(dto)`, `update(id, dto)`, `remove(id)`.
  3. Standarkan error mapping: not found/validation/network.
  4. Refactor pages untuk mengandalkan kontrak baru.
- **Estimasi Effort**: M (2–4 hari)
- **Kriteria Keberhasilan**: semua domain service mengikuti interface yang sama; pages tidak punya logic mapping per-service.

### ARCH-02: Relasi antar entity masih berbasis string (name matching)

- **Deskripsi**: Beberapa fitur demo menghubungkan data berdasarkan `name` (mis. match.home.name dibanding team.name), bukan `id`.
- **Dampak**: data mismatch bila ada perubahan nama; analitik dan integrasi backend menjadi rapuh.
- **Solusi & Langkah Implementasi**:
  1. Tambah `homeTeamId`, `awayTeamId`, `venueId`, `tournamentId` pada model match.
  2. Gunakan join via id di UI (bukan string compare).
  3. Tambah test untuk memastikan join stabil.
- **Estimasi Effort**: M (2–4 hari)
- **Kriteria Keberhasilan**: tidak ada lagi join berbasis string; semua relasi via id.

## B) Performa & Skalabilitas

### PERF-01: Heavy client bundles (Leaflet/Recharts) memperbesar initial load

- **Deskripsi**: Build output menunjukkan chunk besar untuk map dan charts. Walau sudah ada route-level lazy, beberapa feature masih ikut ter-bundle pada jalur tertentu.
- **Dampak**: pengalaman lambat pada mobile/low-end, TTI/TBT meningkat.
- **Solusi & Langkah Implementasi**:
  1. Pastikan feature map/charts hanya di-load pada route yang butuh (dynamic import komponen heavy).
  2. Terapkan `React.Suspense` fallback skeleton pada komponen heavy.
  3. Tambah performance budget (Lighthouse mobile target).
- **Estimasi Effort**: M (2–3 hari)
- **Kriteria Keberhasilan**: initial JS turun, Lighthouse performance naik, route map/charts tetap responsif.

### PERF-02: Tabel data berpotensi berat tanpa virtualisasi

- **Deskripsi**: Tabel seperti players/matches bisa membesar; saat ini belum ada virtualization.
- **Dampak**: scrolling lag pada dataset besar.
- **Solusi & Langkah Implementasi**:
  1. Terapkan pagination/limit (sebagian sudah).
  2. Tambahkan virtualization untuk list besar (jika dataset real).
  3. Tambah perf test untuk 1k–10k rows.
- **Estimasi Effort**: M (2–5 hari)
- **Kriteria Keberhasilan**: FPS stabil saat scroll; time-to-interact tetap rendah.

## C) Keamanan

### SEC-01: Dependency `eact` (security placeholder)

- **Deskripsi**: Ada dependency `eact@0.0.1-security` pada [package.json](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/package.json#L49).
- **Dampak**: supply-chain compliance risk; audit/security scan dapat gagal.
- **Solusi & Langkah Implementasi**:
  1. Pastikan tidak ada import `eact` (grep).
  2. Hapus dependency dan reinstall.
  3. Jalankan `npm test`, `npm run build`.
- **Estimasi Effort**: S (0.5–1 jam)
- **Kriteria Keberhasilan**: dependency hilang; build/test pass; audit tidak menandai.

### SEC-02: `document.write()` pada export PDF

- **Deskripsi**: [StatisticsPage.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/pages/StatisticsPage.tsx) menggunakan `window.open()` lalu `document.write()` untuk print.
- **Dampak**: XSS risk jika content berasal dari input user/back-end tanpa sanitasi.
- **Solusi & Langkah Implementasi**:
  1. Ganti dengan generator PDF (client) atau generate server-side.
  2. Jika tetap print HTML, gunakan templating aman dan sanitasi.
  3. Tambahkan test untuk memastikan escaping konten.
- **Estimasi Effort**: M (1–2 hari)
- **Kriteria Keberhasilan**: tidak ada `document.write()`; export aman dan konsisten.

### SEC-03: `dangerouslySetInnerHTML` harus dibatasi

- **Deskripsi**: Ada penggunaan `dangerouslySetInnerHTML` di [chart.tsx](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/src/components/ui/chart.tsx).
- **Dampak**: bila suatu hari menerima input tidak trusted, berpotensi XSS.
- **Solusi & Langkah Implementasi**:
  1. Pastikan hanya dipakai untuk markup statis yang tidak berasal dari user.
  2. Tambah guard lint rule atau wrapper helper yang memperjelas trust boundary.
- **Estimasi Effort**: S
- **Kriteria Keberhasilan**: tidak ada dangerously HTML untuk data eksternal.

## D) UX & Aksesibilitas (WCAG)

### UX-01: Clickable table rows harus keyboard-friendly

- **Deskripsi**: List organizations sudah dibuat clickable dan keyboard-friendly.
- **Dampak**: positif; namun pola ini perlu konsisten di list lain (teams, players, matches).
- **Solusi & Langkah Implementasi**:
  1. Standarkan komponen “ClickableRow” (role/button/tabIndex + key handlers).
  2. Tambah unit test untuk keyboard navigation.
- **Estimasi Effort**: M
- **Kriteria Keberhasilan**: semua list utama bisa dioperasikan tanpa mouse.

### UX-02: Focus order & skip link pada public layout

- **Deskripsi**: PublicLayout sudah punya skip link, tapi dashboard layout juga perlu konsisten.
- **Dampak**: aksesibilitas & kepatuhan WCAG meningkat.
- **Solusi**: tambahkan skip link pada layout lain, audit focus trap pada modal/sheet.
- **Estimasi Effort**: S–M
- **Kriteria Keberhasilan**: audit WCAG AA lulus untuk navigasi utama.

## E) Testing & Quality

### QA-01: Coverage reporting belum tersedia

- **Deskripsi**: Vitest berjalan, tetapi belum ada output coverage dan threshold.
- **Dampak**: sulit memastikan regresi coverage.
- **Solusi**:
  1. Tambahkan coverage provider (v8/istanbul) untuk Vitest.
  2. Tetapkan threshold per folder (mis. lib/utils minimal 80%).
- **Estimasi Effort**: S
- **Kriteria Keberhasilan**: coverage report dapat dihasilkan di CI.

### QA-02: Playwright config tersedia tapi belum ada E2E test

- **Deskripsi**: ada [playwright.config.ts](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/playwright.config.ts) namun suite belum aktif.
- **Dampak**: alur kritis (public browse, org navigation) belum tervalidasi end-to-end.
- **Solusi**:
  1. Tambahkan smoke tests: public home, matches page, organizations list->detail.
  2. Jalankan di CI headless.
- **Estimasi Effort**: M
- **Kriteria Keberhasilan**: E2E smoke pass dan mendeteksi regression routing.

