import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData, SELECT_KARYA } from '../lib/useData.js'
import { Muat, FotoKarya } from '../components/Ui.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { Reveal } from '../components/Effects.jsx'
import { KATEGORI, JENIS, labelJenis, FINISHING, labelFinishing } from '../lib/config.js'
import { kisaran, rupiah } from '../lib/format.js'
import { DEMO_KARYA } from '../data/demo.js'
import './koleksi.css'

// "Tsuchime (motif palu)" -> "Tsuchime" untuk badge kartu.
const finishingPendek = (id) => labelFinishing(id).split(' (')[0]
const labelKategori = (id) => KATEGORI.find((k) => k.kategori === id)?.label ?? id

export function KartuKoleksi({ k, delay = 0 }) {
  return (
    <Reveal delay={delay} className="kk-cell">
      <Link to={`/karya/${k.slug ?? k.id}`} className="kk-card">
        <div className="kk-foto">
          <FotoKarya k={k} />
          {k.finishing && <span className="kk-badge">{finishingPendek(k.finishing)}</span>}
        </div>
        <div className="kk-body">
          <h3>{k.nama}</h3>
          {k.jenis && <p className="kk-jenis">{labelJenis(k.jenis)}</p>}
          <dl className="kk-specs">
            {k.baja && <div><dt>Bahan</dt><dd>{k.baja}</dd></div>}
            {(k.ukuran || k.panjang_mm) && <div><dt>Ukuran</dt><dd>{k.ukuran || `${k.panjang_mm} mm`}</dd></div>}
            {k.berat_gram && <div><dt>Berat</dt><dd>{k.berat_gram} g</dd></div>}
          </dl>
          {k.pengrajin?.nama && <p className="kk-maker">{k.pengrajin.nama}</p>}
          <div className="kk-foot">
            <span className="kk-harga">{kisaran(k.harga_mulai, k.harga_sampai)}</span>
            {k.panjang_mm && <span className="kk-pjg">{k.panjang_mm} mm</span>}
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

const URUT = [
  { id: '', label: 'Unggulan' },
  { id: 'murah', label: 'Harga terendah' },
  { id: 'mahal', label: 'Harga tertinggi' },
  { id: 'baru', label: 'Terbaru' },
  { id: 'panjang', label: 'Panjang bilah' },
]
const akhirNull = (a, b, f) => (a == null) - (b == null) || f()
const PEMBANDING = {
  murah: (a, b) => akhirNull(a.harga_mulai, b.harga_mulai, () => a.harga_mulai - b.harga_mulai),
  mahal: (a, b) => akhirNull(a.harga_sampai, b.harga_sampai, () => b.harga_sampai - a.harga_sampai),
  baru: (a, b) => String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')),
  panjang: (a, b) => akhirNull(a.panjang_mm, b.panjang_mm, () => b.panjang_mm - a.panjang_mm),
}

const hitung = (list, f) => list.reduce((m, k) => { const v = f(k); if (v) m[v] = (m[v] ?? 0) + 1; return m }, {})

export default function Katalog() {
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const tombolFilter = useRef(null)
  const tutupRef = useRef(null)
  const state = useData((s) => s.from('karya').select(SELECT_KARYA).order('unggulan', { ascending: false }).order('created_at', { ascending: false }), [], () => DEMO_KARYA)

  const daftar = (n) => (params.get(n) || '').split(',').filter(Boolean)
  const set = (n, v) => {
    const p = new URLSearchParams(params)
    if (v === '' || v == null || (Array.isArray(v) && !v.length)) p.delete(n)
    else p.set(n, Array.isArray(v) ? v.join(',') : v)
    setParams(p, { replace: true })
  }
  const toggle = (n, v) => { const l = daftar(n); set(n, l.includes(v) ? l.filter((x) => x !== v) : [...l, v]) }

  const f = {
    kategori: daftar('kategori'), jenis: daftar('jenis'), finishing: daftar('finishing'), pengrajin: daftar('pengrajin'),
    min: params.get('min') || '', max: params.get('max') || '', q: params.get('q') || '', urut: params.get('urut') || '',
  }

  const semua = useMemo(() => (state.data ?? []).filter((k) => k.tampil !== false), [state.data])
  const opsi = useMemo(() => {
    const pengrajin = {}
    semua.forEach((k) => { if (k.pengrajin?.slug) pengrajin[k.pengrajin.slug] = k.pengrajin.nama })
    return {
      kategori: hitung(semua, (k) => k.kategori), jenis: hitung(semua, (k) => k.jenis),
      finishing: hitung(semua, (k) => k.finishing), pengrajin: hitung(semua, (k) => k.pengrajin?.slug), namaPengrajin: pengrajin,
    }
  }, [semua])

  const adaHarga = semua.some((k) => k.harga_mulai != null || k.harga_sampai != null)
  const hasil = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const min = f.min === '' ? null : Number(f.min)
    const max = f.max === '' ? null : Number(f.max)
    const cocok = (l, v) => !l.length || l.includes(v)
    const out = semua.filter((k) =>
      cocok(f.kategori, k.kategori) && cocok(f.jenis, k.jenis) && cocok(f.finishing, k.finishing) && cocok(f.pengrajin, k.pengrajin?.slug) &&
      // kisaran harga barang harus beririsan dengan rentang filter
      (min == null || (k.harga_sampai ?? k.harga_mulai) >= min) &&
      (max == null || (k.harga_mulai ?? k.harga_sampai) <= max) &&
      (!q || [k.nama, k.jenis && labelJenis(k.jenis), k.baja, k.ukuran, k.deskripsi, k.pengrajin?.nama, k.pengasah?.nama].some((t) => t?.toLowerCase().includes(q))))
    return PEMBANDING[f.urut] ? [...out].sort(PEMBANDING[f.urut]) : out
  }, [semua, params]) // eslint-disable-line react-hooks/exhaustive-deps

  const chip = [
    ...f.kategori.map((v) => ['kategori', v, labelKategori(v)]),
    ...f.jenis.map((v) => ['jenis', v, labelJenis(v)]),
    ...f.finishing.map((v) => ['finishing', v, finishingPendek(v)]),
    ...f.pengrajin.map((v) => ['pengrajin', v, opsi.namaPengrajin[v] ?? v]),
  ]
  if (f.min) chip.push(['min', null, `Min ${rupiah(f.min)}`])
  if (f.max) chip.push(['max', null, `Maks ${rupiah(f.max)}`])
  const reset = () => { const p = new URLSearchParams(); if (f.urut) p.set('urut', f.urut); setParams(p, { replace: true }) }

  // Drawer mobile: Esc menutup, fokus pindah ke drawer lalu kembali ke tombol Filter.
  useEffect(() => {
    if (!drawer) return
    tutupRef.current?.focus()
    const esc = (e) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; tombolFilter.current?.focus() }
  }, [drawer])

  const grup = (judul, nama, items) => items.length > 0 && (
    <fieldset className="kk-grup">
      <legend>{judul}</legend>
      {items.map(({ id, label, n }) => (
        <label key={id} className="kk-cek">
          <input type="checkbox" checked={f[nama].includes(id)} onChange={() => toggle(nama, id)} />
          <span>{label}</span>{n != null && <small>{n}</small>}
        </label>
      ))}
    </fieldset>
  )

  return (
    <>
      <PageIntro code="01 / KOLEKSI" title="Katalog alat tempa" description="Bandingkan fungsi, bahan, ukuran, dan harga. Gunakan produk sebagai acuan pesanan."
        meta={[["Produk tercatat", state.loading ? '—' : semua.length], ['Harga custom', 'Konfirmasi pengrajin'], ['Ukuran khusus', 'Ajukan spesifikasi']]} />

      <div className="wrap kk-section">
        <div className="kk-layout">
          {drawer && <button className="kk-backdrop" aria-label="Tutup filter" tabIndex={-1} onClick={() => setDrawer(false)} />}
          <aside id="kk-filter" className={drawer ? 'kk-side open' : 'kk-side'} aria-label="Filter koleksi">
            <div className="kk-side-head">
              <h2>Filter</h2>
              <button ref={tutupRef} type="button" className="kk-tutup" onClick={() => setDrawer(false)} aria-label="Tutup filter">✕</button>
            </div>
            {grup('Kategori', 'kategori', KATEGORI.filter((k) => opsi.kategori[k.kategori] || f.kategori.includes(k.kategori))
              .map((k) => ({ id: k.kategori, label: k.label, n: opsi.kategori[k.kategori] ?? 0 })))}
            {grup('Jenis', 'jenis', JENIS.filter((j) => opsi.jenis[j.id]).map((j) => ({ id: j.id, label: j.label, n: opsi.jenis[j.id] })))}
            {grup('Finishing', 'finishing', FINISHING.filter((x) => opsi.finishing[x.id]).map((x) => ({ id: x.id, label: x.label, n: opsi.finishing[x.id] })))}
            {grup('Pengrajin', 'pengrajin', Object.entries(opsi.namaPengrajin).map(([id, label]) => ({ id, label, n: opsi.pengrajin[id] })))}
            {(adaHarga || f.min || f.max) && <fieldset className="kk-grup">
              <legend>Harga (Rp)</legend>
              <div className="kk-harga-in">
                <label>Min<input type="number" inputMode="numeric" min={0} step={10000} placeholder="0" value={f.min} onChange={(e) => set('min', e.target.value)} /></label>
                <label>Maks<input type="number" inputMode="numeric" min={0} step={10000} placeholder="∞" value={f.max} onChange={(e) => set('max', e.target.value)} /></label>
              </div>
            </fieldset>}
            <div className="kk-side-aksi">
              <button type="button" className="btn ghost kecil" onClick={reset}>Reset filter</button>
              <button type="button" className="btn kecil kk-lihat" onClick={() => setDrawer(false)}>Lihat {hasil.length} barang</button>
            </div>
          </aside>

          <section className="kk-main" aria-label="Daftar barang">
            <div className="kk-toolbar">
              <button ref={tombolFilter} type="button" className="btn ghost kecil kk-buka" aria-expanded={drawer} aria-controls="kk-filter" onClick={() => setDrawer(true)}>
                Filter{chip.length > 0 && ` (${chip.length})`}
              </button>
              <p className="kk-jumlah" aria-live="polite">{state.loading ? 'Memuat…' : `${hasil.length} barang`}</p>
              <input type="search" className="kk-cari" placeholder="Cari alat, bahan, ukuran…" aria-label="Cari alat, bahan, atau ukuran" value={f.q} onChange={(e) => set('q', e.target.value)} />
              <label className="kk-urut">
                <span>Urutkan</span>
                <select value={f.urut} onChange={(e) => set('urut', e.target.value)}>
                  {URUT.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </label>
            </div>

            {chip.length > 0 && (
              <div className="kk-chips">
                {chip.map(([n, v, label]) => (
                  <button key={n + v} type="button" className="chip on kk-chip" onClick={() => (v == null ? set(n, '') : toggle(n, v))} aria-label={`Hapus filter ${label}`}>
                    {label} <span aria-hidden="true">✕</span>
                  </button>
                ))}
                <button type="button" className="kk-hapus-semua" onClick={reset}>Hapus semua</button>
              </div>
            )}

            <Muat state={state} kosong="Katalog masih kosong.">
              {() => hasil.length ? (
                <div className="kk-grid">{hasil.map((k, i) => <KartuKoleksi key={k.id} k={k} delay={(i % 3) * 80} />)}</div>
              ) : (
                <div className="kk-kosong">
                  <p><b>Produk tidak ditemukan.</b><br />Ubah filter atau ajukan spesifikasi untuk dicek pengrajin.</p>
                  <div className="kk-kosong-aksi">
                    <button type="button" className="btn ghost kecil" onClick={reset}>Reset filter</button>
                    <Link to="/pesan?kategori=khusus" className="btn kecil">Pesan Khusus</Link>
                  </div>
                </div>
              )}
            </Muat>
          </section>
        </div>

        <Reveal className="kk-cta">
          <div>
            <small className="label">Pesanan khusus</small>
            <h2>Butuh ukuran atau bentuk lain?</h2>
            <p>Kirim fungsi alat, ukuran, jumlah, dan gambar acuan.</p>
          </div>
          <Link to="/pesan?kategori=khusus" className="btn">Kirim sketsa →</Link>
        </Reveal>
      </div>
    </>
  )
}
