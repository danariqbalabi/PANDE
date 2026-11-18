import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap section narrow">
      <h1>Halaman tidak ditemukan</h1>
      <p><Link to="/">Kembali ke beranda</Link></p>
    </div>
  )
}
