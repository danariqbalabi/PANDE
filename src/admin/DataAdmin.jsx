import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { rupiah, tanggal } from '../lib/format.js'
import { unggahFoto } from './upload.js'

export const slugify = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const SLUG_OK = /^[a-z0-9]+(-[a-z0-9]+)*$/

// Baris "T: ..." diikuti "J: ...". Baris tanpa awalan menyambung baris sebelumnya.
export function parseWawancara(teks) {
  const pasang = []
  let akhir = null
  for (const [n, mentah] of teks.split(/\r?\n/).entries()) {
    const baris = mentah.trim()
    if (!baris) continue
    const m = baris.match(/^([TJ])\s*:\s*(.*)$/i)
    if (!m) {
      if (!akhir) return { error: `Baris ${n + 1}: harus diawali "T:" atau "J:".` }
      akhir.o[akhir.k] += ' ' + baris
      continue
    }
    const k = m[1].toLowerCase() === 't' ? 't' : 'j'
    const atas = pasang[pasang.length - 1]
    if (k === 't') {
      if (atas && !atas.j) return { error: `Baris ${n + 1}: pertanyaan sebelumnya belum punya jawaban "J:".` }
      pasang.push({ t: m[2], j: '' })
      akhir = { o: pasang[pasang.length - 1], k }
    } else {
      if (!atas || atas.j) return { error: `Baris ${n + 1}: jawaban "J:" harus didahului pertanyaan "T:".` }
      atas.j = m[2]
      akhir = { o: atas, k }
    }
  }
  if (pasang.length && !pasang[pasang.length - 1].j) return { error: 'Pertanyaan terakhir belum punya jawaban "J:".' }
  if (pasang.some((p) => !p.t.trim() || !p.j.trim())) return { error: 'Ada pertanyaan atau jawaban yang kosong.' }
  return { pasang: pasang.map((p) => ({ t: p.t.trim(), j: p.j.trim() })) }
}
if (import.meta.env.DEV) {
  console.assert(parseWawancara('T: a?\nJ: b\nlanjut\nT: c?\nJ: d').pasang?.[0].j === 'b lanjut', 'parseWawancara gabung')
  console.assert(parseWawancara('T: a?\nT: b?').error, 'parseWawancara T ganda')
  console.assert(parseWawancara('').pasang?.length === 0, 'parseWawancara kosong')
}

