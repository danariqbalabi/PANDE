export const WA_NUMBER = (import.meta.env.VITE_WA_NUMBER || '').replace(/\D/g, '')
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
