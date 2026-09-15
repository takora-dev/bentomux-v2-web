# Restrukturisasi Visual Footer (SEC-010)

**Branch:** `footer-restructure` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Footer (`SEC-010`) sebelumnya menumpuk delapan paragraf fine print dalam satu kolom penuh selebar 1200px dan logo berdiri sendiri jauh di kiri, sehingga blok legal terbaca sebagai satu dinding teks abu-abu tanpa hierarki. Layout dirapikan menjadi tiga tingkat — kolom tautan, blok legal, dan bottom bar — tanpa menambah token, warna, dependensi, atau copy baru.

> **Diperbarui 2026-09-15 (lanjutan):** kalimat attribution dan non-affiliation beserta tautan upstream dihapus dari blok legal; lihat `docs/devlogs/20260915-remove-upstream-credit.md`. Blok legal kini satu kolom berisi tiga kalimat.

## Konteks

- **Requirement:** `IA SEC-010`, `IA XPG-001`/`XPG-002`, `FR-009.1`–`FR-009.8`, `BR-009.1`–`BR-009.4`, `§9.14`
- **Acceptance Criteria:** seluruh kalimat legal tetap ada dan identik dengan `/privacy`; tidak ada token/palet baru; kontras AA terjaga; `npm run smoke` tetap hijau

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `src/components/site/SiteFooter.tsx` | UPDATE | Grid brand + 3 kolom tautan, blok legal dua kolom, bottom bar terpisah; kelas tautan bersama (`linkClass`, `legalLinkClass`, `barLinkClass`) |
| `docs/design_system.md` | UPDATE | §9.14 disesuaikan dengan struktur baru (layout, heading grup, blok legal, bottom bar) |
| `docs/devlogs/20260915-remove-upstream-credit.md` | NEW | Log penghapusan kredit upstream (lihat catatan lanjutan di atas) |

## Detail Teknis

- **Arsitektur:** Server component, tetap tanpa JavaScript. Seluruh string tetap dibaca dari `src/content/chrome.ts` dan `src/content/site.ts`, jadi `XPG-001` (anti-drift antar halaman) tidak berubah.
- **Layout:** `lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]`, `md:grid-cols-2`, satu kolom di bawah `md`. Blok legal `max-w-[70ch]` — kalimat lisensi load-bearing (`--color-text-muted`), fine print (`--color-text-subtle`). Bottom bar: copyright kiri, Privacy + `mailto:` kanan, menumpuk di bawah `sm`.
- **Token:** hanya `--text-overline`, `--text-caption`, `--text-body-sm`, `--duration-instant`, `--ease-out`, `--color-text*`, `--color-border`. `tracking-[0.08em]` (nilai literal, melanggar `TOK-002`) diganti `text-overline` yang membawa letter-spacing 0.08em dari token.
- **DB Changes:** Tidak ada
- **API Changes:** Tidak ada
- **Dependencies:** Tidak ada

## Testing

- **Test Results:** `npx next build` sukses; `npm run smoke` — all checks passed (48 check). `eslint` bersih.
- **Edge Cases:** route sekunder (`/privacy`, `/not-found`) memakai `showProductAnchors={false}` sehingga grid turun ke 3 kolom tautan tanpa sel kosong; `contactEmail` kosong menyisakan hanya tautan Privacy.
- **Manual Test:** cek lebar 320px (satu kolom, blok legal menumpuk), `md` (2 kolom), `lg` (4 kolom), dan tinggi target sentuh tautan di mobile (44px).

## Deployment

- **Migration:** Tidak ada
- **Environment Variables:** Tidak ada
- **Config Changes:** Tidak ada

## Catatan

- `docs/information_architecture.md §4.2` masih menyebut grup footer Legal/Contact, sementara komponen merender Product/Project/Support. Ketidaksesuaian itu sudah ada sebelum perubahan ini dan sengaja tidak diubah di sini (di luar scope).
- Copyright dipindah dari blok legal ke bottom bar agar baris terakhir footer menjadi baris penutup, bukan bagian dari dinding fine print. Urutan legal lainnya tidak berubah.
- Build produksi memerlukan `NEXT_PUBLIC_SITE_URL`; tanpa itu `next build` gagal di `src/content/site.ts` (`NFR-004.2`) — perilaku lama, bukan regresi.
