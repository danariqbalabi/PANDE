import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Effects.jsx'
import { KONTAK } from '../data/demo.js'
import './carakerja.css'

const LANGKAH = [
  {
    judul: 'Ceritakan barang yang kamu butuhkan',
    isi: 'Pilih dari koleksi, atau kirim foto dan sketsa barang besi yang kamu mau: alat tani, pisau dapur, perkakas, sampai pesanan khusus.',
    poin: [['Dari koleksi', 'Klik "Pesan yang seperti ini" di barang yang kamu suka.'], ['Pesanan khusus', 'Isi ukuran dan kegunaan, lalu kirim sketsa lewat WhatsApp.']],
    foto: '/karya/set-gr-sp.jpg',
  },
  {
    judul: 'Dicocokkan dengan pengrajin yang tepat',
    isi: 'Gayeng Ruyeng punya 20 anggota dengan keahlian berbeda. Pesananmu diteruskan ke penempa yang paling cocok, atau kamu bisa memilih pengrajinnya sendiri.',
    poin: [['Sesuai keahlian', 'Pisau ke penempa bilah, cangkul dan kudi ke penempa alat tani.'], ['Pilih sendiri', 'Buka profil pengrajin lalu tekan "Pesan dari …".']],
    foto: '/karya/kudi.jpg',
  },
  {
    judul: 'Sepakati harga, lalu bayar DP',
    isi: 'Kamu dapat kisaran harga di awal. Setelah pengrajin melihat ukuran dan sketsa, harga final dikonfirmasi lewat WhatsApp. Produksi dimulai setelah DP.',
    poin: [['Tanpa perantara', 'Kamu bicara langsung dengan kelompok pengrajin.'], ['Transparan', 'Harga dihitung dari bahan, jam kerja, dan finishing.']],
    foto: '/karya/chefs-knife.jpg',
  },
  {
    judul: 'Ditempa dari besi bekas, kamu bisa memantau',
    isi: 'Bilah ditempa dari baja per kendaraan bekas, disepuh, diasah, lalu dipasang gagang. Status pesanan bisa dicek kapan saja dengan kode pesanan.',
    poin: [['Cek status', 'Masukkan kode pesanan dan 4 digit akhir nomor HP.'], ['Foto proses', 'Pengrajin bisa mengirim foto proses tempa.']],
    foto: '/karya/golok-sembelih.jpg',
  },
  {
    judul: 'Diterima, dengan cap dan paspor produk',
    isi: 'Barang yang lolos cek mutu dicap PASIR WETAN dan diberi QR paspor: siapa penempanya, asal besinya, cara merawat, dan tombol untuk servis atau asah ulang.',
    poin: [['Purna jual', 'Scan QR untuk minta asah ulang atau pesan lagi.'], ['Kenali desanya', 'Paspor mengajakmu menjelajahi Desa Pasir Wetan.']],
    foto: '/karya/sabit.jpg',
  },
]

const FAQ = [
  ['Berapa lama barang selesai ditempa?', 'Tergantung jenis, jumlah, dan antrean pesanan. Perkiraan waktu dikonfirmasi bersama harga final.'],
  ['Apakah bisa memesan dalam jumlah banyak?', 'Bisa, misalnya alat tani untuk kelompok tani atau suvenir untuk instansi. Tulis jumlahnya di formulir pesanan.'],
  ['Apakah semua barang memakai besi bekas?', 'Bahan utama kami baja per kendaraan bekas. Beberapa produk memakai baja lain (misalnya Bohler) dan selalu dicantumkan di halaman produknya.'],
  ['Bagaimana cara membayar?', 'Pembayaran DP dan pelunasan hanya ke rekening resmi kelompok yang diinformasikan lewat WhatsApp resmi.'],
  ['Barang apa yang tidak kami terima?', 'Senjata dalam bentuk apa pun. Kami hanya membuat alat kerja, perlengkapan rumah tangga, dan dekorasi.'],
]

export default function CaraKerja() {
  const [aktif, setAktif] = useState(0)
  // Sorot langkah yang sedang terlihat di layar (stepper di samping).
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-langkah]')]
    if (!('IntersectionObserver' in window) || !els.length) return
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setAktif(Number(e.target.dataset.langkah)) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="ck">
      <section className="ck-hero wrap">
        <div className="ck-hero-copy">
          <small className="label">Cara kerja</small>
          <h1>Bagaimana kami menghubungkan pengrajin dan pemesan</h1>
          <p className="lead">PANDE mempertemukanmu langsung dengan 20 pande besi Gayeng Ruyeng di Desa Pasir Wetan. Tanpa perantara, dari sketsa sampai jadi.</p>
          <div className="actions">
            <Link to="/pesan" className="btn">Mulai Pesan <span aria-hidden="true">→</span></Link>
            <Link to="/karya" className="btn ghost">Lihat Koleksi</Link>
          </div>
        </div>
        <div className="ck-hero-foto" aria-hidden="true">
          <img src="/karya/set-gr.jpg" alt="" className="f1" />
          <img src="/karya/kudi.jpg" alt="" className="f2" />
          <img src="/karya/golok-lubuk.jpg" alt="" className="f3" />
        </div>
      </section>

      <section className="ck-langkah wrap">
        <nav className="ck-rail" aria-label="Langkah">
          {LANGKAH.map((l, i) => (
            <a key={i} href={`#langkah-${i + 1}`} className={aktif === i ? 'on' : ''}>
              <span>{i + 1}</span>{l.judul.split(',')[0]}
            </a>
          ))}
        </nav>
        <ol className="ck-list">
          {LANGKAH.map((l, i) => (
            <li key={i} id={`langkah-${i + 1}`} data-langkah={i} className={i % 2 ? 'balik' : ''}>
              <Reveal className="ck-teks">
                <span className="ck-no">Langkah {i + 1}</span>
                <h2>{l.judul}</h2>
                <p>{l.isi}</p>
                <ul>{l.poin.map(([b, t]) => <li key={b}><b>{b}.</b> {t}</li>)}</ul>
              </Reveal>
              <Reveal className="ck-foto" delay={120}><img src={l.foto} alt="" loading="lazy" /></Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="ck-nilai">
        <div className="wrap">
          <small className="label on-dark">Kenapa langsung ke pengrajin</small>
          <h2>Uangmu sampai ke tangan yang menempa</h2>
          <div className="ck-nilai-grid">
            <Reveal><b>Tanpa perantara</b><p>Pesanan masuk ke kelompok, bukan ke pengepul. Harga lebih adil untuk pengrajin dan pembeli.</p></Reveal>
            <Reveal delay={90}><b>Dibuat untukmu</b><p>Ukuran, bentuk gagang, dan kegunaan disesuaikan dengan kebutuhanmu.</p></Reveal>
            <Reveal delay={180}><b>Besi diberi hidup baru</b><p>Baja per kendaraan bekas ditempa ulang. Setiap kilogramnya tercatat.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="ck-faq wrap narrow">
        <small className="label">Pertanyaan umum</small>
        <h2>Sebelum memesan</h2>
        {FAQ.map(([t, j]) => (
          <details key={t}><summary>{t}</summary><p>{j}</p></details>
        ))}
        <p className="muted ck-kontak">
          Masih ada pertanyaan? Hubungi {KONTAK.narahubung} di {KONTAK.telepon} atau Instagram @{KONTAK.instagram}.
        </p>
      </section>

      <section className="wrap section">
        <div className="cta-band">
          <div><h2>Siap memesan?</h2><p>Mulai dari koleksi, atau kirim sketsamu sendiri.</p></div>
          <Link to="/pesan" className="btn">Mulai Pesan <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  )
}
