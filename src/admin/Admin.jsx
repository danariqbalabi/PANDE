import { useEffect, useState } from 'react'
import { supabase, supabaseSiap } from '../lib/supabase.js'
import PesananAdmin from './PesananAdmin.jsx'
import PasporAdmin from './PasporAdmin.jsx'
import KaryaAdmin from './KaryaAdmin.jsx'
import { PengrajinAdmin, SetoranAdmin, KategoriAdmin } from './DataAdmin.jsx'
import Kalkulator from './Kalkulator.jsx'

const TAB = {
  pesanan: ['Pesanan', PesananAdmin],
  paspor: ['Paspor & QR', PasporAdmin],
  karya: ['Karya', KaryaAdmin],
  pengrajin: ['Pengrajin', PengrajinAdmin],
  setoran: ['Setoran Besi', SetoranAdmin],
  kategori: ['Kategori & Harga', KategoriAdmin],
  kalkulator: ['Kalkulator', Kalkulator],
}

export default function Admin() {
  const [sesi, setSesi] = useState(undefined)
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('pesanan')

  useEffect(() => {
    if (!supabaseSiap) return
    supabase.auth.getSession().then(({ data }) => setSesi(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSesi(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!sesi) return setAdmin(null)
    supabase.rpc('is_admin').then(({ data }) => setAdmin(Boolean(data)))
  }, [sesi])

  if (!supabaseSiap) return <div className="wrap section"><p className="alert">Supabase belum dikonfigurasi.</p></div>
  if (sesi === undefined) return <div className="wrap section"><p className="muted">Memuat...</p></div>
  if (!sesi) return <Login />
  if (admin === null) return <div className="wrap section"><p className="muted">Memeriksa akses...</p></div>
  if (!admin) {
    return (
      <div className="wrap section narrow">
        <p className="alert">Akun {sesi.user.email} belum terdaftar sebagai admin. Minta pengelola menambahkan user ID berikut ke tabel <code>admins</code>:</p>
        <p className="kode kecil">{sesi.user.id}</p>
        <button className="btn ghost" onClick={() => supabase.auth.signOut()}>Keluar</button>
      </div>
    )
  }

  const Komponen = TAB[tab][1]
  return (
    <div className="wrap section">
      <div className="admin-head">
        <h1>Admin PANDE</h1>
        <button className="btn ghost kecil" onClick={() => supabase.auth.signOut()}>Keluar</button>
      </div>
      <div className="chips">
        {Object.entries(TAB).map(([k, [label]]) => (
          <button key={k} className={tab === k ? 'chip on' : 'chip'} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <Komponen />
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  async function masuk(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    setErr(error?.message ?? null)
  }
  return (
    <div className="wrap section narrow">
      <h1>Masuk Admin</h1>
      <form className="form card pad" onSubmit={masuk}>
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
        <label>Kata sandi<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {err && <p className="alert">{err}</p>}
        <button className="btn" disabled={loading}>{loading ? 'Masuk...' : 'Masuk'}</button>
      </form>
    </div>
  )
}
