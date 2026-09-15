# Hapus Waitlist + Band Figure Jadi Capture Asli

**Branch:** `remove-waitlist-screenshot-band` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Beta Bentomux sudah rilis (v0.2.0–v0.2.10 di GitHub Releases), jadi waitlist dihapus menyeluruh: band, aksi di navigasi/hero, route `/api/waitlist`, modul konten, dan block privasi yang hanya ada untuk form. Band figure dikembalikan dari mock window yang digambar menjadi capture asli `public/screenshot.png`. Copy pasca-rilis di hero dan intro install diselaraskan. Dokumen SoT (`docs/*`) sengaja tidak disentuh pada pass ini — akan drift sampai pass penyelarasan berikutnya.

## Konteks

- **Requirement:** (a) buang "Join waitlist" sepenuhnya karena beta sudah keluar; (b) ganti heading band figure yang semula mock menjadi screenshot; (c) perbarui copy yang masih menyebut pre-release.
- **Acceptance Criteria:** tidak ada sisa referensi waitlist di kode/smoke; band figure memakai `screenshot.png` dengan dimensi eksplisit + alt deskriptif; `npm run build`, `npm run lint`, `npm run smoke` hijau.

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `src/content/screenshot.ts` | NEW | Copy band figure: `bandHeading`, `bandHint`, `alt`, `caption` + `requireNonEmpty` |
| `src/components/sections/ScreenshotFigure.tsx` | NEW | `next/image`, `width={2982} height={1974}`, bingkai `rounded-xl`, crop `object-left-top` di bawah `md` |
| `src/app/api/waitlist/route.ts` | DELETE | Route endpoint waitlist (dir `src/app/api` ikut terhapus) |
| `src/content/waitlist.ts` | DELETE | String form + endpoint |
| `src/components/sections/WaitlistSection.tsx` | DELETE | Band waitlist |
| `src/components/ui/WaitlistLink.tsx` | DELETE | Link aksi waitlist |
| `src/components/sections/MockFigure.tsx` | DELETE | Band figure versi mock |
| `src/components/sections/TerminalMock.tsx` | DELETE | Client component mock interaktif |
| `src/content/mock.ts` | DELETE | ENT-014 AppMock |
| `src/app/page.tsx` | UPDATE | Lima band (hero, stat strip, screenshot, capabilities, install) |
| `src/content/sections.ts` | UPDATE | `SectionId` buang `"waitlist"`; `requireCount` 3 → 2; anchor buang `waitlist`; `privacyBlocks` 8 → 4 block; `privacyLastUpdated` → 2026-09-15; intro install tidak lagi menyebut "no build published yet" |
| `src/content/nav.ts` | UPDATE | `navPrimary` jadi aksi eksternal "Download" → `site.releasesLatestUrl` |
| `src/content/site.ts` | UPDATE | `hero.badge` → "Bentomux — beta out now"; `hero.waitlistHook` dihapus |
| `src/components/sections/Hero.tsx` | UPDATE | Ribbon jadi tautan eksternal ke releases (`target`/`rel` + `sr-only`); link waitlist hero dihapus |
| `src/components/site/SiteHeader.tsx` | UPDATE | Aksi utama dirender sebagai tautan eksternal releases |
| `src/app/not-found.tsx` | UPDATE | Tombol `navPrimary` ikut jadi tautan eksternal (sebelumnya `Link href={"/" + href}` — akan rusak dengan URL absolut) |
| `src/app/robots.ts` | UPDATE | Disallow `/api/waitlist` dihapus |
| `src/app/globals.css` | UPDATE | Rule `.no-script-note` + blok `@media (scripting: enabled)` dihapus |
| `src/app/privacy/page.tsx` + `src/content/chrome.ts` | UPDATE | Intro/`contactLabel` tidak lagi menyebut "one form"; komentar jumlah block 8 → 4 |
| `src/app/opengraph-image.tsx` | UPDATE | Komentar "no raster in page content" dikoreksi — halaman kini memuat capture |
| `src/components/ui/icons.tsx` | UPDATE | Ekspor mati `CheckIcon`, `LoaderIcon` (form waitlist) dan `BugIcon`, `ChatIcon`, `ExternalIcon`, `MailIcon` (band yang sudah dihapus) dibuang — tinggal 5 ikon yang dipakai |
| `src/components/ui/primitives.tsx` | UPDATE | `AppFrame` (permukaan app-mock), `ExternalLink`, dan `BulletList` dihapus karena tidak ada lagi pemakainya; `Overline` jadi helper internal `SectionHeader` |
| `.env.example` | UPDATE | `RESEND_API_KEY` / `RESEND_TOPIC_ID` dihapus |
| `scripts/smoke.mjs` | UPDATE | Seluruh case endpoint/form waitlist dihapus; case baru untuk capture |

