# Short link installer per OS (`/install.sh`, `/install.ps1`, `/install.cmd`)

**Branch:** `master`
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Perintah instal di halaman masih menamai URL `raw.githubusercontent.com` sepanjang 88 karakter, sehingga satu-liner-nya sulit diketik atau dibagikan. Situs sekarang menjawab tiga short link di origin-nya sendiri — `/install.sh`, `/install.ps1`, `/install.cmd` — dengan `307` ke ketiga skrip di `../Bentomux-v2/installers/*`, dan keenam perintah di `F005` memakai short link tersebut. Redirect, bukan salinan: tidak ada byte skrip yang disimpan di situs, jadi tidak ada kopi kedua yang bisa drift.

## Konteks

- **Requirement:** `BR-005.1`, `BR-005.2`, `BR-005.9`, `CON-014`, `FR-005.1`–`FR-005.14`, `DS CMD-002`
- **Acceptance Criteria:** keenam perintah instal tetap byte-identik dengan sumbernya di repo aplikasi; perintah Windows dan Linux ikut terpendek; base URL diturunkan dari `NEXT_PUBLIC_SITE_URL`; `npm run build && npm run smoke` hijau; tidak ada host di luar yang diizinkan

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `next.config.ts` | UPDATE | `redirects()` dengan tabel `installerShortLinks`: `/install.sh` → `install.sh`, `/install.ps1` → `install.ps1`, `/install.cmd` → `install.cmd`, semuanya `permanent: false` (307) |
| `src/content/install.ts` | UPDATE | `RAW` dihapus, base URL jadi `site.siteUrl` (`/install.sh`, `/install.ps1`, `/install.cmd`); invariant host `BR-005.2` ditambahkan |
| `scripts/smoke.mjs` | UPDATE | `TC-F005-004` dan `TC-F005-009` menguji bentuk perintah, path short link, dan tidak ada `raw.githubusercontent.com` |
| `.env.example` | UPDATE | `NEXT_PUBLIC_SITE_URL` dikoreksi ke host yang benar-benar resolve (`bentomux.netlify.app`) |
| `../Bentomux-v2/README.md` | UPDATE | Install block menerbitkan bentuk short link — inilah string sumber yang disalin halaman (`BR-005.1`) |
| `docs/srs.md` | UPDATE | `BR-005.1` dan `BR-005.2` diamandemen; `CON-014` dan tabel interface §5.2 disesuaikan; revision history `v1.5` |
| `docs/data_model.md` | UPDATE | Aturan modul dan tabel enforcement untuk `InstallCommand.command` |
| `docs/test_cases.md` | UPDATE | Expected result `TC-F005-004` dan `TC-F005-005` |
| `docs/test_execution_sheet.md` | UPDATE | Langkah dan expected result `TC-F005-004`/`TC-F005-005` |
| `docs/test_plan.md`, `docs/information_architecture.md`, `docs/design_system.md` | UPDATE | Rujukan "verbatim dari `installers/*`" diselaraskan dengan bentuk short link (`DS CMD-002`) |

## Detail Teknis

- **Arsitektur:** redirect di `next.config.ts` (bukan `netlify.toml`) — host-agnostic, tanpa file baru di root, dan bisa diuji dengan `npm start`. `netlify.toml` akan menimpa setelan build Netlify kalau `[build]` ditambahkan nanti, dan tidak bisa dites lokal tanpa `netlify dev`.
- **DB Changes:** Tidak ada
- **API Changes:** Tiga route redirect: `/install.sh` (macOS + Linux, skrip sama), `/install.ps1`, `/install.cmd`. Semua 307 — bukan 308, karena redirect permanen di-cache keras oleh curl dan proxy sehingga perpindahan skrip tidak bisa diperbaiki lagi untuk klien tersebut.
- **Dependencies:** Tidak ada

## Testing

