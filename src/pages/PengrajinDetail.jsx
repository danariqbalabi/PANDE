import { Link, useParams } from 'react-router-dom'
import { useData, SELECT_KARYA } from '../lib/useData.js'
import { FotoKarya } from '../components/Ui.jsx'
import { Palu, Sabit, ChefKnife, Engsel } from '../components/ToolArt.jsx'
import { Reveal } from '../components/Effects.jsx'
import { kisaran } from '../lib/format.js'
import { labelJenis } from '../lib/config.js'
import { DEMO_PENGRAJIN, DEMO_KARYA } from '../data/demo.js'
import { Potret, lamaMenempa, urutPengrajin } from './Pengrajin.jsx'
import './pengrajin.css'

const HIASAN = [Palu, Sabit, ChefKnife, Engsel]

export default function PengrajinDetail() {
  const { slug } = useParams()
  const state = useData(
    (s) => s.from('pengrajin').select('id, slug, nama, peran, sejak_tahun, dusun, keahlian, kutipan, bio, foto_url, wawancara').eq('slug', slug).maybeSingle(),
    [slug],
    () => DEMO_PENGRAJIN.find((p) => p.slug === slug) ?? null,
  )
  const p = state.data
  const id = p?.id
  const karya = useData(
    (s) => (id ? s.from('karya').select(SELECT_KARYA).or(`pengrajin_id.eq.${id},pengasah_id.eq.${id}`) : { data: [], error: null }),
    [id],
    () => (id ? DEMO_KARYA.filter((k) => k.pengrajin_id === id || k.pengasah_id === id) : []),
  )
  const semua = useData((s) => s.from('pengrajin').select('id, slug, nama, peran').order('nama'), [], () => DEMO_PENGRAJIN)

  if (state.loading) return <div className="wrap section"><div className="skeleton" aria-label="Memuat" style={{ height: 320 }} /></div>
  if (state.error) return <div className="wrap section"><p className="alert">{state.error}</p></div>
  if (!p) {
    return (
      <div className="wrap section pgr-kosong">
        <small className="label">Pengrajin</small>
        <h1>Profil tidak ditemukan</h1>
        <p className="muted">Profil ini mungkin belum diizinkan tampil, atau alamatnya berubah.</p>
        <Link to="/pengrajin" className="btn ghost">← Kembali ke daftar pengrajin</Link>
      </div>
    )
  }

  const lama = lamaMenempa(p.sejak_tahun)
  const tanya = Array.isArray(p.wawancara) ? p.wawancara.filter((w) => w?.t && w?.j) : []
  const daftar = urutPengrajin(semua.data ?? [])
  const pos = daftar.findIndex((x) => x.id === p.id)
  const sebelum = pos > 0 ? daftar[pos - 1] : null
  const sesudah = pos >= 0 && pos < daftar.length - 1 ? daftar[pos + 1] : null
  const fakta = [
    ['Nama', p.nama],
    ['Peran', p.peran],
    ['Menempa sejak', p.sejak_tahun && `${p.sejak_tahun}${lama > 0 ? ` (± ${lama} tahun)` : ''}`],
    ['Dusun', p.dusun],
    ['Keahlian', p.keahlian?.length ? p.keahlian.join(', ') : null],
    ['Kelompok', 'Gayeng Ruyeng, Desa Pasir Wetan'],
  ].filter(([, v]) => v)

  return (
    <article className="pgr pgr-detail">
      <div className="wrap">
        <nav className="pgr-crumb" aria-label="Breadcrumb">
          <Link to="/pengrajin">Pengrajin</Link> <span aria-hidden="true">›</span> <span aria-current="page">{p.nama}</span>
        </nav>

        <header className="pgr-kepala">
          <Potret p={p} besar />
          <div className="pgr-kepala-isi">
            <small className="label">Profil pengrajin</small>
            <h1>{p.nama}</h1>
            {p.peran && <p className="pgr-peran besar">{p.peran}</p>}
            {p.kutipan && <blockquote className="pgr-pull"><p>“{p.kutipan}”</p></blockquote>}
            <div className="pgr-aksi">
              <Link to={`/pesan?pengrajin=${p.id}`} className="btn">Pesan dari {p.nama}</Link>
              <a href="#karya" className="btn ghost">Lihat karyanya</a>
            </div>
          </div>
        </header>

        <div className="pgr-badan">
          <aside className="pgr-fakta" aria-labelledby="pgr-fakta-h">
            <h2 id="pgr-fakta-h" className="pgr-fakta-h">Profil Pengrajin</h2>
            <dl>
              {fakta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </aside>
          <div className="pgr-cerita">
            {p.bio && <p className="pgr-bio-besar">{p.bio}</p>}

            <section className="pgr-wawancara" aria-labelledby="pgr-ww">
              <small className="label">Wawancara</small>
              <h2 id="pgr-ww" className="pgr-h2">Ngobrol di bengkel bersama {p.nama}</h2>
              {tanya.length === 0
                ? (
                  <div className="pgr-segera">
                    <Palu className="pgr-segera-art" aria-hidden="true" />
                    <p>Wawancara segera hadir — kisah {p.nama} sedang kami kumpulkan langsung dari bengkel.</p>
                  </div>
                )
                : (
                  <>
                    {tanya.length > 2 && (
                      <ol className="pgr-toc" aria-label="Daftar pertanyaan">
                        {tanya.map((w, i) => <li key={i}><a href={`#tanya-${i + 1}`}>{w.t}</a></li>)}
                      </ol>
                    )}
                    <ol className="pgr-qa">
                      {tanya.map((w, i) => {
                        const Art = HIASAN[i % HIASAN.length]
                        return (
                          <Reveal as="li" key={i} id={`tanya-${i + 1}`}>
                            <span className="pgr-qa-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                            <div>
                              <h3>{w.t}</h3>
                              <p>{w.j}</p>
                            </div>
                            {i < tanya.length - 1 && i % 2 === 1 && <Art className="pgr-qa-art" aria-hidden="true" />}
                          </Reveal>
                        )
                      })}
                    </ol>
                  </>
                )}
            </section>
          </div>
        </div>

        <section id="karya" className="pgr-karya" aria-labelledby="pgr-karya-h">
          <h2 id="pgr-karya-h" className="pgr-h2">Karya {p.nama}</h2>
          {karya.loading ? <div className="skeleton" style={{ height: 200 }} aria-label="Memuat" />
            : karya.error ? <p className="alert">{karya.error}</p>
            : !karya.data?.length ? <p className="empty">Karya {p.nama} belum dipajang. Tetap bisa dipesan langsung lewat formulir pesanan.</p>
            : (
              <ul className="pgr-karya-grid">
                {karya.data.map((k) => (
                  <li key={k.id}>
                    <Link to={`/karya/${k.slug ?? k.id}`} className="pgr-karya-kartu">
                      <FotoKarya k={k} />
                      <span className={`pgr-peran-badge ${k.pengrajin_id === p.id ? 'tempa' : 'asah'}`}>
                        {k.pengrajin_id === p.id ? 'Ditempa' : 'Diasah'}
                      </span>
                      <div className="pgr-karya-isi">
                        <h3>{k.nama}</h3>
                        {k.jenis && <small className="muted">{labelJenis(k.jenis)}</small>}
                        <p>{kisaran(k.harga_mulai, k.harga_sampai)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
        </section>

        {(sebelum || sesudah) && (
          <nav className="pgr-prevnext" aria-label="Pengrajin lain">
            {sebelum ? <Link to={`/pengrajin/${sebelum.slug ?? sebelum.id}`} rel="prev"><small>← Sebelumnya</small><b>{sebelum.nama}</b></Link> : <span />}
            {sesudah && <Link to={`/pengrajin/${sesudah.slug ?? sesudah.id}`} rel="next" className="next"><small>Berikutnya →</small><b>{sesudah.nama}</b></Link>}
          </nav>
        )}
      </div>
    </article>
  )
}
