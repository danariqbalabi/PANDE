import { Link } from 'react-router-dom'
import { Reveal } from './Effects.jsx'
import { ChefKnife } from './ToolArt.jsx'

export default function WorkshopValues() {
  return (
    <section className="wrap section workshop-values" aria-labelledby="workshop-title">
      <div className="workshop-heading">
        <span className="workshop-index">01 / DARI BENGKEL KAMI</span>
        <h2 id="workshop-title">Ada tangan manusia<br />di setiap <em>hasilnya.</em></h2>
        <p>Ukuranmu. Pilihan bahanmu.<br />Dikerjakan di Pasir Wetan.</p>
      </div>
      <div className="workshop-panels">
        <Reveal className="workshop-panel workshop-custom">
          <div className="workshop-panel-top"><span>01 — SESUAI KEBUTUHAN</span><span aria-hidden="true">↗</span></div>
          <div className="workshop-drawing" aria-hidden="true">
            <span className="drawing-note">Dari sketsa, jadi nyata.</span>
            <div className="drawing-knife"><ChefKnife /></div>
            <svg className="drawing-measures" viewBox="0 0 500 220" fill="none">
              <path d="M38 175H461 M38 166V184 M461 166V184 M178 56V157" stroke="currentColor" strokeWidth="1" />
              <path d="M38 172L44 175L38 178 M461 172L455 175L461 178" stroke="currentColor" />
              <path d="M280 45H385L418 78" stroke="currentColor" strokeDasharray="3 4" />
              <circle cx="418" cy="78" r="3" stroke="currentColor" />
              <text x="250" y="199" textAnchor="middle" fill="currentColor" stroke="none" fontSize="10" letterSpacing="2">UKURAN SESUAI PESANAN</text>
            </svg>
            <span className="drawing-corner">GAMBAR KERJA / PANDE</span>
          </div>
          <div className="workshop-panel-copy">
            <h3>Bukan sekadar<br />pilih dari rak.</h3>
            <p>Kirim foto atau sketsa. Bentuk, ukuran, dan gagang dibicarakan langsung dengan pengrajin.</p>
            <Link className="workshop-link" to="/pesan">Bicarakan idemu <span aria-hidden="true">↗</span></Link>
          </div>
          <span className="workshop-fastener fastener-tl" aria-hidden="true" />
          <span className="workshop-fastener fastener-br" aria-hidden="true" />
        </Reveal>

        <Reveal delay={90} className="workshop-panel workshop-material">
          <div className="workshop-panel-top"><span>02 — BAHAN & ASALNYA</span><span aria-hidden="true">↙</span></div>
          <div className="material-content">
            <div className="material-stack" aria-hidden="true"><i /><i /><i /><span>Fe</span></div>
            <div className="workshop-panel-copy">
              <h3>Besi lama.<br />Guna baru.</h3>
              <p>Baja per kendaraan bekas ditempa kembali. Asal bahan dan beratnya dicatat pada paspor produk.</p>
            </div>
          </div>
          <div className="material-footer"><span>BAHAN BEKAS → ALAT KERJA</span><span aria-hidden="true">↻</span></div>
        </Reveal>

        <Reveal delay={180} className="workshop-panel workshop-story">
          <div className="workshop-panel-top"><span>03 — KENALI PEMBUATNYA</span><span aria-hidden="true">↗</span></div>
          <div className="story-content">
            <div className="workshop-panel-copy">
              <h3>Ada nama<br />di balik bilah.</h3>
              <p>Scan paspornya. Kenali pengrajinnya, baca asal bahannya, dan simpan cara merawatnya.</p>
              <Link className="workshop-link" to="/pengrajin">Temui pengrajinnya <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="workshop-tag" aria-hidden="true">
              <span className="tag-hole" /><small>DITEMPA DI</small><strong>PASIR<br />WETAN</strong><span className="tag-lines" /><small>PASPOR PRODUK</small>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="workshop-colophon"><span>PANDE — TEMPA PASIR WETAN</span><span>DIBUAT DENGAN TANGAN, UNTUK DIPAKAI.</span></div>
    </section>
  )
}
