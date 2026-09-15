# Refactor Landing Page: Paritas Struktur Dengan herdr.dev

**Branch:** `refactor/landing-herdr-parity` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-14
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Landing page dirombak total dari sepuluh section menjadi enam band mengikuti struktur herdr.dev: hero berisi perintah install, strip angka, window aplikasi yang bisa diklik, lima baris capability bernomor, waitlist, lalu install. Section `#features`, `#palettes`, `#faq`, `#community`, dan `#agents` dihapus bersama modul konten dan CSS-nya. Spesifikasi (`docs/*`) dan `scripts/smoke.mjs` diselaraskan pada pass yang sama supaya build dan smoke tetap hijau.

## Konteks

- **Requirement:** Tampilan landing dianggap "terlalu banyak item" dan jauh dari referensi herdr.dev. Hasil yang diminta: struktur, urutan band, dan kerapatan visual seperti herdr.dev — bukan meniru copy atau skema warnanya.
- **Acceptance Criteria:**
  - Enam band, urutan: hero → strip angka → mock window → capability rows → waitlist → install.
  - Hero memuat perintah install asli + tombol copy; tanpa gambar screenshot.
  - Mock window bisa diklik (workspace, tab, agent) dan berhenti beranimasi saat `prefers-reduced-motion`.
  - Angka di strip jujur: hanya yang bisa dipertanggungjawabkan; angka bintang GitHub dibaca saat render dan item-nya dihilangkan bila gagal dibaca, bukan diarang.
  - `npm run build`, `npm run lint`, `npm run smoke` hijau.
  - Dokumen SoT (IA, design system, data model, SRS, test cases, user flows, system logics) tidak lagi menyebut band yang sudah dihapus.

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `src/app/page.tsx` | UPDATE | Enam band async; ambil `fetchStarCount()` di server |
| `src/app/globals.css` | UPDATE | Hapus seluruh rule `faq-*` dan `.palette-*` (312 → 251 baris) |
| `src/content/sections.ts` | UPDATE | `SectionId` jadi 4 id; `sections` tinggal 3 entri (capabilities, waitlist, install); anchor: hero, capabilities, waitlist, install, footer (`top` dihapus — tidak ada elemen yang memakainya) |
| `src/content/nav.ts` | UPDATE | Dua anchor (Capabilities, Install) + GitHub eksternal + aksi waitlist |
| `src/content/site.ts` | UPDATE | Copy hero baru: ribbon, eyebrow, `headlineEmphasis`, `quickStartCommandId`, meta line, waitlist hook; entri `screenshot` dihapus |
| `src/content/stats.ts` | NEW | ENT-015 `StatFact` + `fetchStarCount()` (revalidate 3600, gagal → `null`) + `statStripCopy` |
| `src/content/caps.ts` | NEW | ENT-013 lima baris capability + union lima jenis panel bukti; invariant angka 21/9 |
| `src/content/mock.ts` | NEW | ENT-014 AppMock: 3 workspace, tab, label band |
| `src/content/mock.ts` | UPDATE | (lanjutan) rel sidebar "agents" dihapus: `MockAgentRow` + `mockAgentRows` + `agentsHeading` dibuang, caption jadi "Three workspaces, one of them waiting on your approval"; aplikasi tidak punya panel agent |
| `src/content/agents.ts` | UPDATE | (lanjutan) ekspor mati `agentGroups`/`agentsEvidence` dihapus; id entitas dikoreksi ENT-002 → ENT-003 |
| `src/components/sections/Hero.tsx` | UPDATE | Ribbon, eyebrow, h1 dengan frasa beraksen, lede, command block, meta line, hook waitlist |
| `src/components/sections/StatStrip.tsx` | NEW | Grid 4 fakta dengan hairline; item bintang opsional |
| `src/components/sections/MockFigure.tsx` | NEW | Band figure: label, mock, caption |
| `src/components/sections/TerminalMock.tsx` | NEW | Client component: seleksi workspace/tab, spinner braille, timer, hormati reduced motion |
| `src/components/sections/TerminalMock.tsx` | UPDATE | (lanjutan) rel panel agent dihapus dari sidebar + `STATE_LABEL` yang jadi tak terpakai |
| `src/components/sections/CapsSection.tsx` | NEW | Lima baris bernomor + panel bukti (tabs/states/approval/runtimes/machines) |
| `src/components/sections/WaitlistSection.tsx` | UPDATE | Presentasi jadi band berbingkai; kontrak form tidak berubah |
| `src/components/install/CommandBlock.tsx` | NEW | Command + tombol copy + catatan, dibagi hero dan install |
| `src/components/sections/{Agents,Features,Palettes,Faq,Community}Section.tsx` | DELETE | Band yang dihapus |
| `src/content/{features,palettes,faq,community}.ts` | DELETE | Modul konten yang dihapus (`agents.ts` dipertahankan) |
| `scripts/smoke.mjs` | UPDATE | Case disesuaikan + case baru (lihat Testing) |
| `docs/*` + `docs/user_flows/*` + `docs/system_logics/*` | UPDATE | Pass penyelarasan spesifikasi (IA, design system, data model, SRS, test cases, test plan, execution sheet, user flow) |

