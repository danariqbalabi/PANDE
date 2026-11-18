import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { KartuKarya, Muat, Judul } from '../components/Ui.jsx'

export default function Katalog() {
  const [params, setParams] = useSearchParams()
  const aktif = params.get('kategori') || ''
  const kategori = useData((s) => s.from('kategori_harga').select('*').order('urutan'))
  const karya = useData((s) => {
    let q = s.from('karya').select('*, kategori_harga(label)').order('unggulan', { ascending: false }).order('created_at', { ascending: false })
    if (aktif) q = q.eq('kategori', aktif)
    return q
  }, [aktif])

  return (
    <div className="wrap section">
      <Judul kecil="Portofolio" sub="Contoh karya yang pernah ditempa. Mau yang berbeda? Pesan khusus juga bisa.">Karya Pande Pasir Wetan</Judul>
      <div className="chips">
        <button className={!aktif ? 'chip on' : 'chip'} onClick={() => setParams({})}>Semua</button>
        {kategori.data?.map((k) => (
          <button key={k.kategori} className={aktif === k.kategori ? 'chip on' : 'chip'} onClick={() => setParams({ kategori: k.kategori })}>
            {k.label}
          </button>
        ))}
      </div>
      <Muat state={karya} kosong="Belum ada karya di kategori ini.">
        {(list) => <div className="grid3">{list.map((k) => <KartuKarya key={k.id} k={k} />)}</div>}
      </Muat>
      <div className="card pad cta">
        <h3>Tidak menemukan yang kamu cari?</h3>
        <p>Kirim foto atau sketsa barang yang kamu mau, pengrajin kami akan menempanya.</p>
        <Link to="/pesan?kategori=khusus" className="btn">Pesan Khusus</Link>
      </div>
    </div>
  )
}
