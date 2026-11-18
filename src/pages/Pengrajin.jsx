import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { Anvil } from '../components/ToolArt.jsx'
import { Reveal, Stamp } from '../components/Effects.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { DEMO_PENGRAJIN } from '../data/demo.js'
import './pengrajin.css'

// Pengurus tampil lebih dulu (urutan ini), sisanya anggota menurut abjad.
const PENGURUS = ['ketua', 'sekretaris', 'bendahara', 'sie humas', 'sie pemasaran']
const rank = (p) => { const i = PENGURUS.indexOf((p.peran ?? '').trim().toLowerCase()); return i < 0 ? PENGURUS.length : i }
export const urutPengrajin = (list) => [...list].sort((a, b) => rank(a) - rank(b) || a.nama.localeCompare(b.nama, 'id'))

export const lamaMenempa = (th) => (th ? new Date().getFullYear() - th : null)

const inisial = (nama = '') =>
  nama.replace(/^(pak|bu|mas|mbak|mbah)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'

// Foto pengrajin, atau avatar inisial di atas gradasi bara dengan landasan samar.
export function Potret({ p, besar = false }) {
  const kelas = `potret${besar ? ' besar' : ''}`
  if (p.foto_url) return <div className={kelas}><img src={p.foto_url} alt={`Potret ${p.nama}`} loading="lazy" /></div>
  const hue = [...(p.nama ?? '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 4
  return (
    <div className={`${kelas} avatar h${hue}`} role="img" aria-label={`Avatar ${p.nama}`}>
      <Anvil className="avatar-anvil" aria-hidden="true" />
      <span className="avatar-inisial" aria-hidden="true">{inisial(p.nama)}</span>
    </div>
  )
}

export default function Pengrajin() {
  const state = useData(
    (s) => s.from('pengrajin').select('id, slug, nama, peran, sejak_tahun, dusun, keahlian, kutipan, bio, foto_url').order('nama'),
    [],
    () => DEMO_PENGRAJIN,
  )
  const [pilih, setPilih] = useState(null)
  const [cari, setCari] = useState('')

  const opsi = useMemo(() => {
    const set = new Set()
    for (const p of state.data ?? []) for (const skill of p.keahlian ?? []) set.add(skill)
    return [...set]
  }, [state.data])

  const q = cari.trim().toLowerCase()
  const tersaring = urutPengrajin(state.data ?? []).filter((p) =>
    (!pilih || p.keahlian?.includes(pilih)) && (!q || [p.nama, ...(p.keahlian ?? [])].some((value) => value.toLowerCase().includes(q))))

  return (
    <div className="pgr">
      <PageIntro code="02 / PENGRAJIN" title="Direktori pengrajin" description="Lihat profil dan keahlian anggota Gayeng Ruyeng. Pilihan pengrajin dikonfirmasi sesuai kapasitas pengerjaan."
        meta={[["Profil tersedia", state.loading ? '—' : (state.data?.length ?? 0)], ['Kelompok', 'Gayeng Ruyeng'], ['Lokasi', 'Pasir Wetan, Banyumas']]} />

      <section className="wrap pgr-direktori" aria-labelledby="pgr-dir">
        <div className="directory-heading"><h2 id="pgr-dir" className="pgr-h2">Anggota & keahlian</h2><span aria-live="polite">{state.loading ? 'Memuat…' : `${tersaring.length} profil`}</span></div>
        <div className="pgr-alat">
          <div className="chips" role="group" aria-label="Saring menurut keahlian">
            <button type="button" className={`chip${!pilih ? ' on' : ''}`} aria-pressed={!pilih} onClick={() => setPilih(null)}>Semua</button>
            {opsi.map((o) => (
              <button key={o} type="button" className={`chip${pilih === o ? ' on' : ''}`} aria-pressed={pilih === o} onClick={() => setPilih(pilih === o ? null : o)}>{o}</button>
            ))}
          </div>
          <label className="pgr-cari">
            <span className="sr-only">Cari nama pengrajin</span>
            <input type="search" placeholder="Cari nama atau keahlian…" aria-label="Cari nama atau keahlian pengrajin" value={cari} onChange={(e) => setCari(e.target.value)} />
          </label>
        </div>

        <Muat state={state} kosong="Profil pengrajin akan ditampilkan setelah mendapat izin dari masing-masing pengrajin.">
          {() => tersaring.length === 0
            ? <p className="empty">Tidak ada pengrajin yang cocok. <button type="button" className="pgr-link" onClick={() => { setPilih(null); setCari('') }}>Hapus saringan</button></p>
            : (
              <ul className="pgr-grid">
                {tersaring.map((p, i) => {
                  const lama = lamaMenempa(p.sejak_tahun)
                  return (
                    <Reveal as="li" key={p.id} delay={(i % 3) * 90}>
                      <Link to={`/pengrajin/${p.slug ?? p.id}`} className="pgr-kartu">
                        <Potret p={p} />
                        <div className="pgr-kartu-isi">
                          <h3>{p.nama}</h3>
                          {p.peran && <p className="pgr-peran">{p.peran}</p>}
                          {p.sejak_tahun && <p className="pgr-sejak">Menempa sejak {p.sejak_tahun}{lama > 0 && <> · ± {lama} tahun</>}</p>}
                          {p.keahlian?.length > 0 && (
                            <ul className="pgr-keahlian" aria-label="Keahlian">{p.keahlian.map((k) => <li key={k}>{k}</li>)}</ul>
                          )}
                          {p.kutipan && <blockquote className="pgr-kutipan">“{p.kutipan}”</blockquote>}
                          {!p.kutipan && p.bio && <p className="pgr-bio">{p.bio}</p>}
                          <span className="pgr-go">Lihat profil <span aria-hidden="true">→</span></span>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </ul>
            )}
        </Muat>
        <p className="pgr-izin muted">Profil hanya ditampilkan dengan izin dari masing-masing pengrajin.</p>
      </section>

      <section className="pgr-cara" aria-labelledby="pgr-cara">
        <div className="wrap pgr-cara-in">
          <div>
            <small className="label">Kerja kelompok</small>
            <h2 id="pgr-cara" className="pgr-h2">Pembagian pekerjaan</h2>
          </div>
          <ol className="pgr-langkah">
            <Reveal as="li"><b>Keahlian</b><p>Pelaksana disesuaikan dengan jenis dan spesifikasi alat.</p></Reveal>
            <Reveal as="li" delay={90}><b>Kapasitas</b><p>Pengelola mengonfirmasi ketersediaan dan waktu pengerjaan.</p></Reveal>
            <Reveal as="li" delay={180}><b>Mutu</b><p>Barang diperiksa sebelum diberi cap dan paspor.</p></Reveal>
          </ol>
          <Stamp className="pgr-cap" />
        </div>
      </section>

      <section className="wrap pgr-cta">
        <h2 className="pgr-h2">Belum menentukan pengrajin?</h2>
        <p className="muted">Ajukan spesifikasi. Pengelola membantu mencocokkan pelaksana.</p>
        <Link to="/pesan" className="btn">Ajukan pesanan</Link>
      </section>
    </div>
  )
}
