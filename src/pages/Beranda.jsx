import { Link } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { KartuKarya } from '../components/Ui.jsx'

const ALUR = [
  ['Pesan', 'Ceritakan barang yang kamu mau: jenis, ukuran, jumlah.'],
  ['Estimasi', 'Dapat kisaran harga, lalu kirim foto/sketsa lewat WhatsApp.'],
  ['DP', 'Harga final dikonfirmasi pengrajin, bayar DP.'],
  ['Ditempa', 'Pengrajin menempa dari besi bekas. Kamu dapat foto prosesnya.'],
  ['Dikirim', 'Barang bercap PASIR WETAN dengan QR paspor.'],
  ['Purna jual', 'Scan QR untuk servis, asah ulang, atau pesan lagi.'],
]

export default function Beranda() {
  const kategori = useData((s) => s.from('kategori_harga').select('*').order('urutan'))
  const unggulan = useData((s) =>
    s.from('karya').select('*, kategori_harga(label)').eq('unggulan', true).order('created_at', { ascending: false }).limit(6))

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <small className="eyebrow">Pande besi Desa Pasir Wetan, Banyumas</small>
          <h1>Pesan apa saja dari besi.</h1>
          <p className="lead">
            Alat tani, perkakas, pisau dapur, engsel, hiasan, sampai suvenir: ditempa dari <strong>besi bekas</strong> oleh
            20 pengrajin Gayeng Ruyeng. Setiap barang membawa nama desanya dan menceritakan siapa pembuatnya.
          </p>
          <div className="actions">
            <Link to="/pesan" className="btn">Pesan Sekarang</Link>
            <Link to="/karya" className="btn ghost">Lihat Karya</Link>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid3">
          <div className="card pad"><h3>Dibuat sesuai pesanan</h3><p>Kirim foto atau sketsa. Pengrajin terbiasa bekerja dengan ukuran dan gambar teknik.</p></div>
          <div className="card pad"><h3>Dari besi bekas</h3><p>Bilah per kendaraan dan besi setoran bank sampah diberi hidup baru. Berat besinya tercatat.</p></div>
          <div className="card pad"><h3>Setiap bilah bercerita</h3><p>QR paspor di setiap barang: pengrajin, asal besi, cara merawat, dan cerita Desa Pasir Wetan.</p></div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Apa yang bisa ditempa</h2>
        {kategori.data && (
          <div className="chips">
            {kategori.data.map((k) => (
              <Link key={k.kategori} className="chip" to={`/karya?kategori=${k.kategori}`}>{k.label}</Link>
            ))}
          </div>
        )}
      </section>

      {unggulan.data?.length > 0 && (
        <section className="wrap section">
          <h2>Karya pilihan</h2>
          <div className="grid3">{unggulan.data.map((k) => <KartuKarya key={k.id} k={k} />)}</div>
        </section>
      )}

      <section className="wrap section">
        <h2>Cara pesan</h2>
        <ol className="alur">
          {ALUR.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
        </ol>
        <p className="muted">Kami hanya menerima pesanan alat kerja, perlengkapan rumah tangga, dan dekorasi. <Link to="/aturan">Baca aturan pesanan</Link>.</p>
      </section>
    </>
  )
}
