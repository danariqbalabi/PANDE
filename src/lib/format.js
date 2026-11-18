import { WA_NUMBER } from './config.js'

export const rupiah = (n) =>
  n == null || Number.isNaN(Number(n)) ? '-' : 'Rp' + Number(n).toLocaleString('id-ID')

export const kisaran = (min, max) => (min == null && max == null ? 'Harga sesuai pesanan' : `${rupiah(min)} - ${rupiah(max)}`)

export const tanggal = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-')

export const waLink = (teks) =>
  WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(teks)}` : null
