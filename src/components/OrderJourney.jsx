import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Anvil, ChefKnife } from './ToolArt.jsx'

const STEPS = [
  { label: 'Kirim spesifikasi', drawing: 0, note: 'KEBUTUHAN ALAT', text: 'Isi jenis, ukuran, dan jumlah. Kirim gambar acuan lewat WhatsApp.', fields: ['Fungsi alat', 'Ukuran & jumlah', 'Foto / sketsa'], mark: 'SPESIFIKASI' },
  { label: 'Konfirmasi harga & DP', drawing: 1, note: 'PERSETUJUAN SEBELUM PRODUKSI', text: 'Sepakati harga dan waktu pengerjaan dengan pengrajin, lalu konfirmasikan DP.', fields: ['Harga final', 'Waktu pengerjaan', 'Konfirmasi DP'], mark: 'KESEPAKATAN' },
  { label: 'Produksi', drawing: 3, note: 'PENGERJAAN DI BENGKEL', text: 'Alat ditempa, dirapikan, dan dicek sesuai spesifikasi yang disepakati.', fields: ['Pembentukan', 'Finishing', 'Pengecekan mutu'], mark: 'PENGERJAAN' },
  { label: 'Pengiriman', drawing: 4, note: 'SETELAH LOLOS PENGECEKAN', text: 'Barang diberi identitas dan paspor QR, lalu dikemas untuk pengiriman.', fields: ['Identitas produk', 'Paspor QR', 'Pengemasan'], mark: 'PENGIRIMAN' },
  { label: 'Perawatan & servis', drawing: 5, note: 'LAYANAN SETELAH PEMBELIAN', text: 'Scan paspor untuk panduan perawatan atau hubungi layanan asah dan perbaikan.', fields: ['Panduan perawatan', 'Asah ulang', 'Perbaikan'], mark: 'PURNA JUAL' },
]

export function ProcessDrawing({ step }) {
  if (step === 3) return <div className="journey-anvil"><Anvil /><span className="forge-spark spark-one" /><span className="forge-spark spark-two" /><span className="forge-spark spark-three" /></div>
  if (step === 5) return <div className="journey-care"><ChefKnife /><span className="care-orbit" /><span className="care-caption">RAWAT & PAKAI LAGI ↻</span></div>
  return (
    <svg viewBox="0 0 320 200" className="journey-drawing" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {step === 0 && <>
        <path d="M60 33H224L249 58V166H60Z" fill="#f9f5ed" /><path d="M224 33V58H249 M77 51H115 M77 58H99" />
        <path d="M84 114L124 109L125 122L85 126Z M125 108L216 94Q203 120 126 123Z" fill="#dbd6c8" /><path d="M82 143H219 M82 138V148 M219 138V148" strokeDasharray="2 3" />
        <path d="M225 126L264 54L273 59L234 131L222 139Z" fill="#c96a3d" /><path d="M225 126L234 131 M264 54L273 59" />
      </>}
      {step === 1 && <>
        <path d="M94 25H227V174L218 168L208 174L198 168L188 174L178 168L168 174L158 168L148 174L138 168L128 174L118 168L108 174L94 168Z" fill="#f9f5ed" />
        <path d="M113 49H174 M113 58H151 M112 79H177 M195 79H210 M112 99H167 M195 99H210 M112 119H180 M195 119H210 M112 136H210" strokeDasharray="3 3" />
        <path d="M168 151H210" strokeWidth="4" stroke="#b24a0e" /><circle cx="84" cy="125" r="24" fill="#e5dccb" /><path d="M74 125H94 M84 115V135" />
      </>}
      {step === 2 && <>
        <rect x="62" y="64" width="169" height="93" rx="5" fill="#d4d6c5" transform="rotate(-9 62 64)" /><path d="M75 85L217 63" strokeWidth="11" />
        <path d="M120 67H256V164H120Z" fill="#f9f5ed" /><path d="M120 90H256 M136 78H163 M136 111H197 M136 124H182" /><circle cx="225" cy="138" r="26" fill="#c96a3d" /><path d="M213 138L221 146L238 129" stroke="#fff8ea" strokeWidth="3" />
      </>}
      {step === 4 && <>
        <path d="M71 72L166 43L253 77L158 108Z" fill="#e4d2b5" /><path d="M71 72V142L158 179V108 M158 179L253 147V77" fill="#c3a37b" /><path d="M158 108L253 77 M158 108V179 M71 72L158 108" />
        <path d="M116 58L206 92V118L187 125V99L97 65Z" fill="#f6edda" /><path d="M184 129L232 113V141L184 158Z" fill="#f9f5ed" /><path d="M194 134L222 125 M194 140L213 134" />
        <path d="M53 155H98 M47 166H80" stroke="#b24a0e" />
      </>}
    </svg>
  )
}

