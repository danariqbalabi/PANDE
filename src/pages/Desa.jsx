import { Link } from 'react-router-dom'
import { Judul } from '../components/Ui.jsx'
import { DESA_URL } from '../lib/config.js'

const POTENSI = [
  ['Pande besi Gayeng Ruyeng', '20 pengrajin yang menempa alat tani, perkakas, dan pisau dari besi bekas. Binaan YDBA sejak 2020.', '/karya'],
  ['Melon hidroponik KWT', 'Kelompok Wanita Tani membudidayakan melon dengan sistem tetes, apung, dan Dutch bucket.', null],
  ['Bank sampah', 'Warga memilah sampah dari rumah. Minyak jelantah diolah menjadi sabun dan lilin.', null],
  ['UMKM desa', 'Kerajinan lencana dan plakat, perhiasan, serta aneka makanan basah untuk acara dan instansi.', null],
]

export default function Desa() {
  return (
    <div className="wrap section">
      <Judul kecil="Jelajahi" sub="Desa Pasir Wetan, Kecamatan Karanglewas, Kabupaten Banyumas, Jawa Tengah. Berbukit, sekitar 300 mdpl, dengan 2 dusun, 3 RW, dan 17 RT.">
        Desa Pasir Wetan
      </Judul>
      <div className="grid2">
        {POTENSI.map(([t, d, to]) => (
          <div key={t} className="card pad">
            <h3>{t}</h3>
            <p>{d}</p>
            {to && <Link to={to}>Lihat</Link>}
          </div>
        ))}
      </div>
      <div className="card pad cta">
        <h3>Ingin tahu lebih banyak?</h3>
        <p>Kunjungi website resmi Desa Pasir Wetan untuk layanan, berita, dan informasi desa.</p>
        <a className="btn" href={DESA_URL} target="_blank" rel="noreferrer">Buka pasirwetan.desa.id</a>
      </div>
    </div>
  )
}
