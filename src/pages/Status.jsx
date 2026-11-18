import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import OrderScanner from '../components/OrderScanner.jsx'
import { orderCodeFromScan } from '../lib/scanCode.js'
import { supabase, supabaseSiap } from '../lib/supabase.js'
import PageIntro from '../components/PageIntro.jsx'
import { STATUS_LABEL, STATUS_URUT } from '../lib/config.js'
import { kisaran, rupiah, tanggal, waLink } from '../lib/format.js'

export default function Status() {
  const [params] = useSearchParams()
  const [kode, setKode] = useState(() => orderCodeFromScan(params.get('kode')) || '')
  const [hp4, setHp4] = useState('')
  const [st, setSt] = useState({ loading: false, error: null, data: null })

  async function cari(e) {
    e.preventDefault()
    if (!supabaseSiap) return setSt({ loading: false, error: 'Pelacakan online belum tersedia. Hubungi pengelola melalui tautan bantuan.', data: null })
    setSt({ loading: true, error: null, data: null })
    const { data, error } = await supabase.rpc('cek_status', { p_kode: kode, p_hp4: hp4 })
    if (error) return setSt({ loading: false, error: error.message, data: null })
    if (!data?.length) return setSt({ loading: false, error: 'Pesanan tidak ditemukan. Periksa kode dan 4 digit nomor HP.', data: null })
    setSt({ loading: false, error: null, data: data[0] })
  }

  const p = st.data
  const posisi = p ? STATUS_URUT.indexOf(p.status) : -1
  const bantuan = waLink('Halo PANDE, saya membutuhkan bantuan untuk mengecek kode pesanan.')

  return (
    <>
      <PageIntro code="04 / CEK STATUS" title="Lacak pengerjaan alat" description="Gunakan kode pesanan dan 4 digit terakhir nomor WhatsApp saat memesan."
        meta={[["Kode pesanan", 'PSN-XXXXXX'], ['Verifikasi', '4 digit akhir HP']]} />
      <div className="wrap status-workspace">
      <aside className="status-guide">
        <span className="workshop-index">PANDUAN PELACAKAN</span>
        <h2>Siapkan kode pesanan.</h2>
        <OrderScanner onRead={(code) => { setKode(code); setSt({ loading: false, error: null, data: null }) }} />
        {bantuan && <a href={bantuan} target="_blank" rel="noreferrer" className="navpage-text-link">Bantuan kode pesanan ↗</a>}
        <Link to="/cara-kerja" className="navpage-text-link">Lihat alur pengerjaan ↗</Link>
      </aside>
      <section className="status-docket" aria-label="Pencarian pesanan">
      <div className="status-docket-head"><span>PANDE / LEMBAR PELACAKAN</span><span>01 — VERIFIKASI</span></div>
      <form className="form" onSubmit={cari} aria-busy={st.loading}>
        <div className="row2">
          <label>Kode pesanan<input required autoCapitalize="characters" spellCheck={false} maxLength={32} value={kode} onChange={(e) => setKode(e.target.value.toUpperCase())} placeholder="PSN-XXXXXX" /></label>
          <label>4 digit akhir HP<input required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={hp4} onChange={(e) => setHp4(e.target.value.replace(/\D/g, ''))} placeholder="1234" /></label>
        </div>
        {st.error && <p className="alert" role="alert">{st.error}</p>}
        <button className="btn" disabled={st.loading}>{st.loading ? 'Mencari...' : 'Cek Status'}</button>
      </form>

      <div aria-live="polite">
      {p ? (
        <div className="status-result">
          <h3>{p.kode}: {p.jenis} ({p.jumlah})</h3>
          {p.status === 'dibatalkan'
            ? <p className="alert">Pesanan dibatalkan.</p>
            : (
              <ol className="langkah">
                {STATUS_URUT.map((s, i) => <li key={s} className={i <= posisi ? 'done' : ''}>{STATUS_LABEL[s]}</li>)}
              </ol>
            )}
          <dl className="dl">
            <dt>Perkiraan awal</dt><dd>{kisaran(p.estimasi_min, p.estimasi_max)}</dd>
            <dt>Harga final</dt><dd>{rupiah(p.harga_final)}</dd>
            <dt>DP</dt><dd>{rupiah(p.dp)}</dd>
            <dt>Diperbarui</dt><dd>{tanggal(p.updated_at)}</dd>
          </dl>
        </div>
      ) : !st.error && <div className="status-awaiting"><span aria-hidden="true">⌁</span><p>{st.loading ? 'Memeriksa pesanan…' : 'Tahap produksi dan rincian biaya tampil setelah verifikasi.'}</p></div>}
      </div>
      </section>
      </div>
    </>
  )
}