export default function OrderJourney() {
  const [active, setActive] = useState(0)
  const uid = useId()
  const step = STEPS[active]
  return (
    <section className="wrap section order-journey" aria-labelledby={`${uid}-title`}>
      <header className="journey-heading">
        <div><span className="workshop-index">02 / CARA PESAN</span><h2 id={`${uid}-title`}>Alur pemesanan</h2></div>
        <p>Spesifikasi → Harga & DP → Produksi → Kirim → Servis</p>
      </header>
      <div className="journey-layout">
        <div className="journey-preview" aria-hidden="true">
          <div className="journey-paper">
            <div className="journey-paper-head"><span>PANDE / CATATAN PESANAN</span><span>↗</span></div>
            <div key={active} className="journey-paper-body">
              <div className="journey-paper-title"><span>TAHAP</span><strong>{String(active + 1).padStart(2, '0')}</strong><span>/ {String(STEPS.length).padStart(2, '0')}</span></div>
              <ProcessDrawing step={step.drawing} />
              <span className="journey-paper-note">{step.note}</span>
              <div className="journey-field-list">{step.fields.map((field) => <div key={field}><i />{field}</div>)}</div>
              <span className="journey-ink-stamp">{step.mark}</span>
            </div>
            <div className="journey-paper-foot"><span>PASIR WETAN, BANYUMAS</span><span>•••</span></div>
          </div>
        </div>
        <div className="journey-ledger">
          <div className="journey-ledger-head"><span>URUTAN PENGERJAAN</span><span>KLIK UNTUK LIHAT DETAIL ↓</span></div>
          <ol className="journey-steps">
            {STEPS.map((item, i) => <li key={item.label} className={i === active ? 'is-current' : ''}>
              <button type="button" id={`${uid}-step-${i}`} aria-expanded={active === i} aria-controls={`${uid}-detail-${i}`} onClick={() => setActive(i)}>
                <span className="journey-step-no">{String(i + 1).padStart(2, '0')}</span><span className="journey-step-label">{item.label}</span><span className="journey-step-icon" aria-hidden="true">{active === i ? '−' : '+'}</span>
              </button>
              <div id={`${uid}-detail-${i}`} role="region" aria-labelledby={`${uid}-step-${i}`} hidden={active !== i}>
                <p>{item.text}</p>
                {i === 0 && <Link className="journey-start" to="/pesan">Ajukan pesanan <span aria-hidden="true">↗</span></Link>}
              </div>
            </li>)}
          </ol>
          <div className="journey-navigation"><span>{String(active + 1).padStart(2, '0')} <span>/ {String(STEPS.length).padStart(2, '0')}</span></span><div><button type="button" disabled={active === 0} onClick={() => setActive((n) => n - 1)} aria-label="Lihat tahap sebelumnya">←</button><button type="button" disabled={active === STEPS.length - 1} onClick={() => setActive((n) => n + 1)} aria-label="Lihat tahap berikutnya">→</button></div></div>
        </div>
      </div>
      <footer className="journey-bottom"><span>ALAT KERJA · RUMAH TANGGA · DEKORASI</span><Link to="/aturan">Baca aturan pesanan ↗</Link></footer>
    </section>
  )
}
