import { Link } from 'react-router-dom'
import '../components/nav-pages.css'
import { DESA_URL } from '../lib/config.js'

const POTENSI = [
  ['Pande besi', 'Alat tani, pisau dapur, dan perkakas dari kelompok Gayeng Ruyeng.', '/karya', 'PRODUKSI ALAT'],
  ['Melon hidroponik', 'Budidaya melon oleh Kelompok Wanita Tani.', null, 'PERTANIAN'],
  ['Bank sampah', 'Pemilahan sampah dan kegiatan pemanfaatan material warga.', null, 'PENGELOLAAN MATERIAL'],
  ['UMKM desa', 'Lencana, plakat, perhiasan, dan olahan makanan.', null, 'USAHA LOKAL'],
]

export default function Desa() {
  return (
    <>
      <header className="wrap village-postcard-intro"><small>PANDE / JELAJAHI DESA</small><div><h1>Dari Pasir Wetan.<br /><em>Bukan cuma tempa.</em></h1><p>Pengrajin, kebun, dan usaha warga<br />di Karanglewas, Banyumas.</p></div></header>
      <section className="wrap village-workspace village-scrapbook" aria-label="Direktori potensi desa">
        <aside className="village-postcard">
          <span className="postcard-tape" aria-hidden="true" />
          <div className="postcard-art" aria-hidden="true"><svg viewBox="0 0 360 250" fill="none"><rect width="360" height="250" fill="#d5deca" /><circle cx="279" cy="61" r="28" fill="#edb26c" /><path d="M0 150Q80 45 170 131Q260 30 360 124V250H0Z" fill="#82957c" /><path d="M0 183Q120 90 222 169Q310 118 360 155V250H0Z" fill="#4c6a54" /><path d="M148 250Q225 215 185 184Q163 159 213 139" stroke="#d7c5a2" strokeWidth="16" /><path d="M42 183V151L73 125L103 151V183Z" fill="#e4d3b3" /><path d="M34 153L73 119L111 153" stroke="#4b3930" strokeWidth="7" /><path d="M68 183V160H81V183" fill="#806247" /><path d="M266 202V164L300 140L332 164V202Z" fill="#d3b391" /><path d="M258 166L300 133L340 166" stroke="#4b3930" strokeWidth="7" /><path d="M20 217H95 M262 225H345" stroke="#acbb96" strokeWidth="2" /></svg><span>ILUSTRASI SUASANA DESA</span></div>
          <div className="postcard-caption"><h2>Pasir Wetan</h2><span>BANYUMAS, JAWA TENGAH</span><p>Tempat alatmu dibuat.</p></div>
          <a href={DESA_URL} target="_blank" rel="noreferrer">Kabar dari situs desa ↗</a>
        </aside>
        <div className="village-directory">
          <div className="directory-heading"><h2>Potensi & usaha lokal</h2><span>04 BIDANG</span></div>
          {POTENSI.map(([title, description, to, type], i) => <article key={title} className="village-entry">
            <span className="village-no">{String(i + 1).padStart(2, '0')}</span>
            <div><small>{type}</small><h3>{title}</h3><p>{description}</p>
              {to ? <Link to={to}>Lihat produk ↗</Link> : <a href={DESA_URL} target="_blank" rel="noreferrer">Info di situs desa ↗</a>}
            </div>
          </article>)}
          <p className="village-note">PANDE melayani pesanan alat tempa. Informasi usaha lain dapat dikonfirmasi ke pengelola desa.</p>
        </div>
      </section>
    </>
  )
}