## Detail Teknis

- **Arsitektur:** konten tetap di `src/content/*` sebagai ENT, komponen hanya merender. Hero tidak menyalin perintah install: ia mencari ENT-005 lewat `quickStartCommandId` dan melempar error saat build bila id tidak ada — satu sumber untuk perintah.
- **Invariant build-time:** `caps.ts` menegaskan badan baris 04 memuat angka 21 hasil derivasi ENT-003 (AgentRuntime); `sections.ts` menegaskan jumlah copy; `mock.ts` menegaskan nama agen ada di `agents.ts` (nama tidak boleh ditulis dua kali).
- **Penyelarasan dokumen (v1.2, 2026-09-14):** tiga penulis dokumen menyelesaikan pass ini. IA + design system (`SEC-011`/`SEC-012`/`SEC-013`, `FIG-001`, `MOCK-001..005`, `STAT-001..003`, `CAP-001..003`, §9.6–§9.8); data model + SRS + system logics (`ENT-013/014/015` baru, `ENT-002/003-row` diperbaiki, `FR-002.1–.11`, `BR-002.1–.6`, UC-005/UC-007 berstatus Retired); test cases + execution sheet + user flows (74 baris kasus, 59 hidup, 15 dihapus; `userflow_uc_005/007` Retired, `uc_001/004/006` Revised).
- **Penyelarasan dokumen, pass kedua (v1.2, 2026-09-14, lanjutan):** dua penulis menyusul koreksi panel agent di mock. Lane A — `data_model.md` (`MockAgentRow` ditandai Removed, relasi dicoret, bentuk ENT-014 tinggal tiga, invariant baris-agen dibuang), `information_architecture.md` (§3.1/§7 SEC-012/§10), `design_system.md` (§9.7 label panel jadi satu, "Agent row" ditandai Removed; `MOCK-001..005` tidak diubah karena `MOCK-002` memang aturan spinner), `srs.md` (`FR-002.2`/`.3`/`.11`, baris entitas §7, `NFR-006.6`). Lane B — `userflow_uc_001/004.md`, `sys_uc_001.md`, `test_cases.md` (`TC-F001-007` caption persis, `TC-F001-008` 8 → 5 tombol, `TC-F001-009` diperluas jadi "sidebar hanya workspace, tanpa panel agent", `TC-F003-004` tidak lagi menyertakan mock), `test_execution_sheet.md` (baris diregenerasi dari kasus: 0 baris menyimpang, 59 kasus). Tidak ada baris revisi baru: setiap file tetap satu baris `| 1.2 | 2026-09-14 |` yang teksnya diperpanjang dengan klausa amandemen. Di luar lane: kutipan `NFR-006.6` di `userflow_uc_001.md` disamakan dengan istilah baru SRS ("agent roster"). `sys_uc_004.md` dan panel bukti baris 02 (`kind: "states"`) tidak berubah — keduanya bukan mock.
- **Sisa yang dibersihkan manual di luar lane penulis:** dua baris `FaqItem`/`src/content/faq.ts` di `userflow_uc_002/008.md`; anchor `#top` yang hantu (dihapus dari `anchors` di `sections.ts`, dari IA §2/§3.1/§4.5, dan dari `URL-002` — skip link tetap `#main`); id `ENT-002` → `ENT-003` di komentar `agents.ts`/`caps.ts` dan label smoke; ekspor mati `agentGroups` + `agentsEvidence` (sisa band agen yang dihapus) dibuang; komentar "empat band" → "enam band" di `sections.ts`/`nav.ts`; `.env.example` kini mencantumkan `NEXT_PUBLIC_CONTACT_EMAIL` (opsional, `ENT-001.contactEmail` nullable).
- **DB Changes:** Tidak ada.
- **API Changes:** Tidak ada (route `/api/waitlist` tidak disentuh). Satu panggilan keluar baru: `GET api.github.com/repos/takora-dev/bentomux-v2` saat render halaman.
- **Rendering:** `/` tetap statis dengan `revalidate: 3600` (berasal dari opsi `next` pada fetch bintang). Kegagalan pembacaan tidak menggagalkan build: item bintang hilang, strip tinggal tiga fakta.
- **Dependencies:** Tidak ada penambahan/penghapusan paket.

