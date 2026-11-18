import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, supabaseSiap } from '../lib/supabase.js'
import { Judul } from '../components/Ui.jsx'
import { kisaran, waLink } from '../lib/format.js'
import { KATEGORI } from '../lib/config.js'
import { useData } from '../lib/useData.js'
import { DEMO_PENGRAJIN } from '../data/demo.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function Pesan() {
  const [params] = useSearchParams()
  const [f, setF] = useState({
    nama: '', no_hp: '', instansi: '', kategori: params.get('kategori') || '', jenis: params.get('jenis') || '',
    ukuran: '', jumlah: 1, catatan: '', setuju: false, website: '', pengrajin: params.get('pengrajin') || '',
  })
  const pengrajin = useData((s) => s.from('pengrajin').select('id, nama, peran').order('nama'), [], () => DEMO_PENGRAJIN)
  const [kirim, setKirim] = useState({ loading: false, error: null, hasil: null })
  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (f.website) return // honeypot: diisi bot
    if (!supabaseSiap) return setKirim({ loading: false, error: 'Supabase belum dikonfigurasi.', hasil: null })
    setKirim({ loading: true, error: null, hasil: null })
    const { data, error } = await supabase.rpc('buat_pesanan', {
      p_nama: f.nama, p_no_hp: f.no_hp, p_instansi: f.instansi, p_kategori: f.kategori, p_jenis: f.jenis,
      p_ukuran: f.ukuran, p_jumlah: Number(f.jumlah), p_catatan: f.catatan, p_setuju_aturan: f.setuju,
      p_pengrajin_id: UUID.test(f.pengrajin) ? f.pengrajin : null,
    })
    if (error) return setKirim({ loading: false, error: error.message, hasil: null })
    setKirim({ loading: false, error: null, hasil: data[0] })
  }

  if (kirim.hasil) {
    const h = kirim.hasil
    const wa = waLink(
      `Halo PANDE, saya sudah memesan.\nKode: ${h.kode}\nBarang: ${f.jenis} (${f.jumlah})\nUkuran: ${f.ukuran || '-'}\nBerikut foto/sketsa barangnya:`)
    return (
      <div className="wrap section narrow">
        <Judul kecil="Pesanan diterima">Terima kasih, {f.nama.split(' ')[0]}!</Judul>
        <div className="card pad">
          <p>Kode pesanan kamu:</p>
          <p className="kode">{h.kode}</p>
          <p>Simpan kode ini untuk <Link to="/status">cek status</Link>.</p>
          <p><strong>Perkiraan awal:</strong> {kisaran(h.estimasi_min, h.estimasi_max)}<br />
            <span className="muted">Harga final dikonfirmasi pengrajin setelah melihat foto/sketsa.</span></p>
          {wa
            ? <a className="btn" href={wa} target="_blank" rel="noreferrer">Kirim foto/sketsa lewat WhatsApp</a>
            : <p className="alert">Nomor WhatsApp belum diatur (VITE_WA_NUMBER).</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="wrap section narrow">
      <Judul kecil="Pesan" sub="Isi kebutuhanmu. Foto atau sketsa dikirim lewat WhatsApp setelah ini.">Pesan barang tempa</Judul>
      <form className="form card pad" onSubmit={submit}>
        <label>Kategori
          <select required value={f.kategori} onChange={ubah('kategori')}>
            <option value="">Pilih kategori</option>
            {KATEGORI.map((k) => <option key={k.kategori} value={k.kategori}>{k.label}</option>)}
          </select>
        </label>
        <label>Barang yang ingin dibuat
          <input required minLength={2} maxLength={120} value={f.jenis} onChange={ubah('jenis')} placeholder="mis. garpu rumput, engsel pintu, set pisau dapur" />
        </label>
        <div className="row2">
          <label>Ukuran (opsional)
            <input maxLength={200} value={f.ukuran} onChange={ubah('ukuran')} placeholder="mis. panjang 30 cm" />
          </label>
          <label>Jumlah
            <input required type="number" min={1} max={500} value={f.jumlah} onChange={ubah('jumlah')} />
          </label>
        </div>
        <label>Pengrajin pilihan (opsional)
          <select value={f.pengrajin} onChange={ubah('pengrajin')}>
            <option value="">Dicocokkan otomatis sesuai keahlian</option>
            {pengrajin.data?.map((p) => <option key={p.id} value={p.id}>{p.nama}{p.peran ? ` (${p.peran})` : ''}</option>)}
          </select>
        </label>
        <label>Catatan (opsional)
          <textarea maxLength={1000} rows={3} value={f.catatan} onChange={ubah('catatan')} placeholder="Kegunaan, bentuk gagang, tenggat waktu, dll." />
        </label>
        <div className="row2">
          <label>Nama
            <input required minLength={2} maxLength={80} value={f.nama} onChange={ubah('nama')} autoComplete="name" />
          </label>
          <label>Nomor WhatsApp
            <input required inputMode="tel" maxLength={20} value={f.no_hp} onChange={ubah('no_hp')} placeholder="08xxxxxxxxxx" autoComplete="tel" />
          </label>
        </div>
        <label>Instansi / usaha (opsional)
          <input maxLength={120} value={f.instansi} onChange={ubah('instansi')} />
        </label>
        <input className="hp-field" tabIndex={-1} autoComplete="off" value={f.website} onChange={ubah('website')} aria-hidden="true" />
        <label className="check">
          <input type="checkbox" required checked={f.setuju} onChange={ubah('setuju')} />
          <span>Saya memesan alat kerja, perlengkapan rumah tangga, atau dekorasi (bukan senjata) dan menyetujui <Link to="/aturan" target="_blank">aturan pesanan</Link>.</span>
        </label>
        {kirim.error && <p className="alert">{kirim.error}</p>}
        <button className="btn" disabled={kirim.loading}>{kirim.loading ? 'Mengirim...' : 'Kirim Pesanan'}</button>
      </form>
    </div>
  )
}
