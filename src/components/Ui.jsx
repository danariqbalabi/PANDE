import { Link } from 'react-router-dom'
import { kisaran } from '../lib/format.js'

export function Muat({ state, kosong = 'Belum ada data.', children }) {
  if (state.loading) return <p className="muted">Memuat...</p>
  if (state.error) return <p className="alert">{state.error}</p>
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0)) return <p className="muted">{kosong}</p>
  return children(state.data)
}

export function KartuKarya({ k }) {
  return (
    <Link to={`/karya/${k.id}`} className="card karya">
      <div className="foto">{k.foto_url ? <img src={k.foto_url} alt={k.nama} loading="lazy" /> : <span>PANDE</span>}</div>
      <div className="card-body">
        <small className="tag">{k.kategori_harga?.label ?? k.kategori}</small>
        <h3>{k.nama}</h3>
        <p className="muted">{kisaran(k.harga_mulai, k.harga_sampai)}</p>
      </div>
    </Link>
  )
}

export function Judul({ kecil, children, sub }) {
  return (
    <div className="judul">
      {kecil && <small>{kecil}</small>}
      <h1>{children}</h1>
      {sub && <p className="lead">{sub}</p>}
    </div>
  )
}
