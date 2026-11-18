import { useData } from '../lib/useData.js'
import { Muat, Judul } from '../components/Ui.jsx'

const fmt = (n) => Number(n ?? 0).toLocaleString('id-ID')

export default function Dampak() {
  const state = useData((s) => s.rpc('dampak'))
  return (
    <div className="wrap section">
      <Judul kecil="Dampak" sub="Angka yang tercatat langsung dari setiap setoran besi, barang, dan scan QR.">Besi bekas yang diberi hidup baru</Judul>
      <Muat state={state}>
        {(d) => (
          <div className="stats">
            <div className="stat"><b>{fmt(d.kg_besi_disetor)} kg</b><span>besi bekas disetor</span></div>
            <div className="stat"><b>{fmt(d.kg_besi_ditempa)} kg</b><span>besi bekas ditempa jadi barang</span></div>
            <div className="stat"><b>{fmt(d.jumlah_barang_berpaspor)}</b><span>barang berpaspor</span></div>
            <div className="stat"><b>{fmt(d.pesanan_selesai)}</b><span>pesanan terkirim</span></div>
            <div className="stat"><b>{fmt(d.jumlah_scan)}</b><span>kali paspor di-scan</span></div>
            <div className="stat"><b>{fmt(d.jumlah_karya)}</b><span>karya di katalog</span></div>
          </div>
        )}
      </Muat>
    </div>
  )
}
