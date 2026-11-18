import { Judul } from '../components/Ui.jsx'

export default function Aturan() {
  return (
    <div className="wrap section narrow">
      <Judul kecil="Aturan pesanan">Sebelum memesan</Judul>
      <div className="card pad prose">
        <h3>Yang kami terima</h3>
        <p>Alat kerja (pertanian, pertukangan, bengkel), perlengkapan rumah tangga dan dapur, perlengkapan rumah, dekorasi, serta suvenir.</p>
        <h3>Yang tidak kami terima</h3>
        <p>Senjata dalam bentuk apa pun, termasuk pedang dan golok tempur, atau barang yang ditujukan untuk melukai orang. Pesanan seperti ini akan ditolak.</p>
        <h3>Harga dan pembayaran</h3>
        <ul>
          <li>Perkiraan di situs hanya kisaran awal. Harga final dikonfirmasi pengrajin setelah melihat foto/sketsa.</li>
          <li>Produksi dimulai setelah DP diterima.</li>
          <li>Pembayaran hanya ke rekening resmi kelompok yang diinformasikan lewat WhatsApp resmi PANDE.</li>
        </ul>
        <h3>Mutu dan cap desa</h3>
        <p>Hanya barang yang lolos pengecekan mutu kelompok yang dicap PASIR WETAN dan diberi QR paspor.</p>
        <h3>Data pribadi</h3>
        <p>Nama dan nomor WhatsApp hanya dipakai untuk memproses pesanan dan tidak ditampilkan di situs.</p>
      </div>
    </div>
  )
}
