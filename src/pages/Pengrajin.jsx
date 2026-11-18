import { useData } from '../lib/useData.js'
import { Muat, Judul } from '../components/Ui.jsx'

export default function Pengrajin() {
  const state = useData((s) => s.from('pengrajin').select('id, nama, keahlian, bio, foto_url').order('nama'))
  return (
    <div className="wrap section">
      <Judul kecil="Gayeng Ruyeng" sub="Kelompok pengrajin pande besi Desa Pasir Wetan, berdiri 10 Maret 2020. Keterampilan turun-temurun, kini 20 anggota.">
        Tangan di balik setiap tempaan
      </Judul>
      <Muat state={state} kosong="Profil pengrajin akan ditampilkan setelah mendapat izin dari masing-masing pengrajin.">
        {(list) => (
          <div className="grid3">
            {list.map((p) => (
              <div key={p.id} className="card pad orang">
                {p.foto_url && <img src={p.foto_url} alt={p.nama} loading="lazy" />}
                <h3>{p.nama}</h3>
                {p.keahlian?.length > 0 && <div className="chips">{p.keahlian.map((k) => <span key={k} className="chip kecil">{k}</span>)}</div>}
                {p.bio && <p>{p.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </Muat>
    </div>
  )
}
