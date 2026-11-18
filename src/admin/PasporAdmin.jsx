import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { supabase } from '../lib/supabase.js'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { SITE_URL } from '../lib/config.js'
import { tanggal } from '../lib/format.js'

const KOSONG = { nama_barang: '', kategori: '', pengrajin_id: '', pesanan_id: '', tgl_tempa: '', asal_besi: 'Per kendaraan bekas', berat_besi_bekas_kg: '', cara_rawat: 'Keringkan setelah dipakai, oles tipis minyak goreng, simpan di tempat kering.' }

export default function PasporAdmin() {
  const [f, setF] = useState(KOSONG)
  const [msg, setMsg] = useState(null)
  const [muatUlang, setMuatUlang] = useState(0)
  const kategori = useData((s) => s.from('kategori_harga').select('kategori, label').order('urutan'))
  const pengrajin = useData((s) => s.from('pengrajin').select('id, nama').order('nama'))
  const pesanan = useData((s) => s.from('pesanan').select('id, kode, jenis').not('status', 'eq', 'dibatalkan').order('created_at', { ascending: false }).limit(100))
  const list = useData((s) => s.from('paspor').select('*').order('created_at', { ascending: false }).limit(100), [muatUlang])
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function simpan(e) {
    e.preventDefault()
    const baris = {
      nama_barang: f.nama_barang, kategori: f.kategori || null, pengrajin_id: f.pengrajin_id || null,
      pesanan_id: f.pesanan_id || null, asal_besi: f.asal_besi || null, cara_rawat: f.cara_rawat || null,
      berat_besi_bekas_kg: f.berat_besi_bekas_kg === '' ? null : Number(f.berat_besi_bekas_kg),
      ...(f.tgl_tempa ? { tgl_tempa: f.tgl_tempa } : {}),
    }
    const { data, error } = await supabase.from('paspor').insert(baris).select('kode').single()
    if (error) return setMsg(error.message)
    setMsg(`Paspor ${data.kode} dibuat. Unduh QR di daftar bawah.`)
    setF(KOSONG)
    setMuatUlang((n) => n + 1)
  }

  return (
    <>
      <form className="form card pad" onSubmit={simpan}>
        <h3>Buat paspor barang</h3>
        <p className="muted">Buat setelah barang lolos cek mutu. Kode QR tidak boleh diubah setelah dicetak.</p>
        <div className="row2">
          <label>Nama barang<input required value={f.nama_barang} onChange={ubah('nama_barang')} /></label>
          <label>Kategori
            <select value={f.kategori} onChange={ubah('kategori')}>
              <option value="">-</option>{kategori.data?.map((k) => <option key={k.kategori} value={k.kategori}>{k.label}</option>)}
            </select>
          </label>
          <label>Pengrajin
            <select value={f.pengrajin_id} onChange={ubah('pengrajin_id')}>
              <option value="">-</option>{pengrajin.data?.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </label>
          <label>Dari pesanan (opsional)
            <select value={f.pesanan_id} onChange={ubah('pesanan_id')}>
              <option value="">-</option>{pesanan.data?.map((p) => <option key={p.id} value={p.id}>{p.kode} - {p.jenis}</option>)}
            </select>
          </label>
          <label>Tanggal tempa<input type="date" value={f.tgl_tempa} onChange={ubah('tgl_tempa')} /></label>
          <label>Berat besi bekas (kg)<input type="number" step="0.01" min={0} value={f.berat_besi_bekas_kg} onChange={ubah('berat_besi_bekas_kg')} /></label>
        </div>
        <label>Asal besi<input value={f.asal_besi} onChange={ubah('asal_besi')} /></label>
        <label>Cara merawat<textarea rows={2} value={f.cara_rawat} onChange={ubah('cara_rawat')} /></label>
        {msg && <p className="muted">{msg}</p>}
        <button className="btn">Buat Paspor</button>
      </form>

      <h3>Paspor terbaru</h3>
      <Muat state={list} kosong="Belum ada paspor.">
        {(rows) => <div className="grid3">{rows.map((p) => <KartuQR key={p.kode} p={p} />)}</div>}
      </Muat>
    </>
  )
}

function KartuQR({ p }) {
  const url = `${SITE_URL}/p/${p.kode}`
  const [img, setImg] = useState(null)
  useEffect(() => { QRCode.toDataURL(url, { margin: 1, width: 600 }).then(setImg) }, [url])
  return (
    <div className="card pad qr">
      {img && <img src={img} alt={`QR ${p.kode}`} />}
      <strong>{p.kode}</strong>
      <span>{p.nama_barang}</span>
      <span className="muted">{tanggal(p.tgl_tempa)}</span>
      <div className="actions">
        {img && <a className="btn kecil" href={img} download={`QR-${p.kode}.png`}>Unduh QR</a>}
        <a className="btn ghost kecil" href={url} target="_blank" rel="noreferrer">Buka</a>
      </div>
    </div>
  )
}