- **Test Results:** `npm run build` PASS; `npm run smoke` PASS (semua check). Keenam perintah terverifikasi dari HTML hasil build: `curl -fsSL <host>/install.sh | sh`, `... | sh -s -- --deb`, `... | BENTOMUX_MANIFEST_URL=<manifest> sh`, `powershell ... irm <host>/install.ps1 | iex`, `curl.exe -fsSLo install.cmd <host>/install.cmd && install.cmd && del install.cmd`. `raw.githubusercontent.com` muncul **0 kali** di halaman. Tiap short link diuji end-to-end: `307` + isi skrip yang benar (`#!/bin/sh` 10840 byte, `install.ps1` 7596 byte, `install.cmd` 1272 byte), `sh -n` OK, path tak dikenal tetap `404`.
- **Edge Cases:** guard `BR-005.2` diuji negatif — modul hasil compile disisipi host terlarang lalu di-`require`, guard terpicu (`installCommands.macos-install.command names an unpermitted host`). Path statis Next lain (`/nope`) tetap 404, jadi tidak ada catch-all yang menutupi salah tulis path.
- **Manual Test:** setelah deploy, `curl -sI https://bentomux.netlify.app/install.sh` harus `307` + `location: raw.githubusercontent.com/...`; `curl -fsSL https://bentomux.netlify.app/install.sh | head -1` harus `#!/bin/sh`, bukan `<!DOCTYPE html`. Site password/Identity harus tetap mati untuk ketiga short link agar tidak pernah mengembalikan halaman login.

## Deployment

- **Migration:** Tidak ada
- **Environment Variables:** `NEXT_PUBLIC_SITE_URL` di Netlify harus sama dengan host di install block `../Bentomux-v2/README.md` (`https://bentomux.netlify.app`). Nilai lain membuat perintah yang disalin menunjuk host yang tidak resolve.
- **Config Changes:** Tidak ada

## Catatan

- **Host kanonik ditetapkan dari bukti, bukan asumsi.** `https://bentomux.netlify.app` merespons `200`; `https://bentomux.farrasjibran.dev` tidak resolve sama sekali. HTML produksi membawa `rel="canonical"`, `og:url`, dan `og:image` bernilai `bentomux.netlify.app` tanpa satu pun penyebutan `farrasjibran`, jadi build produksi memang memakai host itu. `.env.example` sebelumnya salah dan sudah dikoreksi. Baris tabel interface §5.2 yang menyebut **Vercel** sebagai hosting juga dikoreksi ke **Netlify** karena aturan baru ditulis terhadap deployment tersebut.
- **Dua requirement diamandemen, bukan dilanggar diam-diam.** `BR-005.1` (perintah harus byte-identik dengan sumber di repo aplikasi) sekarang membandingkan terhadap install block README repo aplikasi, yang menerbitkan bentuk short link. `BR-005.2` (hanya dua host GitHub) sekarang mengizinkan origin situs sendiri sebagai *redirector* — bukan mirror: tidak ada salinan installer di situs dan tidak ada permintaan skrip yang berakhir di sana. Karena basisnya `site.siteUrl`, nilai `NEXT_PUBLIC_SITE_URL` dan host di README repo aplikasi harus sepakat byte demi byte; ini trade-off yang disadari dari pilihan "base dari env".
- **Guard yang sebelumnya hanya klaim.** Dokumen menyebut build gagal dengan `BUILD_COMMAND_MISMATCH`/`BUILD_COMMAND_HOST`, tapi tidak ada kode yang melakukannya. Yang sekarang benar-benar ada: invariant host di `src/content/install.ts` (menggantikan klaim `BUILD_COMMAND_HOST`) dan assertion smoke untuk bentuk perintah. Perbandingan lintas repo `BUILD_COMMAND_MISMATCH` **tetap belum diimplementasikan** — `TC-F005-004` sekarang menyatakannya sebagai langkah review, bukan build check. Menambahkannya berarti membaca `../Bentomux-v2/README.md` saat build, yang belum dilakukan.
- **Dua `[content]` ganda diperbaiki.** `invariant()` sudah memberi prefix `[content] `, sementara dua pemanggil di `src/content/install.ts` menambahkannya lagi, sehingga pesan error tercetak `[content] [content] ...`.
- **`sourcePath` sengaja tidak diubah.** Field itu tetap menunjuk `installers/install.sh`, `installers/install.ps1`, `installers/install.cmd`: short link hanya perantara, dan skrip yang benar-benar dieksekusi tetap file-file itu.
- **Path short link mengikuti nama file, bukan singkatan.** Draft pertama memakai `/i`, `/i.ps1`, `/i.cmd`; atas permintaan pemilik proyek path-nya diubah menjadi `/install.sh`, `/install.ps1`, `/install.cmd`. Alasannya path sekarang sama persis dengan nama file yang dilayani, jadi tabel redirect tidak butuh legenda dan `/install` tanpa ekstensi tidak menimbulkan pertanyaan "script mana?". Biayanya 6–9 karakter per perintah. `/i*` tidak lagi dirutekan: belum pernah ada build yang memakai path itu.
- **Belum di-commit.** Perubahan di repo ini dan `../Bentomux-v2/README.md` masih unstaged.
