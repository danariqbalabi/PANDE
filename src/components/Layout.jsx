import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

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
          <Link to="/" className="logo logo-image" aria-label="PANDE beranda">
            <img src="/brand/logo-pande-white.png" alt="PANDE" width="1400" height="307" />
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

      <footer className="footer footer-simple">
        <div className="wrap">
          <div className="footer-simple-grid">
            <div className="footer-brand">
              <div>
                <Link to="/" className="footer-logo-image" aria-label="PANDE beranda"><img src="/brand/logo-pande-white.png" alt="PANDE" width="1400" height="307" /></Link>
                <p>Alat tempa dari Pasir Wetan, Banyumas.</p>
              </div>
            </div>
            <div className="footer-col">
              <h4>Jelajahi</h4>
              <Link to="/karya">Koleksi</Link><Link to="/pengrajin">Pengrajin</Link><Link to="/desa">Desa Pasir Wetan</Link>
            </div>
            <div className="footer-col">
              <h4>Pesanan</h4>
              <Link to="/pesan">Ajukan pesanan</Link><Link to="/status">Cek status</Link><Link to="/cara-kerja">Cara kerja</Link>
            </div>
            <div className="footer-col">
              <h4>Tim pengembang</h4>
              <span className="footer-team">Lomba Sekampung</span>
            </div>
          </div>
          <div className="footer-bottom">
            <Link to="/aturan">Aturan pesanan</Link><Link to="/admin">Akses pengelola ↗</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
