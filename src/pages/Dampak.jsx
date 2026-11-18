import { useData } from '../lib/useData.js'
import { Muat, Judul } from '../components/Ui.jsx'
import { Counter } from '../components/Effects.jsx'

export default function Dampak() {
  const state = useData((s) => s.rpc('dampak'))
  return (
    <div className="wrap section">
      <Judul kecil="Dampak" sub="Angka yang tercatat langsung dari setiap setoran besi, barang, dan scan QR.">Besi bekas yang diberi hidup baru</Judul>
      <Muat state={state}>
        {(d) => (
          <div className="stats">
            <div className="stat"><b><Counter value={d.kg_besi_disetor} decimals={1} /> kg</b><span>besi bekas disetor</span></div>
            <div className="stat"><b><Counter value={d.kg_besi_ditempa} decimals={1} /> kg</b><span>besi bekas ditempa jadi barang</span></div>
            <div className="stat"><b><Counter value={d.jumlah_barang_berpaspor} /></b><span>barang berpaspor</span></div>
            <div className="stat"><b><Counter value={d.pesanan_selesai} /></b><span>pesanan terkirim</span></div>
            <div className="stat"><b><Counter value={d.jumlah_scan} /></b><span>kali paspor di-scan</span></div>
            <div className="stat"><b><Counter value={d.jumlah_karya} /></b><span>karya di katalog</span></div>
          </div>
        )}
      </Muat>
    </div>
  )
}
