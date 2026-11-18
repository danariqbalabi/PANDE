import { useEffect, useRef, useState } from 'react'
import { orderCodeFromScan } from '../lib/scanCode.js'

export default function OrderScanner({ onRead }) {
  const [camera, setCamera] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Arahkan kode pesanan ke sini, ya.')
  const video = useRef(null)
  const alive = useRef(true)
  const callback = useRef(onRead)
  callback.current = onRead
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])

  function accept(text) {
    const code = orderCodeFromScan(text)
    if (!alive.current) return
    setCamera(false)
    if (!code) {
      setMessage(/\bPW-/i.test(text) ? 'Itu paspor produk. Gunakan QR pesanan dengan kode PSN.' : 'Kode pesanan belum terbaca. Coba QR atau barcode yang memuat PSN-XXXXXX.')
      return
    }
    callback.current(code)
    setMessage(`${code} ketemu! Lengkapi 4 digit HP di formulir.`)
  }

  useEffect(() => {
    if (!camera) return
    let disposed = false, controls
    const element = video.current
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        if (disposed) return
        const reader = new BrowserMultiFormatReader()
        controls = await reader.decodeFromVideoDevice(undefined, element, (result, error, control) => {
          if (result && !disposed) { control.stop(); accept(result.getText()) }
        })
        if (disposed) controls.stop()
      } catch (error) {
        if (disposed) return
        setCamera(false)
        setMessage(error.name === 'NotAllowedError' ? 'Izin kamera belum diberikan. Bisa pakai foto kode juga.' : 'Kamera belum bisa dibuka. Pilih foto kode atau ketik kode pesanan.')
      }
    }
    start()
    return () => {
      disposed = true
      controls?.stop()
      element?.srcObject?.getTracks().forEach((track) => track.stop())
    }
  }, [camera])

  async function upload(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 10 * 1024 * 1024) return setMessage('Fotonya maksimal 10 MB, ya.')
    setCamera(false); setBusy(true)
    const url = URL.createObjectURL(file)
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser')
      if (!alive.current) return
      const result = await new BrowserMultiFormatReader().decodeFromImageUrl(url)
      accept(result.getText())
    } catch {
      if (alive.current) setMessage('Belum ketemu kodenya. Coba foto lebih dekat dan terang.')
    } finally { URL.revokeObjectURL(url); if (alive.current) setBusy(false) }
  }

  return <div className={`order-scanner${camera ? ' scanning' : ''}`}>
    <div className="scanner-ears" aria-hidden="true"><i /><i /></div>
    <div className="scanner-screen">
      {camera ? <><video ref={video} autoPlay muted playsInline /><span className="scanner-sweep" /></> : <svg viewBox="0 0 160 110" fill="none" aria-hidden="true">
        <path d="M35 40V24H54 M106 24H125V40 M35 70V86H54 M106 86H125V70" stroke="#a6bba7" strokeWidth="3" strokeLinecap="round" />
        <path d="M57 43V55 M68 40V56 M81 43V55 M94 40V56 M104 43V55" stroke="#e8ecdf" strokeWidth="4" />
        <path d="M67 69Q80 81 94 69" stroke="#e8ecdf" strokeWidth="2.5" strokeLinecap="round" /><circle cx="53" cy="65" r="4" fill="#e7a178" /><circle cx="108" cy="65" r="4" fill="#e7a178" />
      </svg>}
      <span className="scanner-badge">{camera ? 'LAGI MENCARI…' : 'SI PEMBACA KODE'}</span>
    </div>
    <p role="status">{busy ? 'Sebentar, baca fotonya dulu…' : message}</p>
    <div className="scanner-actions"><button type="button" disabled={busy} onClick={() => { setMessage('Posisikan kode di tengah layar.'); setCamera((v) => !v) }}>{camera ? 'Tutup kamera' : 'Buka kamera'}</button><label className={busy ? 'disabled' : ''}>Pilih foto<input type="file" accept="image/*" disabled={busy} onChange={upload} /></label></div>
    <small>QR / barcode pesanan · tetap perlu 4 digit HP</small>
  </div>
}