export function PengrajinAdmin() {
  const kosong = { nama: '', slug: '', peran: '', sejak_tahun: '', dusun: '', kutipan: '', wawancara: '', keahlian: '', kapasitas_per_bulan: '', bio: '', izin_tampil: false }
  const [f, setF] = useState(kosong)
  const [slugManual, setSlugManual] = useState(false)
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState(null)
  const [muatUlang, setMuatUlang] = useState(0)
  const list = useData((s) => s.from('pengrajin').select('*').order('nama'), [muatUlang])
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const ubahNama = (e) => setF({ ...f, nama: e.target.value, ...(slugManual ? {} : { slug: slugify(e.target.value) }) })
  const ubahSlug = (e) => { setSlugManual(true); setF({ ...f, slug: e.target.value.toLowerCase() }) }
  const ww = parseWawancara(f.wawancara)

  async function simpan(e) {
    e.preventDefault()
    if (!SLUG_OK.test(f.slug)) return setMsg('Slug hanya boleh huruf kecil a-z, angka, dan tanda hubung (contoh: pak-sarmin).')
    if (ww.error) return setMsg('Wawancara: ' + ww.error)
    const tahun = new Date().getFullYear()
    if (f.sejak_tahun !== '' && (Number(f.sejak_tahun) < 1900 || Number(f.sejak_tahun) > tahun)) return setMsg(`Tahun mulai menempa harus antara 1900 dan ${tahun}.`)
    try {
      const foto_url = file ? await unggahFoto(file, 'pengrajin') : null
      const { error } = await supabase.from('pengrajin').insert({
        nama: f.nama, slug: f.slug, bio: f.bio || null, izin_tampil: f.izin_tampil, foto_url,
        peran: f.peran.trim() || null, dusun: f.dusun.trim() || null, kutipan: f.kutipan.trim() || null,
        sejak_tahun: f.sejak_tahun === '' ? null : Number(f.sejak_tahun),
        wawancara: ww.pasang,
        keahlian: f.keahlian.split(',').map((x) => x.trim()).filter(Boolean),
        kapasitas_per_bulan: f.kapasitas_per_bulan === '' ? null : Number(f.kapasitas_per_bulan),
      })
      if (error) throw error
      setMsg('Pengrajin ditambahkan.'); setF(kosong); setSlugManual(false); setFile(null); setMuatUlang((n) => n + 1)
    } catch (err) { setMsg(err.message) }
  }
  async function izin(id, v) {
    const { error } = await supabase.from('pengrajin').update({ izin_tampil: v }).eq('id', id)
    if (error) alert(error.message); else setMuatUlang((n) => n + 1)
  }

  return (
    <>
      <form className="form card pad" onSubmit={simpan}>
        <h3>Tambah pengrajin</h3>
        <div className="row2">
          <label>Nama<input required value={f.nama} onChange={ubahNama} /></label>
          <label>Slug (alamat profil)<input required value={f.slug} onChange={ubahSlug} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Huruf kecil a-z, angka, dan tanda hubung" placeholder="pak-sarmin" /></label>
        </div>
        <div className="row2">
          <label>Peran<input value={f.peran} onChange={ubah('peran')} placeholder="Ketua, Penempa bilah, Anggota" /></label>
          <label>Menempa sejak (tahun)<input type="number" min={1900} max={new Date().getFullYear()} value={f.sejak_tahun} onChange={ubah('sejak_tahun')} /></label>
        </div>
        <div className="row2">
          <label>Dusun<input value={f.dusun} onChange={ubah('dusun')} /></label>
          <label>Kapasitas pesanan / bulan<input type="number" min={0} value={f.kapasitas_per_bulan} onChange={ubah('kapasitas_per_bulan')} /></label>
        </div>
        <label>Kutipan singkat<input value={f.kutipan} onChange={ubah('kutipan')} placeholder="Satu kalimat dari pengrajin sendiri" /></label>
        <label>Keahlian (pisahkan dengan koma)<input value={f.keahlian} onChange={ubah('keahlian')} placeholder="alat tani, pisau, dekorasi" /></label>
        <label>Bio singkat<textarea rows={2} value={f.bio} onChange={ubah('bio')} /></label>
        <label>Wawancara (tiap pertanyaan diawali "T:", jawabannya "J:")
          <textarea rows={6} value={f.wawancara} onChange={ubah('wawancara')} aria-invalid={!!ww.error} placeholder={'T: Sejak kapan menempa?\nJ: Sejak SMP, ikut bapak di besalen.'} />
        </label>
        {f.wawancara.trim() && <small className={ww.error ? 'alert' : 'muted'}>{ww.error ?? `${ww.pasang.length} pasang tanya-jawab terbaca.`}</small>}
        <label>Foto (opsional)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files[0] ?? null)} /></label>
        <label className="check"><input type="checkbox" checked={f.izin_tampil} onChange={ubah('izin_tampil')} /><span>Pengrajin sudah mengizinkan profilnya tampil di situs</span></label>
        {msg && <p className="muted">{msg}</p>}
        <button className="btn">Simpan</button>
      </form>
      <Muat state={list} kosong="Belum ada pengrajin.">
        {(rows) => (
          <div className="tabel">
            {rows.map((p) => (
              <div key={p.id} className="tabel-baris">
                <span><b>{p.nama}</b>{p.peran && <> · {p.peran}</>}<br /><small className="muted">/{p.slug ?? '-'} | {p.keahlian?.join(', ') || '-'} | kapasitas {p.kapasitas_per_bulan ?? '-'} / bulan</small></span>
                <label className="check"><input type="checkbox" checked={p.izin_tampil} onChange={(e) => izin(p.id, e.target.checked)} /><span>Tampil publik</span></label>
              </div>
            ))}
          </div>
        )}
      </Muat>
    </>
  )
}

