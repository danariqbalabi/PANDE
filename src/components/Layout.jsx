import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { DESA_URL, KATEGORI } from '../lib/config.js'
import { Stamp } from './Effects.jsx'
import { KONTAK } from '../data/demo.js'

const MENU = [
  ['/karya', 'Koleksi'],
  ['/pengrajin', 'Pengrajin'],
  ['/cara-kerja', 'Cara Kerja'],
  ['/status', 'Cek Status'],
  ['/desa', 'Jelajahi Desa'],
]

export default function Layout() {
  const [buka, setBuka] = useState(false)
  const [gulir, setGulir] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setGulir(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Pindah halaman: tutup menu dan kembali ke atas.
  useEffect(() => { setBuka(false); window.scrollTo(0, 0) }, [loc.pathname])

  return (
    <>
      <a href="#isi" className="skip">Lewati ke isi</a>
      <header className={`header ${gulir || loc.pathname !== '/' ? 'solid' : ''}`}>
        <div className="wrap header-in">
          <Link to="/" className="logo" aria-label="PANDE beranda">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">PANDE<small>Tempa Pasir Wetan</small></span>
          </Link>
          <button className="menu-btn" aria-expanded={buka} aria-controls="nav" onClick={() => setBuka(!buka)}>
            <span className={buka ? 'burger x' : 'burger'} aria-hidden="true"><i /><i /><i /></span>
            <span className="sr">Menu</span>
          </button>
          <nav id="nav" className={buka ? 'nav buka' : 'nav'}>
            {MENU.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
            <Link to="/pesan" className="btn kecil nav-cta">Pesan Sekarang</Link>
          </nav>
        </div>
      </header>

      <main id="isi" className="page" key={loc.pathname}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <Stamp className="footer-stamp" />
              <div>
                <strong className="footer-logo">PANDE</strong>
                <p>Bengkel tempa Kelompok Pengrajin Pande Besi <b>Gayeng Ruyeng</b>. Ditempa dari besi bekas, dibuat sesuai pesanan.</p>
              </div>
            </div>
            <div className="footer-col">
              <h4>Kategori</h4>
              {KATEGORI.map((k) => <Link key={k.kategori} to={`/karya?kategori=${k.kategori}`}>{k.label}</Link>)}
            </div>
            <div className="footer-col">
              <h4>Layanan</h4>
              <Link to="/pesan">Pesan barang</Link>
              <Link to="/cara-kerja">Cara kerja</Link>
              <Link to="/status">Cek status pesanan</Link>
              <Link to="/aturan">Aturan pesanan</Link>
              <Link to="/dampak">Dampak</Link>
            </div>
            <div className="footer-col">
              <h4>Desa</h4>
              <Link to="/desa">Jelajahi Pasir Wetan</Link>
              <a href={DESA_URL} target="_blank" rel="noreferrer">Website Desa ↗</a>
              <address>Desa Pasir Wetan, Kec. Karanglewas,<br />Kab. Banyumas, Jawa Tengah</address>
            </div>
            <div className="footer-col">
              <h4>Kontak</h4>
              <span>{KONTAK.narahubung}</span>
              <a href={`https://wa.me/${KONTAK.wa}`} target="_blank" rel="noreferrer">{KONTAK.telepon}</a>
              <a href={`mailto:${KONTAK.email}`}>{KONTAK.email}</a>
              <a href={`https://instagram.com/${KONTAK.instagram}`} target="_blank" rel="noreferrer">@{KONTAK.instagram}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} PANDE · Tempa Pasir Wetan</span>
            <span className="mono">ME FECIT PASIR WETAN</span>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