## Testing

- **Test Results:** `npm run build` PASS (8 halaman, `/` statis + ISR 1 jam), `npm run lint` PASS (0 error, 0 warning), `npm run smoke` PASS (semua check, 0 failure).
- **Perubahan case smoke:** `TC-F001-001` → empat band ber-anchor berurutan + "band yang dihapus tidak ada"; baru: lima baris capability + bukti, band figure, mock (tepat 5 tombol `aria-pressed`: 3 workspace + 2 tab; sebelumnya ≥ 8 karena tiga baris agen), angka turunan, dan pemeriksaan CSS mati (tidak ada `faq`/`palette` di stylesheet). `TC-F006-003` (delapan jawaban FAQ) dan `PAL-001` (delapan nama palette) dihapus. `TC-F007-002` diperketat: melarang angka issue/fork/kontributor/install/download/user, dan mengizinkan "stars" hanya bila berlabel "GitHub stars".
- **Edge Cases:** fetch GitHub gagal/rate limit → strip tiga fakta (dites dengan memastikan kode mengembalikan `null`, bukan 0); reduced motion → spinner dan timer tidak jalan; `quickStartCommandId` salah → build gagal.
- **Manual Test:** Klik workspace/tab di mock; cek fokus keyboard pada tombol sidebar; cek tampilan < 768px (sidebar mock menumpuk di atas pane); cek `#capabilities` dan `#install` tidak tertutup sticky bar saat di-scroll.

## Deployment

- **Migration:** Tidak ada.
- **Environment Variables:** Tidak ada yang baru. Build produksi tetap butuh `NEXT_PUBLIC_SITE_URL`.
- **Config Changes:** Tidak ada.

## Catatan

- **Keputusan:** (a) aksen tetap biru Bentomux `#4c8ef9`, tanpa toggle ink/paper; (b) paritas dengan herdr.dev bersifat struktural (urutan band + kerapatan), bukan salinan copy/warna; (c) mock window dibangun dari markup, bukan PNG — bisa dibaca, tajam di semua DPI, dan tidak basi. `public/screenshot.png` kini tidak direferensikan kode; disimpan sebagai aset sumber (disebut `opengraph-image.tsx` sebagai satu-satunya citra produk yang boleh dipakai).
- **Limitasi:** mock hanya menampilkan tiga workspace contoh; nama agen di mock di-resolve dari `detectedAgents` di `agents.ts` saat build (bukan ditulis ulang), sehingga ikut berubah bila roster berubah.
- **Nilai state di mock** (`21`, `9`, `MIT`, `3 platforms`) semuanya turunan; jangan mengetik angka baru di copy band mana pun.
- **Utang dokumen:** pass penyelarasan spesifikasi selesai (lihat Detail Teknis). Tersisa satu hal yang tidak dikerjakan: `data_model.md` belum punya entitas untuk grup link footer di `src/content/chrome.ts` (`productLinks`/`projectLinks`/`supportLinks`) — `sys_uc_006.md` masih merujuk modulnya lewat path, bukan lewat id ENT.
