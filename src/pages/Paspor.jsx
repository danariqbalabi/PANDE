import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { supabase, supabaseSiap } from '../lib/supabase.js'
import { Muat } from '../components/Ui.jsx'
import { tanggal, waLink } from '../lib/format.js'

export default function Paspor() {
  const { kode } = useParams()
  const k = kode.toUpperCase()
  const state = useData((s) =>
    s.from('paspor').select('*, kategori_harga(label), pengrajin(nama)').eq('kode', k).maybeSingle(), [k])

  useEffect(() => {
    // Catat satu scan per sesi browser per kode, supaya refresh tidak menggelembungkan angka.
    const kunci = `scan-${k}`
    try { if (sessionStorage.getItem(kunci)) return; sessionStorage.setItem(kunci, '1') } catch { /* storage diblokir */ }
    if (supabaseSiap) supabase.rpc('catat_scan', { p_kode: k }).then(() => {}) // rpc baru terkirim saat di-then
  }, [k])

  return (
    <div className="wrap section narrow">
      <Muat state={state} kosong="Paspor tidak ditemukan. Periksa kembali QR atau kodenya.">
        {(p) => {
          const servis = waLink(`Halo PANDE, saya punya barang dengan kode paspor ${p.kode} (${p.nama_barang}). Saya ingin servis / asah ulang.`)
          return (
            <>
              <div className="paspor card">
                <div className="paspor-head">
                  <small>PASPOR PRODUK - PASIR WETAN</small>
                  <h1>{p.nama_barang}</h1>
                  <span className="kode">{p.kode}</span>
                </div>
                <dl className="dl pad">
                  {p.kategori_harga?.label && <><dt>Kategori</dt><dd>{p.kategori_harga.label}</dd></>}
                  <dt>Ditempa oleh</dt><dd>{p.pengrajin?.nama ?? 'Pengrajin Gayeng Ruyeng'}</dd>
                  <dt>Tanggal tempa</dt><dd>{tanggal(p.tgl_tempa)}</dd>
                  {p.asal_besi && <><dt>Asal besi</dt><dd>{p.asal_besi}</dd></>}
                  {p.berat_besi_bekas_kg != null && <><dt>Besi bekas diselamatkan</dt><dd>{Number(p.berat_besi_bekas_kg).toLocaleString('id-ID')} kg</dd></>}
                </dl>
                {p.cara_rawat && <div className="pad"><h3>Cara merawat</h3><p>{p.cara_rawat}</p></div>}
              </div>
              <div className="actions">
                {servis && <a className="btn" href={servis} target="_blank" rel="noreferrer">Minta servis / asah ulang</a>}
                <Link className="btn ghost" to="/pesan">Pesan lagi</Link>
              </div>
              <div className="card pad cta">
                <h3>Barang ini lahir di Desa Pasir Wetan</h3>
                <p>Desa di kaki bukit Banyumas dengan pande besi turun-temurun, kebun melon hidroponik, dan bank sampah yang mengubah minyak jelantah jadi sabun.</p>
                <Link className="btn ghost" to="/desa">Jelajahi Pasir Wetan</Link>
              </div>
            </>
          )
        }}
      </Muat>
    </div>
  )
}
