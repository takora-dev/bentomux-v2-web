# Hapus Baris Bukti Repo (`sourceFeature`) dari Capability Row

**Branch:** `remove-capability-source-feature` (direktori ini belum di-`git init`; nama branch dicatat untuk konvensi)
**Tanggal:** 2026-09-15
**Command:** `prompt`
**Tiket:** —

---

## Ringkasan

Baris bukti repositori di bawah setiap capability row dihapus — field `sourceFeature` beserta lima nilainya dibuang dari modul konten, render-nya dicabut, dan case smoke yang mengeceknya dibalik jadi assertion negatif. Doc SoT ikut diselaraskan penuh (`FR-002.4`, `FR-002.6`, `BR-002.1`, `BR-002.4`, `CAP-001`, `ENT-013`, `TC-F002-005`) karena field ini tidak sekadar satu baris render, tetapi requirement yang tertulis di SRS/design system/test case. Panel bukti (chips + note) dan kedua angka turunan tidak berubah.

## Konteks

- **Requirement:** pengunjung tidak perlu tahu path repositori di balik tiap klaim; halaman cukup menyatakan klaim dan panel buktinya.
- **Acceptance Criteria:** tidak ada path repositori yang tercetak di HTML; `npm run build`, `npm run lint`, `npm run smoke` hijau; dokumen SoT tidak lagi mensyaratkan field tersebut.

## Perubahan

| File | Status | Keterangan |
|------|--------|-----------|
| `src/content/caps.ts` | UPDATE | Field `sourceFeature` dihapus dari tipe `CapabilityRow` dan dari kelima entri; komentar header disesuaikan |
| `src/components/sections/CapsSection.tsx` | UPDATE | `<p>` path monospace + komentarnya dihapus dari baris row; komentar seksi disesuaikan |
| `scripts/smoke.mjs` | UPDATE | `TC-F002-002`/`FR-002.4` diganti assertion terbalik: HTML produksi tidak boleh memuat `src-tauri`/`src/tauri`/`resources/manifests` |
| `docs/srs.md` | UPDATE | v1.3 — glosarium, deskripsi F002, `FR-002.4`, `FR-002.6`, `BR-002.1` (dicabut klausul penamaan path), `BR-002.4`, dua acceptance criteria, baris data object |
| `docs/design_system.md` | UPDATE | v1.3 — §9.6 prosa + baris tabel "Evidence line" dihapus; `CAP-001` ditandai *retired 2026-09-15* (id tetap, tidak dipakai ulang) |
| `docs/data_model.md` | UPDATE | v1.3 — atribut `sourceFeature` di class diagram, baris tabel `ENT-013`, aturan capability row, baris validasi, catatan `ENT-002` (dua kewajiban per row, bukan tiga) |
| `docs/information_architecture.md` | UPDATE | v1.3 — daftar isi `SEC-013`, aturan kepemilikan per row, honesty constraint, tujuan "Open repository (via the evidence lines)" |
| `docs/system_logics/sys_uc_004.md` | UPDATE | Actor/tabel komponen/sequence/payload HTML/data mapping/traceability dibersihkan dari `sourceFeature` |
| `docs/test_cases.md` | UPDATE | v1.4 — `TC-F002-005` di-retire (tabel removed + index), `TC-F002-003` diarahkan langsung ke repositori aplikasi; 57 case (32 positive, 17 negative, 9 exception) |
| `docs/test_execution_sheet.md` | UPDATE | v1.3 — row `TC-F002-003` diganti isinya, `TC-F002-005` dicoret sebagai removed, F002 4 → 3, total 59 → 58 |
| `docs/test_plan.md` | UPDATE | v1.3 — paragraf *Content-accuracy approach* tidak lagi menyebut `CapabilityRow.sourceFeature` |
| `docs/user_flows/userflow_uc_001.md` | UPDATE | Main flow step 7, Alt-3, AC, traceability `FR-002.4`/`FR-002.6`/`BR-002.1`, Data Used table |
| `docs/user_flows/userflow_uc_004.md` | UPDATE | Main flow step 4–5 dan 7, Alt-2, Alt-4, Alt-5, postcondition, Data Used, AC, traceability |
| `docs/user_flows/userflow_uc_006.md` | UPDATE | Data Used (`AgentRuntime`) dan `FR-007.1` berhenti mengklaim tautan dari baris bukti |

## Detail Teknis

- **Arsitektur:** konten tetap terpusat di `src/content/caps.ts`; komponen hanya merender. Penghapusan field = penghapusan satu properti tipe + lima nilai, bukan perubahan struktur.
- **DB Changes:** Tidak ada.
- **API Changes:** Tidak ada.
- **Dependencies:** Tidak ada.

## Testing

- **Test Results:** `npm run build` PASS, `npm run lint` PASS (0 error/warning), `npm run smoke` PASS — semua check lulus.
- **Perubahan case smoke:** `FR-002.4 (amended 2026-09-15)` kini assertion terbalik (`!/src-tauri|src\/tauri|resources\/manifests/.test(html)`), menggantikan pengecekan bahwa path repo muncul di HTML.
- **Edge Cases:** assertion negatif dicek terhadap `/` dan `/privacy` sehingga path teknis tidak bocor dari halaman lain; panel bukti (chips runtimes) tetap harus hadir, jadi penghapusan tidak ikut mencabut bukti visual.
- **Manual Test:** cek row 04 masih menampilkan delapan chip + note `21 detected · 9 also configurable`, dan tidak ada baris monospace di bawah klaim.

## Deployment

- **Migration:** Tidak ada.
- **Environment Variables:** `NEXT_PUBLIC_SITE_URL` tetap wajib untuk build produksi (persyaratan lama, tidak berubah).
- **Config Changes:** Tidak ada.

## Catatan

- **Keputusan:** requirement-nya di-retire, bukan sekadar disembunyikan — `FR-002.4`/`FR-002.6`/`BR-002.1`/`BR-002.4` diamandemen, aturan design system `CAP-001` ditandai *retired*, dan `TC-F002-005` dipindah ke tabel removed. Konvensi id: dipertahankan, tidak pernah dipakai ulang (mengikuti jejak `ENT-002`/`SEC-004`).
- **Konsekuensi:** honesty check sekarang bertumpu pada `TC-F002-003` (review konten terhadap repositori aplikasi) karena tidak ada lagi path yang bisa dibandingkan otomatis. `LP-006` tetap mewajibkan verifikasi ulang angka sebelum deploy.
- **Limitasi:** `docs/test_execution_sheet.md` masih membawa drift lama (row `TC-F004-*` waitlist yang kodenya sudah tidak ada, dua row `TC-F009-*` yang dicoret) — pass ini hanya menyesuaikan bagian F002 dan mencatat drift itu di tabel revisi, bukan menghitung ulang seluruh sheet.
