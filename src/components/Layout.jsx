import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { DESA_URL } from '../lib/config.js'

const MENU = [
  ['/karya', 'Karya'],
  ['/pesan', 'Pesan'],
  ['/status', 'Cek Status'],
  ['/pengrajin', 'Pengrajin'],
  ['/dampak', 'Dampak'],
  ['/desa', 'Jelajahi Desa'],
]

export default function Layout() {
  const [buka, setBuka] = useState(false)
  const loc = useLocation()
  return (
    <>
      <header className="header">
        <div className="wrap header-in">
          <Link to="/" className="logo" onClick={() => setBuka(false)}>
            PANDE<span>Tempa Pasir Wetan</span>
          </Link>
          <button className="menu-btn" aria-expanded={buka} aria-label="Menu" onClick={() => setBuka(!buka)}>
            {buka ? 'Tutup' : 'Menu'}
          </button>
          <nav className={buka ? 'nav buka' : 'nav'} key={loc.pathname}>
            {MENU.map(([to, label]) => (
              <NavLink key={to} to={to} onClick={() => setBuka(false)}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-in">
          <div>
            <strong>PANDE - Tempa Pasir Wetan</strong>
            <p>Kelompok Pengrajin Pande Besi Gayeng Ruyeng<br />Desa Pasir Wetan, Kec. Karanglewas, Kab. Banyumas, Jawa Tengah</p>
          </div>
          <div className="footer-links">
            <Link to="/aturan">Aturan Pesanan</Link>
            <Link to="/desa">Jelajahi Pasir Wetan</Link>
            <a href={DESA_URL} target="_blank" rel="noreferrer">Website Desa</a>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