export function SetoranAdmin() {
  const kosong = { tanggal: '', sumber: 'Bank sampah', berat_kg: '', harga: '', catatan: '' }
  const [f, setF] = useState(kosong)
  const [msg, setMsg] = useState(null)
  const [muatUlang, setMuatUlang] = useState(0)
  const list = useData((s) => s.from('setoran_besi').select('*').order('tanggal', { ascending: false }).limit(200), [muatUlang])
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value })

  async function simpan(e) {
    e.preventDefault()
    const { error } = await supabase.from('setoran_besi').insert({
      sumber: f.sumber, berat_kg: Number(f.berat_kg), harga: f.harga === '' ? null : Number(f.harga),
      catatan: f.catatan || null, ...(f.tanggal ? { tanggal: f.tanggal } : {}),
    })
    if (error) return setMsg(error.message)
    setMsg('Setoran dicatat.'); setF(kosong); setMuatUlang((n) => n + 1)
  }

  const total = list.data?.reduce((a, r) => a + Number(r.berat_kg), 0) ?? 0
  return (
    <>
      <form className="form card pad" onSubmit={simpan}>
        <h3>Catat setoran besi bekas</h3>
        <div className="row2">
          <label>Tanggal<input type="date" value={f.tanggal} onChange={ubah('tanggal')} /></label>
          <label>Sumber
            <select value={f.sumber} onChange={ubah('sumber')}>
              <option>Bank sampah</option><option>Bengkel</option><option>Pengepul</option><option>Lainnya</option>
            </select>
          </label>
          <label>Berat (kg)<input required type="number" step="0.01" min={0.01} value={f.berat_kg} onChange={ubah('berat_kg')} /></label>
          <label>Harga dibayar (Rp)<input type="number" min={0} value={f.harga} onChange={ubah('harga')} /></label>
        </div>
        <label>Catatan<input value={f.catatan} onChange={ubah('catatan')} /></label>
        {msg && <p className="muted">{msg}</p>}
        <button className="btn">Simpan</button>
      </form>
      <p><b>Total tercatat (200 terakhir): {total.toLocaleString('id-ID')} kg</b></p>
      <Muat state={list} kosong="Belum ada setoran.">
        {(rows) => (
          <div className="tabel">
            {rows.map((r) => (
              <div key={r.id} className="tabel-baris">
                <span>{tanggal(r.tanggal)} - {r.sumber}</span>
                <span>{Number(r.berat_kg).toLocaleString('id-ID')} kg</span>
                <span>{rupiah(r.harga)}</span>
              </div>
            ))}
          </div>
        )}
      </Muat>
    </>
  )
}

export function KategoriAdmin() {
  const [muatUlang, setMuatUlang] = useState(0)
  const list = useData((s) => s.from('kategori_harga').select('*').order('urutan'), [muatUlang])
  return (
    <>
      <p className="muted">Kisaran harga per barang dipakai untuk perkiraan awal di halaman Pesan. Kosongkan bila harga sangat bervariasi.</p>
      <Muat state={list}>
        {(rows) => <div className="tabel">{rows.map((k) => <BarisKategori key={k.kategori} k={k} onSimpan={() => setMuatUlang((n) => n + 1)} />)}</div>}
      </Muat>
    </>
  )
}

function BarisKategori({ k, onSimpan }) {
  const [mulai, setMulai] = useState(k.harga_mulai ?? '')
  const [sampai, setSampai] = useState(k.harga_sampai ?? '')
  async function simpan() {
    const { error } = await supabase.from('kategori_harga').update({
      harga_mulai: mulai === '' ? null : Number(mulai), harga_sampai: sampai === '' ? null : Number(sampai),
    }).eq('kategori', k.kategori)
    if (error) alert(error.message); else onSimpan()
  }
  return (
    <div className="tabel-baris">
      <span><b>{k.label}</b></span>
      <input type="number" min={0} placeholder="mulai" value={mulai} onChange={(e) => setMulai(e.target.value)} />
      <input type="number" min={0} placeholder="sampai" value={sampai} onChange={(e) => setSampai(e.target.value)} />
      <button className="btn kecil" onClick={simpan}>Simpan</button>
    </div>
  )
}