## Detail Teknis

- **Arsitektur:** konten tetap di `src/content/*`; komponen hanya merender. Band figure tetap satu komponen yang mengambil string dari `screenshot.ts`, jadi heading/alt/caption punya satu sumber.
- **Privasi:** `privacyBlocks` tinggal empat (scope, what is collected, what is not collected, changes) — block purpose/processor/retention/rights hanya ada karena form email dan ikut terhapus. `privacyLastUpdated` naik ke 2026-09-15 karena isi kebijakan berubah.
- **Gambar:** capture 2982×1974 (rasio tetap, kualitas 75). Di bawah `md` dipotong dari sudut kiri-atas alih-alih diperkecil sampai tak terbaca (aturan v1.0 design system §10.3).
- **DB Changes:** Tidak ada.
- **API Changes:** `POST /api/waitlist` dihapus. Tidak ada endpoint baru.
- **Dependencies:** Tidak ada penambahan/penghapusan paket.

## Testing

- **Test Results:** `npm run build` PASS (7 route statis: `/`, `/_not-found`, `/opengraph-image`, `/privacy`, `/robots.txt`, `/sitemap.xml`), `npm run lint` PASS (0 error/warning), `npm run smoke` PASS — 50 check, 0 failure.
- **Perubahan case smoke:** dihapus — seluruh `TC-F004-*` (validasi email, consent, origin, honeypot, rate limit), `TC-F004-013` (fixture handler), `TC-F009-002` (Resend + retention), `NFR-002.1` (bocor `RESEND_API_KEY`, tak ada subjeknya lagi). Diubah — `TC-F001-001` tiga band ber-anchor + `waitlist` masuk daftar band retired; `privacy` 4 block; `SPC-001` enam → lima `<section>`; `§10.4` `mock-heading` → `screenshot-heading`; `sys_uc_001 step 2` badge pre-release → beta; robots kini "Allow semua, tanpa Disallow". Baru — `FIG-001` (srcset `url=%2Fscreenshot.png`, `width="2982" height="1974"`, alt deskriptif) dan `IMG-003` (mock window tidak boleh muncul lagi).
- **Edge Cases:** `next/image` menulis `src` sebagai `/_next/image?url=%2Fscreenshot.png…`, jadi assertion `FIG-001` mengecek srcset/atribut, bukan `src` literal; halaman 404 ikut dicek karena memakai `navPrimary` yang kini URL absolut.
- **Manual Test:** cek crop capture di viewport < 768px (bagian bawah gambar terpotong, bukan diperkecil); cek tombol "Download" di header dan hero membuka tab baru; cek `/privacy` tidak lagi menyebut email form.

## Deployment

- **Migration:** Tidak ada.
- **Environment Variables:** `RESEND_API_KEY` dan `RESEND_TOPIC_ID` tidak lagi dipakai — boleh dihapus dari environment produksi. `NEXT_PUBLIC_SITE_URL` tetap wajib untuk build produksi.
- **Config Changes:** Tidak ada.

## Catatan

- **Keputusan:** (a) aksi utama navigasi memakai "Download" → GitHub releases `latest` alih-alih anchor in-page, karena beta sudah publik; (b) `screenshot.png` yang sempat disimpan sebagai aset yatim kini direferensikan kembali, jadi design system §10.3 kembali ke aturan v1.0 (dimensi eksplisit, alt deskriptif, crop di bawah `md`); (c) devlog ini dibuat karena SOP, tetapi `docs/*` (SRS, IA, data model, design system, test cases) tidak diperbarui pada pass ini.
- **Limitasi:** dokumen SoT kini menyimpang dari kode — `docs/*` masih menyebut band waitlist, ENT-014 AppMock, `FR-004.*`, `TC-F004-*`, dan `privacyBlocks` delapan block. Perlu satu pass penyelarasan dokumentasi sebelum release berikutnya.
