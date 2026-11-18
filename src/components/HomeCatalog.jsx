import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KATEGORI } from '../lib/config.js'

export default function HomeCatalog() {
  const [selected, setSelected] = useState('alat_tani')
  const category = KATEGORI.find((k) => k.kategori === selected)
  const destination = selected === 'khusus' ? '/pesan?kategori=khusus' : `/karya?kategori=${selected}`
  return <section className="wrap home-catalog" aria-labelledby="home-catalog-title">
    <div className="catalog-heading"><div><span className="workshop-index">PILIH KEBUTUHAN</span><h2 id="home-catalog-title">Alat untuk<br /><em>kerjaanmu.</em></h2></div><Link to="/karya">Buka seluruh koleksi ↗</Link></div>
    <div className="catalog-bench">
      <div className="catalog-select" role="group" aria-label="Kategori alat">
        {KATEGORI.map((k, i) => <button type="button" key={k.kategori} aria-pressed={selected === k.kategori} onClick={() => setSelected(k.kategori)}><small>{String(i + 1).padStart(2, '0')}</small><span>{k.label}</span><span aria-hidden="true">↗</span></button>)}
        <p>Ukuran khusus? <Link to="/pesan">Kirim acuannya ↗</Link></p>
      </div>
      <div className="catalog-sample" aria-live="polite">
        <div className="catalog-sample-top"><span>{category.label}</span><span>{String(KATEGORI.indexOf(category) + 1).padStart(2, '0')} / 06</span></div>
        <Link key={selected} className="catalog-sample-image" to={destination}>
          <img className="category-art" src={`/kategori/${selected}.webp`} alt={`Ilustrasi kategori ${category.label}`} width="1200" height="900" />
        </Link>
        <div className="catalog-sample-foot"><div><h3>{category.label}</h3><p>{category.desc}</p><small className="category-art-note">Ilustrasi kategori</small></div>
          <Link to={destination} aria-label={selected === 'khusus' ? 'Ajukan desain khusus' : `Lihat koleksi ${category.label}`}>↗</Link>
        </div>
      </div>
    </div>
  </section>
}
