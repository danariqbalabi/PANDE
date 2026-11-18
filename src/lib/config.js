// Default: nomor narahubung resmi kelompok dari katalog Gayeng Ruyeng.
export const WA_NUMBER = (import.meta.env.VITE_WA_NUMBER || '6289669515915').replace(/\D/g, '')
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
export const DESA_URL = 'https://pasirwetan.desa.id'

export const STATUS_LABEL = {
  diterima: 'Pesanan diterima',
  estimasi: 'Harga dikonfirmasi',
  dp: 'DP diterima',
  ditempa: 'Sedang ditempa',
  finishing: 'Finishing',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}
export const STATUS_URUT = ['diterima', 'estimasi', 'dp', 'ditempa', 'finishing', 'dikirim', 'selesai']

// Daftar kategori statis (sama dengan data awal di schema.sql) agar beranda tetap lengkap tanpa menunggu database.
export const KATEGORI = [
  { kategori: 'alat_tani', label: 'Alat Tani & Kebun', desc: 'Cangkul, sabit, garpu rumput, sekop, alat kandang.' },
  { kategori: 'pertukangan', label: 'Pertukangan', desc: 'Palu, pahat, linggis, perkakas bengkel.' },
  { kategori: 'dapur', label: 'Dapur', desc: 'Pisau chef, golok dapur, cleaver, set pisau.' },
  { kategori: 'rumah_dekor', label: 'Rumah & Dekorasi', desc: 'Engsel, gagang pintu, gantungan, rak, hiasan.' },
  { kategori: 'suvenir', label: 'Suvenir', desc: 'Pembuka botol, gantungan kunci, plakat logam.' },
  { kategori: 'khusus', label: 'Pesanan Khusus', desc: 'Kirim sketsa atau foto, kami tempa sesuai ukuran.' },
]

// Jenis barang per kategori (kolom karya.jenis), mengikuti katalog Gayeng Ruyeng.
export const JENIS = [
  { id: 'set_pisau', label: 'Set Pisau', kategori: 'dapur' },
  { id: 'pisau_chef', label: "Pisau Chef", kategori: 'dapur' },
  { id: 'cleaver', label: 'Carving / Cleaver', kategori: 'dapur' },
  { id: 'fillet', label: 'Pisau Fillet', kategori: 'dapur' },
  { id: 'pisau_sayur', label: 'Pisau Sayur', kategori: 'dapur' },
  { id: 'petty', label: 'Pisau Kecil', kategori: 'dapur' },
  { id: 'golok', label: 'Golok', kategori: 'alat_tani' },
  { id: 'golok_sembelih', label: 'Golok Sembelih', kategori: 'alat_tani' },
  { id: 'kudi', label: 'Kudi', kategori: 'alat_tani' },
  { id: 'sabit', label: 'Sabit', kategori: 'alat_tani' },
  { id: 'uril', label: 'Uril', kategori: 'alat_tani' },
  { id: 'cangkul', label: 'Cangkul', kategori: 'alat_tani' },
  { id: 'slondom', label: 'Slondom', kategori: 'alat_tani' },
  { id: 'garpu', label: 'Garpu Tanah', kategori: 'alat_tani' },
  { id: 'gunting', label: 'Gunting Tanaman', kategori: 'alat_tani' },
  { id: 'lading', label: 'Lading', kategori: 'pertukangan' },
  { id: 'palu', label: 'Palu', kategori: 'pertukangan' },
  { id: 'engsel', label: 'Engsel', kategori: 'rumah_dekor' },
  { id: 'gantungan', label: 'Gantungan & Rak', kategori: 'rumah_dekor' },
  { id: 'pembuka_botol', label: 'Pembuka Botol', kategori: 'suvenir' },
  { id: 'lainnya', label: 'Lainnya', kategori: 'khusus' },
]
export const labelJenis = (id) => JENIS.find((j) => j.id === id)?.label ?? id

// Finishing permukaan bilah (kolom karya.finishing).
export const FINISHING = [
  { id: 'tsuchime', label: 'Tsuchime (motif palu)' },
  { id: 'kurouchi', label: 'Kurouchi (hitam tempa)' },
  { id: 'satin', label: 'Satin' },
  { id: 'poles', label: 'Poles cermin' },
]
export const labelFinishing = (id) => FINISHING.find((f) => f.id === id)?.label ?? id
