import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { STATUS_LABEL } from '../lib/config.js'
import { kisaran, tanggal } from '../lib/format.js'

export default function PesananAdmin() {
  const [filter, setFilter] = useState('aktif')
  const [muatUlang, setMuatUlang] = useState(0)
  const pengrajin = useData((s) => s.from('pengrajin').select('id, nama').order('nama'))
  const state = useData((s) => {
    let q = s.from('pesanan').select('*, kategori_harga(label)').order('created_at', { ascending: false }).limit(200)
    if (filter === 'aktif') q = q.not('status', 'in', '(selesai,dibatalkan)')
    else if (filter !== 'semua') q = q.eq('status', filter)
    return q
  }, [filter, muatUlang])

  return (
    <>
      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="aktif">Pesanan aktif</option>
          <option value="semua">Semua</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn ghost kecil" onClick={() => setMuatUlang((n) => n + 1)}>Muat ulang</button>
      </div>
      <Muat state={state} kosong="Tidak ada pesanan.">
        {(list) => list.map((p) => <Baris key={p.id} p={p} pengrajin={pengrajin.data ?? []} />)}
      </Muat>
    </>
  )
}

function Baris({ p, pengrajin }) {
  const [f, setF] = useState({ status: p.status, harga_final: p.harga_final ?? '', dp: p.dp ?? '', pengrajin_id: p.pengrajin_id ?? '' })
  const [msg, setMsg] = useState(null)
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const hp = p.no_hp.startsWith('0') ? '62' + p.no_hp.slice(1) : p.no_hp

  async function simpan() {
    const { error } = await supabase.from('pesanan').update({
      status: f.status,
      harga_final: f.harga_final === '' ? null : Number(f.harga_final),
      dp: f.dp === '' ? null : Number(f.dp),
      pengrajin_id: f.pengrajin_id || null,
    }).eq('id', p.id)
    setMsg(error ? error.message : 'Tersimpan')
  }

  return (
    <div className="card pad baris">
      <div className="baris-head">
        <strong>{p.kode}</strong>
        <span className="tag">{p.kategori_harga?.label}</span>
        <span className="muted">{tanggal(p.created_at)}</span>
      </div>
      <p><b>{p.jenis}</b> x{p.jumlah}{p.ukuran ? ` - ${p.ukuran}` : ''}</p>
      {p.catatan && <p className="muted">{p.catatan}</p>}
      <p>{p.nama}{p.instansi ? ` (${p.instansi})` : ''} - <a href={`https://wa.me/${hp}`} target="_blank" rel="noreferrer">{p.no_hp}</a></p>
      <p className="muted">Perkiraan awal: {kisaran(p.estimasi_min, p.estimasi_max)}</p>
      <div className="row4">
        <label>Status
          <select value={f.status} onChange={ubah('status')}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label>Harga final<input type="number" min={0} value={f.harga_final} onChange={ubah('harga_final')} /></label>
        <label>DP<input type="number" min={0} value={f.dp} onChange={ubah('dp')} /></label>
        <label>Pengrajin
          <select value={f.pengrajin_id} onChange={ubah('pengrajin_id')}>
            <option value="">-</option>
            {pengrajin.map((x) => <option key={x.id} value={x.id}>{x.nama}</option>)}
          </select>
        </label>
      </div>
      <button className="btn kecil" onClick={simpan}>Simpan</button> {msg && <span className="muted">{msg}</span>}
    </div>
  )
}
