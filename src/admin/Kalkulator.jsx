import { useState } from 'react'
import { hitungHarga } from '../lib/harga.js'
import { rupiah } from '../lib/format.js'

const FIELD = [
  ['beratKg', 'Berat bahan (kg)', 0.1],
  ['hargaPerKg', 'Harga besi bekas / kg', 500],
  ['jam', 'Jam kerja', 0.5],
  ['upahPerJam', 'Upah / jam', 1000],
  ['finishing', 'Finishing (gagang, kemasan, cap, QR)', 1000],
  ['marginPersen', 'Margin kelompok (%)', 1],
  ['kontribusiPersen', 'Kontribusi BUMDes (%)', 1],
  ['jumlah', 'Jumlah barang', 1],
]

export default function Kalkulator() {
  const [f, setF] = useState({ beratKg: 1, hargaPerKg: 0, jam: 1, upahPerJam: 0, finishing: 0, marginPersen: 30, kontribusiPersen: 5, jumlah: 1 })
  let hasil = null
  let err = null
  try {
    hasil = hitungHarga(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Number(v)])))
  } catch (e) { err = e.message }

  return (
    <div className="card pad">
      <h3>Kalkulator harga pesanan</h3>
      <p className="muted">Isi dengan angka dari pengrajin. Hasil adalah usulan; harga final tetap disepakati dengan pengrajin.</p>
      <div className="row4">
        {FIELD.map(([k, label, step]) => (
          <label key={k}>{label}<input type="number" min={0} step={step} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>
        ))}
      </div>
      {err && <p className="alert">{err}</p>}
      {hasil && (
        <dl className="dl">
          <dt>Biaya bahan</dt><dd>{rupiah(hasil.bahan)}</dd>
          <dt>Upah</dt><dd>{rupiah(hasil.upah)}</dd>
          <dt>Total biaya / barang</dt><dd>{rupiah(hasil.biaya)}</dd>
          <dt><b>Harga jual / barang</b></dt><dd><b>{rupiah(hasil.harga)}</b></dd>
          <dt>Kontribusi BUMDes / barang</dt><dd>{rupiah(hasil.kontribusi)}</dd>
          <dt>Untung kelompok / barang</dt><dd>{rupiah(hasil.untung)}</dd>
          <dt><b>Total harga ({f.jumlah} barang)</b></dt><dd><b>{rupiah(hasil.totalHarga)}</b></dd>
          <dt>Total untung kelompok</dt><dd>{rupiah(hasil.totalUntung)}</dd>
        </dl>
      )}
    </div>
  )
}
