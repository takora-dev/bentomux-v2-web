# Penghapusan Kredit Upstream (Klaim Provenance Ditarik)

**Branch:** `footer-restructure` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Situs mengklaim bahwa Bentomux mem-port logika deteksi agen dari proyek lain, mencantumkan proyek itu sebagai kredit upstream, dan menambahkan pernyataan non-affiliation. Klaim itu ditarik, sehingga kedua kalimat beserta tautan upstream dihapus dari `SEC-010` dan dari `/privacy`. Istilah yang dilarang: nama proyek upstream, `Apache-2.0`, kata "upstream" di copy yang dirender. Yang tersisa di blok legal: kalimat lisensi MIT, trademark disclaimer, dan pernyataan telemetri.

## Konteks

- **Requirement:** `FR-009.2`, `BR-009.3`, `BR-009.4`, `FR-009.8` (kini tidak dapat dipenuhi situs), `IA SEC-010`, `IA XPG-001`, `NFR-004.2`
- **Acceptance Criteria:** `/` dan `/privacy` tidak memuat nama proyek upstream maupun `Apache-2.0`; kalimat lisensi MIT dan trademark disclaimer tetap identik antar halaman; `npm run smoke` hijau

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `src/content/site.ts` | UPDATE | Field `upstreamUrl`, `attributionStatement`, `nonAffiliationStatement` dihapus dari `SiteConfig` |
| `src/content/chrome.ts` | UPDATE | `footerLegal.nonAffiliation` dan `footerLegal.upstreamLabel` dihapus |
| `src/components/site/SiteFooter.tsx` | UPDATE | Paragraf attribution + non-affiliation dan tautan upstream dihapus; blok legal jadi satu kolom `max-w-[70ch]`; `legalLinkClass` (tak lagi terpakai) dihapus |
| `src/app/privacy/page.tsx` | UPDATE | Dua paragraf yang sama dihapus; komentar parity disesuaikan |
| `scripts/smoke.mjs` | UPDATE | `UPSTREAM_URL` dihapus; pemeriksaan lisensi tidak lagi bergantung pada nama upstream; dua assertion negatif baru (`!/herdr/i` pada `/` dan `/privacy`); label `XPG-001` disesuaikan |
| `docs/design_system.md` | UPDATE | §9.14: blok legal satu kolom + catatan revisi bertanggal |
| `docs/information_architecture.md` | UPDATE | Rationale densitas, baris `SEC-010`, grup Project, fact ownership, copy budget, cross-page parity, `XPG-001` |
| `docs/data_model.md` | UPDATE | Baris `attributionStatement` dihapus dari `ENT-001`, class diagram, aturan absolute-URL, dan blok `ENT-006` |
| `docs/system_logics/sys_uc_005.md`, `sys_uc_008.md` | UPDATE | Baris attribution pada tabel slot, data mapping, dan error handling ditandai withdrawn |
| `docs/user_flows/userflow_uc_001.md`, `uc_005.md`, `uc_008.md` | UPDATE | Kalimat footer, tabel jawaban pensiun, main flow (8 langkah → 7), Exc-1/Exc-5, postconditions, data used, AC, traceability |
| `docs/test_cases.md`, `docs/test_execution_sheet.md` | UPDATE | `TC-F009-005`/`TC-F009-006` dipensiunkan dan digantikan `TC-F009-007` (assertion negatif); checklist `NOTICE` ditandai withdrawn; revisi 1.3 |

## Detail Teknis

- **Arsitektur:** Kredit upstream dihapus di sumbernya (content module), bukan disembunyikan di komponen. Field `SiteConfig` ikut dihapus supaya tidak ada jalur untuk merender kalimat itu lagi — penghapusan tipe, bukan penghapusan tampilan.
- **Anti-regresi:** Dua assertion negatif di `scripts/smoke.mjs` (`!/herdr/i` pada HTML `/` dan `/privacy`) membuat pengembalian klaim secara diam-diam langsung gagal. Assertion itu memeriksa nama proyek upstream; larangan `Apache-2.0` sebagai lisensi proyek sudah ditangani guard `BUILD_LICENCE_ID` yang ada sejak sebelumnya.
- **Token:** tidak ada token baru, tidak ada warna baru (`TOK-002` tetap).
- **DB Changes:** Tidak ada
- **API Changes:** Tidak ada
- **Dependencies:** Tidak ada

## Testing

- **Test Results:** `npx next build` + `npm run smoke` — all checks passed; `npx tsc --noEmit` dan `eslint src scripts` bersih.
- **Edge Cases:** `/not-found` dan `/privacy` memakai `showProductAnchors={false}` dan tidak pernah merender kredit upstream; `contactEmail` kosong tetap menyisakan tautan Privacy saja.
- **Manual Test:** `npm run dev` → buka `/` dan `/privacy`, cari "herdr" dan "Apache" di halaman (harus nol hasil), cek blok legal menumpuk rapi di 320px, dan pastikan `mailto:` tetap muncul bila `NEXT_PUBLIC_CONTACT_EMAIL` diset.

## Deployment

- **Migration:** Tidak ada
- **Environment Variables:** Tidak ada yang baru. `NEXT_PUBLIC_SITE_URL` tetap wajib untuk build produksi (`NFR-004.2`).
- **Config Changes:** Tidak ada

## Catatan

- **Sengaja ditinggalkan:** `docs/srs.md` masih memuat rantai provenance (`CON-007`, `CON-010`, `FR-009.2`, `FR-009.8`, `BR-001.7`, `BR-009.3`, `BR-009.4`, `LP-002`) dan `DESIGN.md` masih menyebut sumber komposisi visualnya. Scope pekerjaan ini adalah situs + dokumen yang menegaskan kredit footer, sesuai keputusan pengguna; `docs/design_system.md §1` dan `docs/user_flows/userflow_uc_001.md` (baris `BR-001.7`, `CON-010`) juga masih merujuk provenance yang sama. Akibatnya `srs.md` kini memuat requirement yang tidak lagi dipenuhi situs — perlu revisi SRS terpisah bila klaim itu memang mau dihapus seluruhnya.
- `docs/prompts.txt` masih memuat instruksi lama soal kredit upstream; sengaja tidak diubah karena berkas itu catatan prompt historis.
- `docs/information_architecture.md §4.2` masih menyebut grup footer Legal/Contact, sementara komponen merender Product/Project/Support. Ketidaksesuaian itu sudah ada sebelumnya dan tetap di luar scope.
