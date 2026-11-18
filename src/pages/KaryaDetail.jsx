import { Link, useParams } from 'react-router-dom'
import { useData, SELECT_KARYA } from '../lib/useData.js'
import { Muat, FotoKarya } from '../components/Ui.jsx'
import { Reveal } from '../components/Effects.jsx'
import { KATEGORI, labelJenis, labelFinishing } from '../lib/config.js'
import { kisaran, waLink } from '../lib/format.js'
import { DEMO_KARYA } from '../data/demo.js'
import { KartuKoleksi } from './Katalog.jsx'
import './koleksi.css'

const KELOMPOK = 'Kelompok Gayeng Ruyeng'
const labelKategori = (id) => KATEGORI.find((k) => k.kategori === id)?.label ?? id
const orang = (p) => (p?.slug ? <Link to={`/pengrajin/${p.slug}`}>{p.nama}</Link> : p?.nama)
const angka = (n, satuan) => (n ? `${Number(n).toLocaleString('id-ID')} ${satuan}` : null)

const LANGKAH = [
  ['Pilih bahan', 'Baja per kendaraan dan besi bekas dipilah sesuai kebutuhan alat.'],
  ['Tempa & sepuh', 'Dipanaskan di perapian, ditempa membentuk bilah, lalu dikeraskan.'],
  ['Asah, gagang, cap', 'Diasah, dipasang gagang, dan dicap PASIR WETAN sebelum dikirim.'],
]

function Lainnya({ k }) {
  const pid = k.pengrajin_id
  const lain = useData(
    (s) => (pid ? s.from('karya').select(SELECT_KARYA).eq('pengrajin_id', pid).neq('id', k.id).limit(3) : Promise.resolve({ data: [] })),
    [pid, k.id],
    () => DEMO_KARYA.filter((x) => pid && x.pengrajin_id === pid && x.id !== k.id && x.tampil !== false).slice(0, 3),
  )
  const list = (lain.data ?? []).filter((x) => x.tampil !== false)
  if (!list.length) return null
  return (
    <section className="kd-lain">
      <h2>Karya lain dari {k.pengrajin?.nama ?? KELOMPOK}</h2>
      <div className="kk-grid">{list.map((x, i) => <KartuKoleksi key={x.id} k={x} delay={i * 80} />)}</div>
    </section>
  )
}

export default function KaryaDetail() {
  const { id } = useParams()
  const state = useData(
    (s) => s.from('karya').select(SELECT_KARYA).eq(/^[0-9a-f-]{36}$/i.test(id) ? 'id' : 'slug', id).maybeSingle(),
    [id],
    () => DEMO_KARYA.find((k) => k.id === id) ?? null,
  )

  return (
    <div className="wrap kk-section">
      <Muat state={state} kosong={<>Karya tidak ditemukan. <Link to="/karya">Kembali ke koleksi</Link></>}>
        {(k) => {
          const spek = [
            ['Penempa', k.pengrajin ? orang(k.pengrajin) : KELOMPOK],
            ['Pengasah', orang(k.pengasah)],
            ['Jenis', k.jenis && labelJenis(k.jenis)],
            ['Finishing', k.finishing && labelFinishing(k.finishing)],
            ['Panjang bilah', angka(k.panjang_mm, 'mm')],
            ['Berat', angka(k.berat_gram, 'gram')],
            ['Baja / bahan', k.baja],
            ['Gagang', k.gagang],
            ['Ukuran', k.ukuran],
          ].filter(([, v]) => v)
          const wa = waLink(`Halo PANDE, saya tertarik dengan "${k.nama}" (${window.location.href}). Bisa dibantu?`)
          return (
            <>
              <nav className="kd-crumb" aria-label="Breadcrumb">
                <Link to="/karya">Koleksi</Link><span aria-hidden="true">›</span>
                <Link to={`/karya?kategori=${k.kategori}`}>{k.kategori_harga?.label ?? labelKategori(k.kategori)}</Link><span aria-hidden="true">›</span>
                <span aria-current="page">{k.nama}</span>
              </nav>

              <div className="kd-grid">
                <div className="kd-foto"><FotoKarya k={k} besar /></div>
                <div className="kd-info">
                  <small className="tag">{k.kategori_harga?.label ?? labelKategori(k.kategori)}</small>
                  <h1>{k.nama}</h1>
                  <p className="kd-harga">{kisaran(k.harga_mulai, k.harga_sampai)}</p>
                  <p className="kd-catatan">{(k.harga_mulai ?? k.harga_sampai) != null
                    ? 'Harga kisaran; harga final dikonfirmasi pengrajin.'
                    : 'Harga dihitung dari ukuran dan bahan; dikonfirmasi pengrajin.'}</p>
                  {k.deskripsi && <p className="kd-desk">{k.deskripsi}</p>}
                  <div className="kd-aksi">
                    <Link className="btn" to={`/pesan?kategori=${k.kategori}&jenis=${encodeURIComponent(k.nama)}&pengrajin=${k.pengrajin_id ?? ''}`}>Pesan yang seperti ini</Link>
                    {wa && <a className="btn ghost" href={wa} target="_blank" rel="noopener noreferrer">Tanya lewat WhatsApp</a>}
                  </div>

                  {spek.length > 0 && (
                    <table className="kd-spek">
                      <caption>Spesifikasi</caption>
                      <tbody>{spek.map(([t, v]) => <tr key={t}><th scope="row">{t}</th><td>{v}</td></tr>)}</tbody>
                    </table>
                  )}

                  <div className="kd-maker">
                    <span className="kd-maker-ava" aria-hidden="true">{(k.pengrajin?.nama ?? 'G').replace(/^(Pak|Bu|Mas|Mbak)\s+/i, '')[0]}</span>
                    <div>
                      <small className="kd-maker-lbl">Tentang pengrajin</small>
                      <b>{k.pengrajin?.nama ?? KELOMPOK}</b>
                      {k.pengrajin?.slug
                        ? <Link to={`/pengrajin/${k.pengrajin.slug}`}>Baca profil →</Link>
                        : <Link to="/pengrajin">Kenali para pengrajin →</Link>}
                    </div>
                  </div>
                </div>
              </div>

              <Reveal as="section" className="kd-proses" aria-label="Bagaimana barang ini dibuat">
                <h2>Bagaimana barang ini dibuat</h2>
                <ol>{LANGKAH.map(([t, d], i) => <li key={t}><span>{String(i + 1).padStart(2, '0')}</span><b>{t}</b><p>{d}</p></li>)}</ol>
              </Reveal>

              <Lainnya k={k} />
            </>
          )
        }}
      </Muat>
    </div>
  )
}
