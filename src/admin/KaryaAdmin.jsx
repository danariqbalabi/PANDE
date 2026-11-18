import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { kisaran } from '../lib/format.js'
import { JENIS, FINISHING } from '../lib/config.js'
import { unggahFoto } from './upload.js'

const KOSONG = { nama: '', kategori: '', deskripsi: '', ukuran: '', harga_mulai: '', harga_sampai: '', pengrajin_id: '', unggulan: false,
  jenis: '', finishing: '', panjang_mm: '', berat_gram: '', baja: 'Baja per kendaraan bekas', gagang: '', pengasah_id: '' }

export default function KaryaAdmin() {
  const [f, setF] = useState(KOSONG)
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState(null)
  const [sibuk, setSibuk] = useState(false)
  const [muatUlang, setMuatUlang] = useState(0)
  const kategori = useData((s) => s.from('kategori_harga').select('kategori, label').order('urutan'))
  const pengrajin = useData((s) => s.from('pengrajin').select('id, nama').order('nama'))
  const list = useData((s) => s.from('karya').select('*, kategori_harga(label)').order('created_at', { ascending: false }), [muatUlang])
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const angka = (v) => (v === '' ? null : Number(v))

  async function simpan(e) {
    e.preventDefault()
    setSibuk(true)
    try {
      const foto_url = file ? await unggahFoto(file, 'karya') : null
      const { error } = await supabase.from('karya').insert({
        nama: f.nama, slug: f.nama.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36).slice(-4),
        kategori: f.kategori, deskripsi: f.deskripsi || null, ukuran: f.ukuran || null,
        harga_mulai: angka(f.harga_mulai), harga_sampai: angka(f.harga_sampai),
        pengrajin_id: f.pengrajin_id || null, unggulan: f.unggulan, foto_url,
        jenis: f.jenis || null, finishing: f.finishing || null, panjang_mm: angka(f.panjang_mm), berat_gram: angka(f.berat_gram),
        baja: f.baja.trim() || null, gagang: f.gagang.trim() || null, pengasah_id: f.pengasah_id || null,
      })
      if (error) throw error
      setMsg('Karya ditambahkan.')
      setF(KOSONG); setFile(null); setMuatUlang((n) => n + 1)
    } catch (err) {
      setMsg(err.message)
    } finally {
      setSibuk(false)
    }
  }

  async function ubahBaris(id, nilai) {
    const { error } = await supabase.from('karya').update(nilai).eq('id', id)
    if (error) alert(error.message); else setMuatUlang((n) => n + 1)
  }
  async function hapus(id) {
    if (!confirm('Hapus karya ini dari katalog?')) return
    const { error } = await supabase.from('karya').delete().eq('id', id)
    if (error) alert(error.message); else setMuatUlang((n) => n + 1)
  }

  return (
    <>
      <form className="form card pad" onSubmit={simpan}>
        <h3>Tambah karya ke katalog</h3>
        <div className="row2">
          <label>Nama<input required value={f.nama} onChange={ubah('nama')} /></label>
          <label>Kategori
            <select required value={f.kategori} onChange={(e) => setF({ ...f, kategori: e.target.value, jenis: '' })}>
              <option value="">Pilih</option>{kategori.data?.map((k) => <option key={k.kategori} value={k.kategori}>{k.label}</option>)}
            </select>
          </label>
          <label>Harga mulai<input type="number" min={0} value={f.harga_mulai} onChange={ubah('harga_mulai')} /></label>
          <label>Harga sampai<input type="number" min={0} value={f.harga_sampai} onChange={ubah('harga_sampai')} /></label>
          <label>Ukuran<input value={f.ukuran} onChange={ubah('ukuran')} /></label>
          <label>Pengrajin
            <select value={f.pengrajin_id} onChange={ubah('pengrajin_id')}>
              <option value="">-</option>{pengrajin.data?.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </label>
          <label>Jenis
            <select value={f.jenis} onChange={ubah('jenis')} disabled={!f.kategori}>
              <option value="">-</option>{JENIS.filter((j) => j.kategori === f.kategori).map((j) => <option key={j.id} value={j.id}>{j.label}</option>)}
            </select>
          </label>
          <label>Finishing
            <select value={f.finishing} onChange={ubah('finishing')}>
              <option value="">-</option>{FINISHING.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select>
          </label>
          <label>Panjang bilah (mm)<input type="number" min={0} value={f.panjang_mm} onChange={ubah('panjang_mm')} /></label>
          <label>Berat (gram)<input type="number" min={0} value={f.berat_gram} onChange={ubah('berat_gram')} /></label>
          <label>Baja / bahan<input value={f.baja} onChange={ubah('baja')} /></label>
          <label>Gagang<input value={f.gagang} onChange={ubah('gagang')} placeholder="mis. Kayu sonokeling" /></label>
          <label>Pengasah
            <select value={f.pengasah_id} onChange={ubah('pengasah_id')}>
              <option value="">-</option>{pengrajin.data?.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </label>
        </div>
        <label>Deskripsi<textarea rows={2} value={f.deskripsi} onChange={ubah('deskripsi')} /></label>
        <label>Foto (JPG/PNG/WEBP, maks 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0] ?? null)} /></label>
        <label className="check"><input type="checkbox" checked={f.unggulan} onChange={ubah('unggulan')} /><span>Tampilkan di beranda (unggulan)</span></label>
        {msg && <p className="muted">{msg}</p>}
        <button className="btn" disabled={sibuk}>{sibuk ? 'Menyimpan...' : 'Simpan Karya'}</button>
      </form>

      <Muat state={list} kosong="Katalog masih kosong.">
        {(rows) => (
          <div className="tabel">
            {rows.map((k) => (
              <div key={k.id} className="tabel-baris">
                <span><b>{k.nama}</b><br /><small className="muted">{k.kategori_harga?.label} - {kisaran(k.harga_mulai, k.harga_sampai)}</small></span>
                <label className="check"><input type="checkbox" checked={k.tampil} onChange={(e) => ubahBaris(k.id, { tampil: e.target.checked })} /><span>Tampil</span></label>
                <label className="check"><input type="checkbox" checked={k.unggulan} onChange={(e) => ubahBaris(k.id, { unggulan: e.target.checked })} /><span>Unggulan</span></label>
                <button className="btn ghost kecil" onClick={() => hapus(k.id)}>Hapus</button>
              </div>
            ))}
          </div>
        )}
      </Muat>
    </>
  )
}
