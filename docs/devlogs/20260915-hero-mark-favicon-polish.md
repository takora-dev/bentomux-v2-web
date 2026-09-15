# Hero Mark HD + Breath Animation + Favicon

**Branch:** `hero-mark-favicon-polish` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Tiga keluhan tampilan diselesaikan sekaligus: watermark mark di hero terlihat tidak HD karena sumbernya cuma 504px padahal dirender sampai 480 CSS px, animasi *breathe*-nya terlalu lambat (9s) dan rentangnya terlalu sempit (0.14→0.22) sehingga praktis tidak terlihat, dan situs belum punya favicon sama sekali. Sumber mark di-export ulang ke 1024px dari `icon.icns` aplikasi (artwork identik, diverifikasi lewat diff piksel), animasi dipercepat ke 6s dengan rentang lebih lebar, dan tab icon ditambahkan lewat konvensi app-directory Next.js.

## Konteks

- **Requirement:** mark di hero harus tajam di layar retina; animasi breathe harus benar-benar terbaca; tab browser harus punya ikon.
- **Acceptance Criteria:** variant yang dilayani image optimiser ≥ 960px; `rel="icon"` + `rel="apple-touch-icon"` ada di head dan file-nya memang dilayani; `npm run build`, `npm run lint`, `npm run smoke` hijau.

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `public/bentomux.png` | UPDATE | Export ulang 1024×1035 (dari 504×495); artwork sama, di-crop ke framing lama supaya geometri hero tidak berubah |
| `src/app/icon.png` | NEW | 512×512, plat ikon aplikasi (persegi, tidak di-crop) |
| `src/app/apple-icon.png` | NEW | 180×180 untuk Add-to-Home-Screen |
| `src/content/site.ts` | UPDATE | `logo.width/height` 504×495 → 1024×1035 + komentar alasan resolusi |
| `src/components/site/SkipLink.tsx` | UPDATE | `sizes` pada `<Image>` mark: tanpa itu Next menawarkan variant 1024/2048 untuk logo 24px |
| `src/components/sections/Hero.tsx` | UPDATE | Opacity statis 0.18 → 0.22, komentar resolusi + knob presence |
| `src/app/globals.css` | UPDATE | `hero-mark-breathe`: durasi 45× → 30× `--duration-base` (9s → 6s), opacity 0.14→0.22 jadi 0.15→0.27, scale 1.015 → 1.02 |
| `scripts/smoke.mjs` | UPDATE | Tiga check baru: kedua `rel` ikon ada, `/icon.png` dilayani sebagai gambar, dan variant mark ≥ 960px (baca header PNG langsung, tanpa dependency baru) |
| `docs/srs.md` | UPDATE | v1.4 — `FR-001.8` + acceptance criterion mencakup favicon dan Apple touch icon |
| `docs/design_system.md` | UPDATE | v1.4 — §10.2 (dimensi 1024×1035, dua file ikon), `MOT-004` (indikator waitlist yang sudah mati diganti breath watermark 6s), `IMG-002` (koreksi: halaman memang memuat dua raster) |

## Detail Teknis

- **Sumber artwork:** 1024×1024 diekstrak dari `../Bentomux-v2/src-tauri/icons/icon.icns` via `sips`, lalu di-`trim` + resize dengan `sharp` (sudah ada sebagai dependency Next). Verifikasi artwork identik: diff rata-rata 3.86/255 setelah trim + normalisasi 128×128, rasio crop 0.994 vs 0.990 — jadi tidak ada aset desain baru yang perlu di-review.
- **Kenapa sumber lama blur:** hero merender mark sampai 480 CSS px (`xl`), jadi butuh 960px untuk 2×. Next.js tidak meng-upscale melebihi file sumber, sehingga yang dilayani tetap 504px dan browser yang memperbesar → soft. Sekarang optimiser mengembalikan 1024px.
- **Animasi:** hanya `opacity` dan `transform` yang bergerak, jadi `MOT-001` tetap terjaga; elemen yang dianimasikan tetap mark-nya, bukan wrapper, supaya `mix-blend-screen` tidak terisolasi dan plat hitam tidak muncul sebagai kotak.
- **Favicon:** memakai konvensi file app-directory Next.js (`src/app/icon.png`, `src/app/apple-icon.png`) — tidak ada tag ikon yang ditulis tangan dan tidak ada dependency baru. `favicon.ico` tidak ditambahkan karena semua browser modern menerima PNG.
- **DB Changes:** Tidak ada.
- **API Changes:** Tidak ada.
- **Dependencies:** Tidak ada.

## Testing

- **Test Results:** `npm run lint` PASS, `npm run build` PASS, `npm run smoke` PASS — semua check termasuk tiga check baru.
- **Bukti resolusi:** request `/_next/image?url=%2Fbentomux.png&w=1080` mengembalikan PNG 1024×1035 (sebelumnya 504×495) → 2.1× pada track 480px.
- **Bukti ikon:** head produksi berisi `<link rel="icon" href="/icon.png?…" sizes="512x512" type="image/png">` dan `<link rel="apple-touch-icon" href="/apple-icon.png?…" sizes="180x180">`; `/icon.png` merespons `image/…`.
- **Edge Cases:** `sizes="24px"` pada logo header/footer memastikan srcset-nya 32–128px, bukan 1024px, jadi penambahan resolusi tidak membengkakkan payload bilah navigasi.
- **Manual Test:** buka tab browser (ikon muncul di light dan dark chrome), cek mark hero di layar retina, dan rasakan loop breathe ±6 detik.

## Deployment

- **Migration:** Tidak ada.
- **Environment Variables:** `NEXT_PUBLIC_SITE_URL` tetap wajib untuk build produksi.
- **Config Changes:** Tidak ada. CDN/browser cache untuk `/bentomux.png` sebaiknya di-purge karena nama file sama dengan isi berbeda.

## Catatan

- **Keputusan:** (a) sumber mark di-crop ke framing lama (bukan plat persegi penuh) supaya komposisi hero tidak bergeser tanpa review desain, sementara favicon memakai plat persegi apa adanya karena itulah bentuk ikon aplikasi; (b) rentang breathe dilebarkan alih-alih hanya dipercepat — masalah aslinya bukan cuma tempo, tapi delta yang terlalu tipis di atas kanvas gelap lewat `mix-blend-screen`; (c) `MOT-004` diperbaiki karena komentar di kode mengklaim breath ini "documented exception" padahal belum tercatat di design system.
- **Limitasi:** kalau pengguna macOS menyalakan *Reduce Motion* di System Settings, animasi ini memang dimatikan total oleh `MOT-003` dan mark jatuh ke opacity statis 0.22 — keluhan "tidak terlihat animasinya" juga bisa berasal dari sini, bukan dari tempo.
- **Limitasi:** `docs/test_cases.md` belum punya case untuk favicon; check smoke baru dilabeli `§10.2` mengikuti preseden check lain yang tanpa TC id, jadi belum masuk indeks test case.
