// DATA ASLI Kelompok Pengrajin Pande Besi Gayeng Ruyeng.
// Sumber: dokumen profil kelompok & katalog produk di pasirwetan.desa.id (diunggah Jul–Agt 2025).
// Dipakai langsung di situs bila Supabase belum tersambung, dan menjadi isi awal database (supabase/seed.sql,
// dibuat dengan `npm run seed`). Yang belum diketahui sengaja dibiarkan kosong: biodata, tahun mulai menempa,
// wawancara, dan siapa pembuat tiap barang — lengkapi lewat Admin setelah wawancara & izin pengrajin.

const p = (nama, peran) => ({
  id: 'p-' + nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  slug: nama.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  nama, peran,
  sejak_tahun: null, dusun: null, keahlian: [], kutipan: null, bio: null, wawancara: [],
  foto_url: null, izin_tampil: true,
})

export const DEMO_PENGRAJIN = [
  p('Fajar Tri Anggoro', 'Ketua'),
  p('Noto Suprapto', 'Sekretaris'),
  p('Kasiron', 'Bendahara'),
  p('Tiswan', 'Sie Humas'),
  p('Haryono', 'Sie Pemasaran'),
  ...['Rusamsi', 'Kirto', 'Nahidin', 'M Bahrun', 'Rohmat', 'Ripin', 'Kusnoto', 'Priono', 'Muchlis',
    'Rasiwan', 'Wardi', 'Daryono', 'Baris Aji', 'Fathur', 'Wasirin'].map((n) => p(n, 'Anggota')),
]

const LABEL = { alat_tani: 'Alat Tani & Kebun', pertukangan: 'Pertukangan', dapur: 'Dapur', rumah_dekor: 'Rumah & Dekorasi', suvenir: 'Suvenir', khusus: 'Pesanan Khusus' }

// k(slug, data): slug juga nama file foto di public/karya/
const k = (slug, o) => ({
  id: slug, slug, tampil: true, unggulan: false, created_at: '2025-08-15',
  foto_url: `/produk/${slug}.jpg`, deskripsi: null, ukuran: null, finishing: null,
  panjang_mm: null, berat_gram: null, baja: 'Baja per kendaraan bekas', gagang: null,
  harga_mulai: null, harga_sampai: null, pengrajin_id: null, pengasah_id: null,
  ...o,
  kategori_harga: { label: LABEL[o.kategori] },
  pengrajin: null, pengasah: null,
})
const harga = (n) => ({ harga_mulai: n, harga_sampai: n })

