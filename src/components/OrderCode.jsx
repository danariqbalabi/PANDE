import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { SITE_URL } from '../lib/config.js'

export default function OrderCode({ code }) {
  const [image, setImage] = useState(null)
  useEffect(() => {
    let active = true
    QRCode.toDataURL(`${SITE_URL}/status?kode=${encodeURIComponent(code)}`, { width: 256, margin: 2 }).then((url) => { if (active) setImage(url) }).catch(() => {})
    return () => { active = false }
  }, [code])
  if (!image) return null
  return <div className="order-code"><img src={image} alt={`QR kode pesanan ${code}`} /><div><strong>Simpan kode pesanan</strong><p>Scan untuk mengisi kode saat cek status.</p><a href={image} download={`${code}.png`}>Unduh QR ↧</a></div></div>
}
