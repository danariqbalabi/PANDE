import { useEffect, useRef, useState } from 'react'

const kurangiGerak = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Percikan api (bara) yang naik dari bawah kanvas, seperti di bengkel tempa.
export function Sparks({ density = 70 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (kurangiGerak()) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const baru = (awal) => ({
      x: w * (0.45 + Math.random() * 0.5),
      y: awal ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.6 + Math.random() * 1.8),
      r: 0.6 + Math.random() * 1.8,
      life: 0,
      max: 120 + Math.random() * 180,
    })
    const ps = Array.from({ length: density }, () => baru(true))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        p.life++
        p.x += p.vx + Math.sin((p.life + i) * 0.05) * 0.25
        p.y += p.vy
        p.vy *= 0.998
        const t = 1 - p.life / p.max
        if (t <= 0 || p.y < -10) { ps[i] = baru(false); continue }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
        g.addColorStop(0, `rgba(255,214,140,${0.9 * t})`)
        g.addColorStop(0.3, `rgba(255,120,30,${0.55 * t})`)
        g.addColorStop(1, 'rgba(255,80,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(tick)
    }
    tick()
    // berhenti saat tab tidak terlihat (hemat baterai HP)
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', vis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [density])
  return <canvas ref={ref} className="sparks" aria-hidden="true" />
}

// Muncul halus saat elemen masuk layar.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [tampil, setTampil] = useState(false)
  useEffect(() => {
    if (kurangiGerak() || !('IntersectionObserver' in window)) return setTampil(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTampil(true); io.disconnect() }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${tampil ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

// Angka berjalan dari 0 ke nilai saat terlihat.
export function Counter({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const target = Number(value) || 0
    if (kurangiGerak()) return setN(target)
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const mulai = performance.now()
      const step = (now) => {
        const t = Math.min((now - mulai) / 1400, 1)
        setN(target * (1 - Math.pow(1 - t, 3)))
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    })
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])
  return <span ref={ref}>{n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>
}

export function Marquee({ items }) {
  const isi = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {isi.map((t, i) => <span key={i}>{t}<i>/</i></span>)}
      </div>
    </div>
  )
}

// Cap bundar "DITEMPA DI PASIR WETAN", meniru cap pada bilah.
export function Stamp({ className = '' }) {
  return (
    <svg className={`stamp ${className}`} viewBox="0 0 200 200" role="img" aria-label="Cap Ditempa di Pasir Wetan">
      <defs>
        <path id="stamp-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fontFamily="'JetBrains Mono', monospace" fontSize="15" letterSpacing="4.2" fill="currentColor">
        <textPath href="#stamp-circle">DITEMPA DI PASIR WETAN • BANYUMAS •</textPath>
      </text>
      <text x="100" y="98" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="800" fontSize="34" fill="currentColor">PANDE</text>
      <text x="100" y="122" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="2" fill="currentColor">EST. 2020</text>
    </svg>
  )
}