export const DEMO_KARYA = [
  // --- Pisau Set GR ---
  k('set-gr-sp', { nama: 'Pisau Set GR (Sp Steel)', kategori: 'dapur', jenis: 'set_pisau', unggulan: true, ...harga(537000),
    deskripsi: 'Lima pisau tempa dalam satu set: carving, chef, filleting, kitchen, dan shaping knife, dengan box kayu. Diproduksi dengan proses tempa oleh UMKM pande besi Gayeng Ruyeng, binaan YDBA Banyumas.',
    baja: 'Leaf spring (per kendaraan)', gagang: 'Kayu', ukuran: '5 pisau + box kayu' }),
  k('set-gr', { nama: 'Luxury Pisau Set GR (St Steel) + Hard Box', kategori: 'dapur', jenis: 'set_pisau', unggulan: true, ...harga(650000),
    deskripsi: 'Set lima pisau (carving, chef, filleting, kitchen, shaping) dalam hard box. Dibuat dari material "SSTAR" sehingga tajam dan tahan karat.',
    baja: 'Material "SSTAR"', ukuran: '5 pisau + hard box' }),
  // --- Pisau satuan dari Set GR ---
  k('carving-knife', { nama: 'Carving Knife', kategori: 'dapur', jenis: 'cleaver', ...harga(215000), panjang_mm: 180, berat_gram: 359,
    deskripsi: 'Memotong daging tebal dan rusuk.', ukuran: 'Bilah 18 × 18 cm, gagang 13 × 3,5 cm' }),
  k('chefs-knife', { nama: "Chef's Knife", kategori: 'dapur', jenis: 'pisau_chef', unggulan: true, ...harga(180000), panjang_mm: 245, berat_gram: 260,
    deskripsi: 'Memotong daging, buah, dan sayur ukuran besar.', ukuran: 'Bilah 24,5 × 4,5 cm, gagang 13 × 3,5 cm' }),
  k('filleting-knife', { nama: 'Filleting Knife', kategori: 'dapur', jenis: 'fillet', ...harga(110000), panjang_mm: 225, berat_gram: 85,
    deskripsi: 'Memfillet ikan dan daging.', ukuran: 'Bilah 22,5 × 3 cm, gagang 12,5 × 3 cm' }),
  k('kitchen-knife', { nama: 'Kitchen Knife', kategori: 'dapur', jenis: 'petty', ...harga(65000), panjang_mm: 100, berat_gram: 40,
    deskripsi: 'Mengupas dan memotong buah serta sayur ukuran kecil.', ukuran: 'Bilah 10 × 2 cm, gagang 10 × 2 cm' }),
  k('shaping-knife', { nama: 'Shaping Knife', kategori: 'dapur', jenis: 'petty', ...harga(59000), panjang_mm: 70, berat_gram: 30,
    deskripsi: 'Membuat dekorasi dan hiasan dari sayur dan buah.', ukuran: 'Bilah 7 × 2 cm, gagang 9,5 × 2,2 cm' }),
  // --- Peralatan dapur ---
  // Harga di katalog tertulis Rp4.750 / Rp7.000 — kemungkinan salah ketik, jadi dikosongkan sampai dikonfirmasi.
  k('pisau-buah', { nama: 'Pisau Buah', kategori: 'dapur', jenis: 'petty', panjang_mm: 135, berat_gram: 100, gagang: 'Kayu',
    deskripsi: 'Alat pemotong buah.', ukuran: 'Bilah 13,5 × 3 cm, gagang 11,5 cm' }),
  k('pisau-sayur', { nama: 'Pisau Sayur', kategori: 'dapur', jenis: 'pisau_sayur', panjang_mm: 165, berat_gram: 130, gagang: 'Kayu',
    deskripsi: 'Alat pemotong sayur.', ukuran: 'Bilah 16,5 × 4 cm, gagang 11 cm' }),
  k('pisau-fillet', { nama: 'Pisau Fillet', kategori: 'dapur', jenis: 'fillet', panjang_mm: 240, berat_gram: 130, gagang: 'Kayu',
    deskripsi: 'Alat fillet ikan.', ukuran: 'Bilah 24 × 3,5 cm, gagang 12 cm' }),
  k('sigar-jantung', { nama: 'Sigar Jantung', kategori: 'dapur', jenis: 'golok', ...harga(50000), panjang_mm: 200, berat_gram: 400,
    deskripsi: 'Alat potong daging.', ukuran: 'Bilah 20 × 7 cm, gagang 15,5 cm' }),
  // --- Pertukangan ---
  k('lading', { nama: 'Lading', kategori: 'pertukangan', jenis: 'lading', ...harga(30000), panjang_mm: 125, berat_gram: 220, gagang: 'Kayu',
    deskripsi: 'Membuat lubang dan merapikan sisi bambu.', ukuran: 'Bilah 12,5 × 4,5 cm, gagang 14 cm' }),
  k('palu', { nama: 'Palu', kategori: 'pertukangan', jenis: 'palu', ...harga(15000), berat_gram: 400,
    deskripsi: 'Alat pertukangan.', ukuran: 'Pemukul 11 cm, gagang 26 cm, diameter 2 cm' }),
  // --- Alat tani & kebun ---
  k('golok-lubuk', { nama: 'Golok Lubuk', kategori: 'alat_tani', jenis: 'golok', ...harga(50000), panjang_mm: 460, berat_gram: 550,
    deskripsi: 'Alat potong kayu.', ukuran: 'Bilah 46 × 5,5 cm, gagang 13,5 cm' }),
  k('golok-pattimura', { nama: 'Golok Pattimura', kategori: 'alat_tani', jenis: 'golok', ...harga(50000), panjang_mm: 460, berat_gram: 550,
    deskripsi: 'Alat potong kayu.', ukuran: 'Bilah 46 × 5,5 cm, gagang 13,5 cm' }),
  k('kudi', { nama: 'Kudi', kategori: 'alat_tani', jenis: 'kudi', unggulan: true, ...harga(100000), panjang_mm: 245, berat_gram: 400,
    deskripsi: 'Alat khas Banyumas untuk membuat lubang bambu dan pijakan pohon kelapa.', ukuran: 'Bilah 24,5 × 10 cm, gagang 23,4 cm' }),
  k('golok-sembelih', { nama: 'Golok Sembelih (per) + Sarung', kategori: 'alat_tani', jenis: 'golok_sembelih', ...harga(270000), panjang_mm: 350, berat_gram: 600,
    deskripsi: 'Alat sembelih hewan ternak, lengkap dengan sarung kayu.', ukuran: 'Bilah 35 × 5 cm, gagang 12 cm' }),
  k('golok-sembelih-bohler', { nama: 'Golok Sembelih (Bohler) + Sarung', kategori: 'alat_tani', jenis: 'golok_sembelih', ...harga(750000), panjang_mm: 350, berat_gram: 600,
    foto_url: '/produk/golok-sembelih.jpg', baja: 'Baja Bohler',
    deskripsi: 'Versi baja Bohler dari golok sembelih, lengkap dengan sarung kayu.', ukuran: 'Bilah 35 × 5 cm, gagang 12 cm' }),
  k('garpu-t3', { nama: 'Garpu T-3', kategori: 'alat_tani', jenis: 'garpu', ...harga(65000), berat_gram: 2000,
    deskripsi: 'Alat penggembur tanah.', ukuran: 'Jari 30 × 18 cm, gagang 58 cm, T-fork 17 cm' }),
  k('slondom', { nama: 'Slondom', kategori: 'alat_tani', jenis: 'slondom', ...harga(50000), panjang_mm: 250, berat_gram: 1800,
    deskripsi: 'Alat pencacah dan penggembur tanah.', ukuran: 'Bilah 25 cm (lebar 17–15 cm), gagang 1 m, pegangan 15 cm' }),
  k('sabit', { nama: 'Sabit Besar', kategori: 'alat_tani', jenis: 'sabit', unggulan: true, ...harga(45000), panjang_mm: 200, berat_gram: 500, gagang: 'Kayu',
    deskripsi: 'Alat pemotong rumput.', ukuran: 'Bilah 20 × 21 cm, gagang 25 cm' }),
  k('sabit-kecil', { nama: 'Sabit Kecil', kategori: 'alat_tani', jenis: 'sabit', ...harga(30000), foto_url: '/produk/sabit.jpg', gagang: 'Kayu',
    deskripsi: 'Sabit ukuran kecil untuk memotong rumput.' }),
  k('cangkul', { nama: 'Cangkul', kategori: 'alat_tani', jenis: 'cangkul', ...harga(55000), panjang_mm: 270, berat_gram: 1980,
    deskripsi: 'Alat untuk mencangkul.', ukuran: 'Bilah 27 cm, lebar 17 cm (atas) – 15,5 cm (bawah)' }),
  k('uril', { nama: 'Uril', kategori: 'alat_tani', jenis: 'uril', ...harga(75000), panjang_mm: 295, berat_gram: 550, gagang: 'Kayu',
    deskripsi: 'Alat panen buah salak.', ukuran: 'Bilah 29,5 × 5 cm, gagang 25 cm' }),
  k('gunting-tanaman', { nama: 'Gunting Tanaman', kategori: 'alat_tani', jenis: 'gunting', ...harga(35000), panjang_mm: 230, berat_gram: 500,
    deskripsi: 'Alat potong tanaman.', ukuran: 'Bilah 23 × 4 cm, gagang 21,5 cm (diameter 2 cm)' }),
]

// Kontak resmi kelompok (dari katalog Gayeng Ruyeng)
export const KONTAK = {
  narahubung: 'Fajar (Ketua)',
  telepon: '0896-6951-5915',
  wa: '6289669515915',
  email: 'banyumas@ydba.astra.co.id',
  instagram: 'pandebesipasir',
  facebook: 'gayeng ruyeng',
}
