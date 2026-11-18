# PANDE — Tempa Pasir Wetan

**Pesan apa saja dari besi.** PANDE adalah website kelompok pandai besi **Gayeng Ruyeng** (20 anggota) di Desa Pasir Wetan, Kec. Karanglewas, Kab. Banyumas. Siapa pun bisa memesan barang tempa custom (alat tani, alat pertukangan, pisau dapur, perlengkapan/dekorasi rumah, suvenir, sampai pesanan khusus) yang dibuat dari **baja daur ulang**: per daun kendaraan bekas dan besi bekas yang disetor lewat bank sampah desa. Setiap barang jadi diberi cap **"PASIR WETAN"** dan QR **paspor produk** di `/p/{kode}` yang menceritakan siapa pembuatnya, berapa kg besi bekas yang terselamatkan, cara merawatnya, dan tautan untuk menjelajah desa. Dibuat untuk **ACC Next Green Leaders Challenge (DSA Pasir Wetan)**.

Stack: Vite + React (SPA), Supabase (Postgres + RLS + fungsi RPC + Auth admin + Storage bucket `foto`), di-host di Render sebagai static site lewat `render.yaml`. **Tidak ada server backend sendiri.**

---

## 1. Fitur

### Halaman publik (lihat `src/App.jsx`)

| Rute | Fungsi |
|---|---|
| `/` | Beranda: konsep "pesan apa saja dari besi", kategori, karya unggulan |
| `/karya` | Katalog karya yang sudah pernah dibuat (filter kategori) |
| `/karya/:id` | Detail satu karya + tombol pesan barang serupa |
| `/pesan` | Form pemesanan custom; menghasilkan kode pesanan + estimasi kisaran harga, lalu lanjut ke WhatsApp untuk kirim foto/sketsa |
| `/status` | Cek status pesanan pakai kode pesanan + 4 digit terakhir nomor HP |
| `/p/:kode` | Paspor produk (tujuan QR): pembuat, asal besi, kg besi bekas, cara rawat, tautan desa |
| `/pengrajin` | Profil pengrajin (hanya yang sudah memberi izin tampil) |
| `/dampak` | Angka dampak agregat: kg besi disetor/ditempa, barang berpaspor, jumlah scan, dll. |
| `/desa` | Jelajah Desa Pasir Wetan |
| `/aturan` | Aturan pesanan (termasuk larangan senjata) |
| `/admin` | Panel admin (login Supabase Auth) |
| `*` | Halaman 404 |

### Panel admin (`/admin`)

| Tab | Isi |
|---|---|
| Pesanan | Daftar pesanan masuk, ubah status (diterima → estimasi → dp → ditempa → finishing → dikirim → selesai / dibatalkan), harga final, DP, pengrajin |
| Paspor & QR | Buat paspor produk, generate & unduh QR untuk dicetak |
| Karya | Kelola katalog karya + upload foto |
| Pengrajin | Data pengrajin, keahlian, kapasitas, izin tampil publik |
| Setoran Besi | Catat besi bekas masuk (bank sampah/bengkel), berat, harga |
| Kategori & Harga | Isi kisaran harga per kategori (dipakai untuk estimasi di form pesan) |
| Kalkulator | Hitung harga jual dari bahan, upah, finishing, margin, kontribusi kas |

---

## 2. Struktur folder

```
PANDE/
├─ index.html
├─ package.json
├─ vite.config.js
├─ render.yaml            # blueprint deploy Render (static site + rewrite SPA)
├─ .env.example           # contoh variabel lingkungan
├─ public/                # favicon, aset statis
├─ supabase/
│  └─ schema.sql          # tabel, RLS, fungsi RPC, bucket storage, data awal kategori
└─ src/
   ├─ App.jsx             # daftar rute
   ├─ main.jsx
   ├─ components/         # Layout, komponen UI
   ├─ pages/              # halaman publik
   ├─ admin/              # panel admin per tab + upload.js
   └─ lib/                # config, supabase client, format, harga.js (+ harga.test.js)
```

