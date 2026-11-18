import { Link, useParams } from 'react-router-dom'
import { useData } from '../lib/useData.js'
import { Muat } from '../components/Ui.jsx'
import { kisaran } from '../lib/format.js'

export default function KaryaDetail() {
  const { id } = useParams()
  const state = useData((s) =>
    s.from('karya').select('*, kategori_harga(label), pengrajin(nama)').eq('id', id).maybeSingle(), [id])

  return (
    <div className="wrap section">
      <Muat state={state} kosong="Karya tidak ditemukan.">
        {(k) => (
          <div className="detail">
            <div className="foto besar">{k.foto_url ? <img src={k.foto_url} alt={k.nama} /> : <span>PANDE</span>}</div>
            <div>
              <small className="tag">{k.kategori_harga?.label}</small>
              <h1>{k.nama}</h1>
              <p className="harga">{kisaran(k.harga_mulai, k.harga_sampai)}</p>
              {k.deskripsi && <p>{k.deskripsi}</p>}
              <dl className="dl">
                {k.ukuran && <><dt>Ukuran</dt><dd>{k.ukuran}</dd></>}
                {k.pengrajin?.nama && <><dt>Pengrajin</dt><dd>{k.pengrajin.nama}</dd></>}
                <dt>Bahan</dt><dd>Besi bekas tempaan ulang</dd>
              </dl>
              <Link className="btn" to={`/pesan?kategori=${k.kategori}&jenis=${encodeURIComponent(k.nama)}`}>Pesan yang seperti ini</Link>
            </div>
          </div>
        )}
      </Muat>
    </div>
  )
}
