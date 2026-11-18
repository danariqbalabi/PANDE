import { useState } from 'react'
import { supabase, supabaseSiap } from '../lib/supabase.js'
import { Judul } from '../components/Ui.jsx'
import { STATUS_LABEL, STATUS_URUT } from '../lib/config.js'
import { kisaran, rupiah, tanggal } from '../lib/format.js'

export default function Status() {
  const [kode, setKode] = useState('')
  const [hp4, setHp4] = useState('')
  const [st, setSt] = useState({ loading: false, error: null, data: null })

  async function cari(e) {
    e.preventDefault()
    if (!supabaseSiap) return setSt({ loading: false, error: 'Supabase belum dikonfigurasi.', data: null })
    setSt({ loading: true, error: null, data: null })
    const { data, error } = await supabase.rpc('cek_status', { p_kode: kode, p_hp4: hp4 })
    if (error) return setSt({ loading: false, error: error.message, data: null })
    if (!data?.length) return setSt({ loading: false, error: 'Pesanan tidak ditemukan. Periksa kode dan 4 digit nomor HP.', data: null })
    setSt({ loading: false, error: null, data: data[0] })
  }

  const p = st.data
  const posisi = p ? STATUS_URUT.indexOf(p.status) : -1

  return (
    <div className="wrap section narrow">
      <Judul kecil="Cek status" sub="Masukkan kode pesanan dan 4 digit terakhir nomor WhatsApp yang dipakai saat memesan.">Pantau pesananmu</Judul>
      <form className="form card pad" onSubmit={cari}>
        <div className="row2">
          <label>Kode pesanan<input required value={kode} onChange={(e) => setKode(e.target.value)} placeholder="PSN-XXXXXX" /></label>
          <label>4 digit akhir HP<input required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={hp4} onChange={(e) => setHp4(e.target.value)} /></label>
        </div>
        {st.error && <p className="alert">{st.error}</p>}
        <button className="btn" disabled={st.loading}>{st.loading ? 'Mencari...' : 'Cek Status'}</button>
      </form>

      {p && (
        <div className="card pad">
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
      )}
    </div>
  )
}
