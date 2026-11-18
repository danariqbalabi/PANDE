import { Link } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { KATEGORI } from '../lib/config.js'
import { KartuKarya } from '../components/Ui.jsx'
import { Sparks, Reveal, Counter, Marquee, Stamp } from '../components/Effects.jsx'
import { ToolArt } from '../components/ToolArt.jsx'
import HeroKnife from '../components/HeroKnife.jsx'
import WorkshopValues from '../components/WorkshopValues.jsx'
import OrderJourney from '../components/OrderJourney.jsx'
import { SELECT_KARYA } from '../lib/useData.js'
import { DEMO_KARYA } from '../data/demo.js'

export default function Beranda() {
  const unggulan = useData((s) =>
    s.from('karya').select(SELECT_KARYA).eq('unggulan', true).order('created_at', { ascending: false }).limit(6), [],
    () => DEMO_KARYA.filter((k) => k.unggulan).slice(0, 6))
  const dampak = useData((s) => s.rpc('dampak'))

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <Sparks />
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="label on-dark"><i className="dot" /> Pande besi · Desa Pasir Wetan, Banyumas</span>
            <h1>Pesan apa saja<br />dari <em>besi.</em></h1>
            <p className="lead">
              Alat tani, perkakas, pisau dapur, engsel, sampai suvenir. Ditempa dari <b>besi bekas</b> oleh
              20 pengrajin Gayeng Ruyeng, dan setiap barang membawa nama desanya.
            </p>
            <div className="actions">
              <Link to="/pesan" className="btn">Pesan Sekarang <span aria-hidden="true">→</span></Link>
              <Link to="/karya" className="btn ghost">Lihat Karya</Link>
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

      {/* NILAI */}
      <WorkshopValues />

      {/* KATEGORI */}
      <section className="section band">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="label">Katalog</span>
            <h2>Apa yang bisa ditempa</h2>
            <p className="muted">Enam kategori, satu bengkel. Pilih kategori atau minta dibuatkan sesuai gambar.</p>
          </Reveal>
          <div className="kategori-grid">
            {KATEGORI.map((k, i) => (
              <Reveal key={k.kategori} delay={i * 60}>
                <Link to={k.kategori === 'khusus' ? '/pesan?kategori=khusus' : `/karya?kategori=${k.kategori}`} className="kategori">
                  <span className="kategori-no">{String(i + 1).padStart(2, '0')}</span>
                  <ToolArt kategori={k.kategori} className="kategori-art" title={k.label} />
                  <h3>{k.label}</h3>
                  <p>{k.desc}</p>
                  <span className="kategori-go">Lihat <span aria-hidden="true">→</span></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {unggulan.data?.length > 0 && (
        <section className="wrap section">
          <Reveal className="section-head">
            <span className="label">Karya pilihan</span>
            <h2>Dari bengkel Gayeng Ruyeng</h2>
            <p className="muted">Produk asli dari katalog kelompok. <Link to="/karya">Lihat semua koleksi →</Link></p>
          </Reveal>
          <div className="grid3">{unggulan.data.map((k) => <KartuKarya key={k.id} k={k} />)}</div>
        </section>
      )}

      {/* PASPOR */}
      <section className="section dark-band">
        <div className="wrap split">
          <Reveal className="split-copy">
            <span className="label on-dark">Paspor produk</span>
            <h2>Setiap bilah bercerita.</h2>
            <p>
              Di Solingen, sejak 1571 setiap bilah bertuliskan nama kotanya. Di Pasir Wetan, setiap barang dicap
              <b> PASIR WETAN</b> dan diberi QR. Scan, dan kamu tahu siapa yang menempanya, berapa kilogram besi bekas
              yang diselamatkan, dan apa lagi yang bisa ditemukan di desa ini.
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
                <dt>Besi diselamatkan</dt><dd>0,45 kg</dd>
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
            <h2>Punya gambar barang besi?</h2>
            <p>Kirim sketsanya. Kami hitung, kami tempa, kami kirim.</p>
          </div>
          <Link to="/pesan" className="btn">Mulai Pesan <span aria-hidden="true">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}
