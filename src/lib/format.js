import { WA_NUMBER } from './config.js'

export const rupiah = (n) =>
  n == null || Number.isNaN(Number(n)) ? '-' : 'Rp' + Number(n).toLocaleString('id-ID')

export const kisaran = (min, max) => {
  if (min == null && max == null) return 'Harga sesuai pesanan'
  if (min == null || max == null || Number(min) === Number(max)) return rupiah(min ?? max)
  return `${rupiah(min)} - ${rupiah(max)}`
}

export const tanggal = (d) => (d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-')

export const waLink = (teks) =>
  WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(teks)}` : null