---

## 3. Setup lokal

Butuh **Node.js 18+**.

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# isi .env (lihat bagian Supabase di bawah)
npm run dev               # buka alamat yang muncul di terminal
npm test                  # unit test kalkulator harga (src/lib/harga.test.js)
npm run build             # build produksi ke folder dist/
```

Isi `.env`:

| Variabel | Isi |
|---|---|
| `VITE_SUPABASE_URL` | Project URL Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon/public key Supabase |
| `VITE_WA_NUMBER` | Nomor WhatsApp pemesanan, format internasional tanpa `+`/spasi, mis. `62812...` |
| `VITE_SITE_URL` | Alamat situs final (dipakai sebagai isi QR paspor) |

---

## 4. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, tempel seluruh isi `supabase/schema.sql`, lalu **Run**. Aman dijalankan ulang (pakai `IF NOT EXISTS` / `OR REPLACE`). Ini membuat tabel, RLS, fungsi RPC, bucket `foto`, dan 6 kategori awal.
3. Buat akun admin: **Authentication > Users > Add user**, isi email + password.
   Disarankan: matikan pendaftaran publik di **Authentication > Settings** (disable sign-ups), supaya tidak ada orang asing membuat akun.
4. Jadikan akun itu admin. Di SQL Editor:
   ```sql
   insert into admins (user_id) values ('<UUID user>');
   ```
   UUID bisa dilihat di daftar Users. Cara lain: login dulu di `/admin` — kalau akun belum terdaftar sebagai admin, halaman itu menampilkan user ID yang perlu dimasukkan.
5. Login ke `/admin`, buka tab **Kategori & Harga**, isi kisaran harga tiap kategori (dari hasil wawancara pengrajin). Selama masih kosong, estimasi di form pesan tidak muncul.
6. Salin **Project URL** dan **anon key** dari **Project Settings > API** ke `.env` (dan nanti ke env Render).

> **Soal kunci:** anon key memang aman ditaruh di frontend karena semua akses dibatasi RLS. **JANGAN PERNAH** memasukkan `service_role` key ke frontend, ke `.env` proyek ini, atau ke environment Render — key itu melewati semua RLS.

---

## 5. Deploy ke Render

1. Push folder ini ke repo GitHub. **Jangan ikutkan `.env`** (pastikan masuk `.gitignore`).
2. Di Render, pilih salah satu:
   - **New > Blueprint** → pilih repo; `render.yaml` otomatis dipakai, **atau**
   - **New > Static Site** dengan:
     - Build command: `npm ci && npm run build`
     - Publish directory: `dist`
     - Redirects/Rewrites: source `/*` → destination `/index.html`, action **Rewrite**. Wajib, supaya link QR `/p/{kode}` dan rute lain tidak 404 saat dibuka langsung.
3. Isi 4 env var: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WA_NUMBER`, `VITE_SITE_URL`.
4. Setelah deploy pertama, set `VITE_SITE_URL` ke URL `*.onrender.com` (atau domain sendiri) lalu **redeploy**. Variabel `VITE_*` ditanam saat build, jadi perubahan baru berlaku setelah build ulang.
5. Di Supabase: **Authentication > URL Configuration**, isi Site URL dengan alamat situs (dan tambahkan ke Redirect URLs).

> **Penting soal QR:** QR paspor berisi `VITE_SITE_URL/p/{kode}`. QR yang sudah dicetak dan menempel di barang **tidak bisa diganti**. Tentukan domain final **sebelum** mencetak tag QR — misalnya subdomain dari `pasirwetan.desa.id` (perlu koordinasi dengan pengelola domain desa). Kalau domain berubah setelah QR dicetak, semua QR lama mati. Kode paspor juga jangan pernah diubah.

---

## 6. Yang harus ada di web

| Item | Status |
|---|---|
| Katalog, form pesan, cek status, paspor QR, halaman dampak/desa/aturan | Sudah dibangun |
| Panel admin (pesanan, paspor & QR, karya, pengrajin, setoran besi, harga, kalkulator) | Sudah dibangun |
| Keamanan data pesanan (RLS + RPC) | Sudah dibangun |
| Foto produk asli (bukan stok/ilustrasi) | Disiapkan di luar kode |
| Kisaran harga per kategori dari wawancara pengrajin | Disiapkan di luar kode (isi di admin) |
| Nomor WhatsApp resmi kelompok | Disiapkan di luar kode (`VITE_WA_NUMBER`) |
| Info rekening kelompok untuk DP | Disiapkan di luar kode (dikirim lewat WA) |
| Persetujuan tertulis pengrajin untuk profil & foto publik | Disiapkan di luar kode (lalu centang izin tampil) |
| Cek merek "PANDE"/"Tempa Pasir Wetan" di PDKI DJKI | Disiapkan di luar kode |
| Cap baja "PASIR WETAN" | Disiapkan di luar kode |
| Tag QR cetak yang awet (tahan panas/air/karat) | Disiapkan di luar kode |
| Kader digital desa yang terlatih memakai panel admin | Disiapkan di luar kode |
| Domain final sebelum cetak QR | Disiapkan di luar kode |

---

## 7. API yang dipakai & bisa ditambahkan

| API/Layanan | Fungsi | Status | Biaya |
|---|---|---|---|
| Supabase Database + RLS + RPC | Simpan data, batasi akses, fungsi publik `buat_pesanan`, `cek_status`, `catat_scan`, `dampak` | Sudah dipakai | Free tier (cek harga terbaru) |
| Supabase Auth | Login admin | Sudah dipakai | Free tier |
| Supabase Storage | Bucket `foto` untuk foto karya & pengrajin | Sudah dipakai | Free tier |
| WhatsApp click-to-chat (`wa.me`) | Lanjut obrolan pesanan + kirim foto/sketsa | Sudah dipakai | Gratis |
| Library `qrcode` | Generate QR paspor di browser (lokal, bukan API) | Sudah dipakai | Gratis |
| Render Static Site | Hosting frontend | Sudah dipakai | Free tier (cek harga terbaru) |
| Cloudflare Turnstile | Anti-spam form pesan | Disarankan berikutnya | Gratis |
| Resend / Supabase Edge Function + email | Notifikasi pesanan baru ke kader | Disarankan berikutnya | Free tier |
| Umami / Plausible / Google Analytics | Statistik pengunjung | Disarankan berikutnya | Gratis–berbayar (cek harga terbaru) |
| Google Maps Embed | Peta lokasi bengkel di `/desa` | Disarankan berikutnya | Gratis (embed) |
| WhatsApp Business Platform (Cloud API) / Fonnte | Notifikasi WA otomatis (pesanan masuk, status berubah) | Opsional nanti | Berbayar + aturan template (cek harga terbaru) |
| Midtrans / Xendit | Bayar DP online | Opsional nanti | Berbayar per transaksi (cek harga terbaru) |
| Biteship / RajaOngkir | Hitung ongkos kirim | Opsional nanti | Free tier/berbayar (cek harga terbaru) |
| Cloudinary / Supabase image transformation | Optimasi ukuran foto | Opsional nanti | Free tier/berbayar (cek harga terbaru) |
| Looker Studio (konek ke Supabase/Postgres) | Dashboard dampak untuk laporan | Opsional nanti | Gratis |

Di mana masing-masing dipasang:

- **Turnstile** → widget di form `src/pages/Pesan.jsx`; token diverifikasi di Supabase Edge Function sebelum memanggil `buat_pesanan` (verifikasi butuh secret key, jadi tidak boleh di frontend).
- **Resend / email** → Database Webhook atau trigger pada insert `pesanan` → Edge Function kirim email ke kader.
- **Analytics** → satu tag `<script>` di `index.html`. Perhatikan privasi; Umami/Plausible tidak pakai cookie.
- **Google Maps Embed** → `<iframe>` di `src/pages/Desa.jsx`.
- **WA Cloud API / Fonnte** → Edge Function yang dipanggil saat status pesanan berubah (tab Pesanan). Token API disimpan sebagai secret Edge Function, bukan di `VITE_*`.
- **Midtrans / Xendit** → Edge Function buat transaksi DP + webhook yang mengubah status pesanan jadi `dp`.
- **Biteship / RajaOngkir** → Edge Function dipanggil dari form pesan/admin saat menentukan ongkir.
- **Cloudinary / image transformation** → ganti URL foto di `src/admin/upload.js` / tampilan katalog.
- **Looker Studio** → konek langsung ke Postgres Supabase memakai user read-only khusus (jangan pakai kredensial admin).

---

## 8. Keamanan & privasi

Ringkasan yang dilakukan `supabase/schema.sql`:

- **RLS aktif di semua tabel.** Tulis data hanya untuk user yang terdaftar di tabel `admins` (cek lewat fungsi `is_admin()`).
- **Tabel `pesanan` (berisi nama & nomor HP) tidak bisa dibaca publik sama sekali.** Publik hanya bisa lewat RPC:
  - `buat_pesanan` — validasi semua input (wajib setuju aturan, panjang nama/jenis/catatan, nomor HP 9–15 digit, jumlah 1–500, kategori valid) + **batas 5 pesanan per nomor HP per 24 jam**. Kode pesanan acak `PSN-xxxxxx`.
  - `cek_status` — wajib **kode pesanan + 4 digit terakhir HP**; tidak mengembalikan nama atau nomor HP.
  - `catat_scan` — hanya mencatat scan paspor yang kodenya ada.
  - `dampak` — hanya angka agregat.
- **Pengrajin** tampil publik hanya jika `izin_tampil = true`.
- **Storage `foto`**: bisa dibaca publik, tapi upload/ubah/hapus hanya admin.
- **Honeypot**: form pesan punya field tersembunyi; jika terisi (bot), form tidak dikirim.
- **Aturan tanpa senjata**: pemesan wajib mencentang pernyataan bahwa barang bukan senjata sebelum pesanan diterima.
- Kode paspor acak (`PW-xxxxxxxx`) supaya tidak mudah ditebak berurutan.

---

## 9. Batasan & catatan

- **Belum ada pembayaran online.** DP dilakukan manual lewat transfer ke rekening kelompok, dikonfirmasi lewat WhatsApp, lalu admin mencatat DP di tab Pesanan.
- **Estimasi hanya kisaran** (harga per barang × jumlah dari tabel kategori). Harga final ditentukan pengrajin setelah melihat ukuran/sketsa.
- **Render free static site**: ada batas bandwidth/build per bulan — cek kebijakan terbaru di dokumentasi Render.
- **Supabase free tier**: project yang tidak aktif dalam jangka waktu tertentu bisa di-pause — cek kebijakan terbaru. Pastikan ada yang rutin membuka situs/admin, atau pertimbangkan paket berbayar kalau sudah dipakai serius.
- Ubah `VITE_*` = harus redeploy, karena nilainya ditanam saat build.

---

## 10. Aturan konten

- **Tidak menerima pesanan senjata** dalam bentuk apa pun. Hanya alat kerja, perlengkapan rumah tangga, dekorasi, dan suvenir. Admin berhak membatalkan pesanan yang melanggar.
- **Cap "PASIR WETAN" dan QR paspor hanya untuk barang yang lolos uji kualitas.** Barang yang gagal QC tidak diberi cap atau paspor.
- Foto dan profil pengrajin hanya ditampilkan setelah ada izin dari yang bersangkutan.
- Angka di halaman Dampak berasal dari data yang dicatat admin (setoran besi & paspor) — jangan isi angka perkiraan.
