import { Link } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { KartuKarya } from '../components/Ui.jsx'
import { Sparks, Reveal, Counter, Marquee, Stamp } from '../components/Effects.jsx'
import { ToolArt } from '../components/ToolArt.jsx'
import HeroKnife from '../components/HeroKnife.jsx'
import WorkshopValues from '../components/WorkshopValues.jsx'
import OrderJourney from '../components/OrderJourney.jsx'
import HomeCatalog from '../components/HomeCatalog.jsx'
import { SELECT_KARYA } from '../lib/useData.js'
import { DEMO_KARYA } from '../data/demo.js'

export default function Beranda() {
  const unggulan = useData((s) =>
    s.from('karya').select(SELECT_KARYA).eq('unggulan', true).order('created_at', { ascending: false }).limit(6), [],
    () => DEMO_KARYA.filter((k) => k.unggulan).slice(0, 6))
  const pilihan = (unggulan.data ?? []).filter((k) => k.unggulan && k.tampil !== false).slice(0, 6)
  const dampak = useData((s) => s.rpc('dampak'))

  return (
    <>
      {/* HERO */}
      <section className="hero hero-procurement">
        <div className="hero-grid" aria-hidden="true" />
        <Sparks />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="hero-eyebrow">Gayeng Ruyeng <span>Pasir Wetan, Banyumas</span></span>
            <h1>Alat tempa.<br /><em>Sesuai spesifikasi.</em></h1>
            <p className="lead">
              Untuk pertanian, dapur, dan pertukangan. Kirim ukuran, jumlah, dan gambar acuan untuk konfirmasi harga serta waktu pengerjaan.
            </p>
            <div className="actions">
              <Link to="/pesan" className="btn">Ajukan Pesanan <span aria-hidden="true">→</span></Link>
              <Link to="/karya" className="btn ghost">Lihat Produk</Link>
            </div>
            <dl className="hero-specs">
              <div><dt>Pengrajin</dt><dd>20</dd></div>
              <div><dt>Kategori</dt><dd>6</dd></div>
              <div><dt>Bahan</dt><dd>Besi bekas</dd></div>
            </dl>
          </div>
          <div className="hero-art">
            <div className="heat" aria-hidden="true" />
            <HeroKnife />
            <Stamp className="hero-stamp" />
          </div>
        </div>
      </section>

      <Marquee items={['Cangkul', 'Sabit', 'Pisau chef', 'Golok', 'Engsel', 'Palu', 'Garpu rumput', 'Pembuka botol', 'Plakat logam', 'Pesanan khusus']} />

      {/* KATEGORI */}
      <HomeCatalog />

      {pilihan.length > 0 && (
        <section className="wrap section">
          <Reveal className="section-head">
            <span className="label">Referensi produk</span>
            <h2>Spesifikasi & kisaran harga</h2>
            <p className="muted">Harga pesanan custom dikonfirmasi pengrajin. <Link to="/karya">Semua produk →</Link></p>
          </Reveal>
          <div className="grid3">{pilihan.map((k) => <KartuKarya key={k.id} k={k} spesifikasi />)}</div>
        </section>
      )}

      <WorkshopValues />

      {/* PASPOR */}
      <section className="section dark-band">
        <div className="wrap split">
          <Reveal className="split-copy">
            <span className="label on-dark">Paspor produk</span>
            <h2>Identitas & perawatan produk</h2>
            <p>
              Scan QR pada produk untuk melihat data pembuat, bahan, dan petunjuk perawatan.
            </p>
            <ul className="checks">
              <li>Nama pengrajin & tanggal tempa</li>
              <li>Asal & berat besi bekas</li>
              <li>Cara merawat + layanan asah ulang</li>
            </ul>
          </Reveal>
          <Reveal delay={120} className="paspor-mock" aria-hidden="true">
            <div className="pm-head">
              <small>PASPOR PRODUK · PASIR WETAN</small>
              <strong>Pisau Chef 21 cm</strong>
              <span className="mono">PW-7K3QX2A1</span>
            </div>
            <div className="pm-body">
              <ToolArt kategori="dapur" className="pm-art" />
              <dl>
                <dt>Ditempa oleh</dt><dd>Pengrajin Gayeng Ruyeng</dd>
                <dt>Asal besi</dt><dd>Per kendaraan bekas</dd>
                <dt>Besi bekas terpakai</dt><dd>0,45 kg</dd>
              </dl>
              <div className="pm-qr">{Array.from({ length: 49 }, (_, i) => <i key={i} className={(i * 7 + (i % 5)) % 3 ? 'on' : ''} />)}</div>
            </div>
            <p className="pm-note">Contoh tampilan</p>
          </Reveal>
        </div>
      </section>

      {/* ALUR */}
      <OrderJourney />

      {/* DAMPAK */}
      {dampak.data && (
        <section className="wrap section">
          <div className="stats">
            <div className="stat"><b><Counter value={dampak.data.kg_besi_ditempa} decimals={1} /> kg</b><span>besi bekas ditempa</span></div>
            <div className="stat"><b><Counter value={dampak.data.jumlah_barang_berpaspor} /></b><span>barang berpaspor</span></div>
            <div className="stat"><b><Counter value={dampak.data.pesanan_selesai} /></b><span>pesanan terkirim</span></div>
            <div className="stat"><b><Counter value={dampak.data.jumlah_scan} /></b><span>scan paspor</span></div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="wrap section">
        <Reveal className="cta-band">
          <div>
            <h2>Siapkan spesifikasi alatmu.</h2>
            <p>Jenis · ukuran · jumlah · gambar acuan</p>
          </div>
          <Link to="/pesan" className="btn">Ajukan Pesanan <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}
