# Daftar Dependensi & Catatan Risiko

Sumber: [package.json](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/package.json)

## Runtime Dependencies (Core)

- React 18 + React DOM
- React Router DOM (routing)
- @tanstack/react-query (data fetching/caching/polling)
- shadcn/ui + Radix UI components
- Tailwind CSS + tailwindcss-animate + tailwind-merge
- framer-motion (animasi)
- recharts (visualisasi statistik)
- leaflet + react-leaflet + supercluster (maps + clustering)
- react-hook-form + zod (forms + validation)
- date-fns (tanggal)
- sonner (toast)
- qrcode.react (QR)

## Dev Dependencies (Tooling)

- Vite + @vitejs/plugin-react-swc
- TypeScript
- ESLint (eslint-plugin-react-hooks, eslint-plugin-react-refresh, typescript-eslint)
- Vitest + jsdom + Testing Library
- Playwright (E2E config tersedia)

## Temuan Risiko & Rekomendasi

### DEP-SEC-01: `eact` (0.0.1-security)

- Lokasi: [package.json](file:///d:/PROYEK%20WEB%20MASTER/APLIKASI/tourney-hub-plus/package.json#L49)
- Masalah: package dummy/security placeholder biasanya dipakai untuk memblok nama package; tetap berisiko untuk supply-chain compliance dan audit.
- Dampak: `npm audit`/security scan bisa menandai; CI security policy dapat gagal.
- Rekomendasi:
  - Hapus `eact` dari dependencies.
  - Pastikan tidak ada import yang menggunakan `eact` (grep sebelum remove).
- Effort: S (0.5–1 jam)
- Sukses: build/test tetap pass, dependency hilang.

### DEP-MAINT-01: Browserslist database outdated warning

- Gejala: Vite build menampilkan warning update caniuse-lite.
- Dampak: minor, tetapi bisa memengaruhi output autoprefixing target.
- Rekomendasi: jalankan `npx update-browserslist-db@latest` secara periodik atau via CI.
- Effort: S

