import { Link } from 'react-router-dom'
import { kisaran } from '../lib/format.js'
import { ToolArt } from './ToolArt.jsx'

export function Muat({ state, kosong = 'Belum ada data.', children }) {
  if (state.loading) return <div className="skeleton-grid" aria-label="Memuat">{[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}</div>
  if (state.error) return <p className="alert">{state.error}</p>
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0)) return <p className="empty">{kosong}</p>
  return children(state.data)
}

export function FotoKarya({ k, besar = false }) {
  return (
    <div className={besar ? 'foto besar' : 'foto'}>
      {k.foto_url
        ? <img src={k.foto_url} alt={k.nama} loading="lazy" />
        : <ToolArt kategori={k.kategori} className="foto-art" title={k.nama} />}
    </div>
  )
}

export function KartuKarya({ k, spesifikasi = false }) {
  const spek = spesifikasi ? [
    ['Ukuran', k.ukuran || (k.panjang_mm ? `${k.panjang_mm} mm` : null)],
    ['Bahan', k.baja],
    ['Berat', k.berat_gram ? `${k.berat_gram} g` : null],
  ].filter(([, value]) => value) : []
  return (
    <Link to={`/karya/${k.slug ?? k.id}`} className="card karya">
      <FotoKarya k={k} />
      <div className="card-body">
        <small className="tag">{k.kategori_harga?.label ?? k.kategori}</small>
        <h3>{k.nama}</h3>
        {spek.length > 0 && <dl className="product-brief">{spek.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
        <p className="harga-kecil">{kisaran(k.harga_mulai, k.harga_sampai)}</p>
      </div>
      <span className="card-arrow" aria-hidden="true">→</span>
    </Link>
  )
}

export function Judul({ kecil, children, sub }) {
  return (
    <div className="judul">
      {kecil && <small className="label">{kecil}</small>}
      <h1>{children}</h1>
      {sub && <p className="lead">{sub}</p>}
    </div>
  )
}
