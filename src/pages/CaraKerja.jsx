import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProcessDrawing } from '../components/OrderJourney.jsx'
import { waLink } from '../lib/format.js'
import './carakerja.css'

const PREP = ['Fungsi & jenis alat', 'Ukuran & jumlah', 'Foto atau sketsa', 'Waktu yang diharapkan']
const PHASES = [
  { label: 'Dari kamu', title: 'Kasih acuannya.', drawing: 0, text: 'Pilih produk atau kirim desain sendiri. Pengrajin cek bahan, ukuran, dan kapasitas.', foot: 'Sepakati harga, jadwal, lalu konfirmasi DP.', link: '/pesan', action: 'Kirim kebutuhan alat' },
  { label: 'Di bengkel', title: 'Mulai dikerjakan.', drawing: 3, text: 'Alat ditempa, dirapikan, dan diperiksa sesuai spesifikasi yang disepakati.', foot: 'Pantau dengan kode pesanan + 4 digit akhir HP.', link: '/status', action: 'Lihat status pesanan' },
  { label: 'Sampai ke kamu', title: 'Siap dipakai.', drawing: 4, text: 'Setelah lolos pengecekan, alat diberi identitas, paspor QR, dan dikemas.', foot: 'Simpan paspor untuk panduan rawat dan servis.', link: '/aturan', action: 'Baca ketentuan pesanan' },
]
const FAQ = [
  ['Berapa lama pengerjaannya?', 'Tergantung jenis alat, jumlah, dan antrean. Jadwal dikonfirmasi sebelum produksi.'],
  ['Bisa pesan banyak sekaligus?', 'Cantumkan jumlah di formulir. Pengrajin akan mengecek kapasitas dan waktu pengerjaan.'],
  ['Bagaimana harga dan pembayarannya?', 'Harga final disepakati lewat WhatsApp. DP dan pelunasan ke rekening resmi kelompok yang diinformasikan pengelola.'],
  ['Bisa pilih bahan sendiri?', 'Sampaikan kebutuhan bahan. Pengrajin mengecek kecocokannya dengan fungsi alat.'],
]

export default function CaraKerja() {
  const [checked, setChecked] = useState([])
  const help = waLink('Halo PANDE, saya ingin menanyakan proses pemesanan alat.')
  return <div className="process-page">
    <header className="wrap process-intro">
      <div><Link className="process-back" to="/">PANDE / CARA KERJA</Link><h1>Gimana alatmu<br /><em>dibuat?</em></h1><p>Mulai dari kebutuhanmu. Detail teknis, harga, dan waktu pengerjaan dibicarakan sebelum produksi.</p><Link to="/pesan" className="btn">Mulai pesan ↗</Link></div>
      <div className="process-note"><span className="process-note-tape" aria-hidden="true" /><small>SEBELUM KIRIM, CEK DULU</small><h2>Sudah siap?</h2><p>Centang detail yang sudah kamu punya.</p>
        {PREP.map((text, i) => <label key={text}><input type="checkbox" checked={checked.includes(i)} onChange={() => setChecked((list) => list.includes(i) ? list.filter((n) => n !== i) : [...list, i])} /><span>{text}</span></label>)}
        <span className="process-note-count" aria-live="polite">{checked.length} / 4 detail siap</span>
      </div>
    </header>
    <section className="wrap process-route" aria-label="Tiga bagian proses pesanan">
      {PHASES.map((phase, i) => <article key={phase.label} className={`process-phase phase-${i}`}>
        <div className="process-phase-top"><span>{String(i + 1).padStart(2, '0')}</span><small>{phase.label}</small><span aria-hidden="true">{i < 2 ? '↗' : '↻'}</span></div>
        <ProcessDrawing step={phase.drawing} /><h2>{phase.title}</h2><p>{phase.text}</p><div className="process-phase-foot"><p>{phase.foot}</p><Link to={phase.link}>{phase.action} ↗</Link></div>
      </article>)}
    </section>
    <section className="wrap process-faq"><div><small>YANG SERING DITANYAKAN</small><h2>Masih penasaran?</h2>{help && <a href={help} target="_blank" rel="noreferrer">Tanya pengelola ↗</a>}</div><div>{FAQ.map(([title, text]) => <details key={title}><summary>{title}</summary><p>{text}</p></details>)}</div></section>
  </div>
}
