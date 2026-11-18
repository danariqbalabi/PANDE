import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

function distanceToSegment(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy)
}

export default forwardRef(function CuttingGame({ onCut }, ref) {
  const canvas = useRef(null)
  const world = useRef({ blocks: [], pieces: [], trail: [], last: null })
  const score = useRef(onCut)
  score.current = onCut

  useImperativeHandle(ref, () => ({
    stop() { world.current.last = null; world.current.trail = [] },
    cut(point) {
      const w = world.current
      const previous = w.last || point
      w.last = point
      if (Math.hypot(point.x - previous.x, point.y - previous.y) < 2) return
      w.trail.push({ ...point, age: 0 })
      for (const block of w.blocks) {
        if (block.cut || distanceToSegment(block, previous, point) > block.size * .75) continue
        block.cut = true
        score.current()
        for (const direction of [-1, 1]) {
          w.pieces.push({ ...block, half: true, x: block.x + direction * 5, vx: direction * (65 + Math.random() * 55), vy: -80, spin: direction * 3, life: 1.4 })
        }
        for (let i = 0; i < 14; i++) {
          const angle = Math.random() * Math.PI * 2, speed = 70 + Math.random() * 180
          w.pieces.push({ x: point.x, y: point.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 45, size: 1 + Math.random() * 3, metal: block.metal, life: .4 + Math.random() * .5, particle: true, rotation: angle, spin: 2 })
        }
      }
      w.blocks = w.blocks.filter((b) => !b.cut)
    },
  }), [])

  useEffect(() => {
    const el = canvas.current, ctx = el.getContext('2d')
    const w = world.current
    let width = 1, height = 1, frame, lastTime = 0, spawn = .4
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const rect = el.getBoundingClientRect()
      width = rect.width; height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = width * dpr; el.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    resize()

    function drawBlock(b) {
      ctx.save()
      ctx.translate(b.x, b.y); ctx.rotate(b.rotation)
      const bw = b.half ? b.size * .48 : b.size, bh = b.size * .7
      const gradient = ctx.createLinearGradient(-bw / 2, -bh / 2, bw / 2, bh / 2)
      gradient.addColorStop(0, b.metal ? '#d7e0e7' : '#d29b60')
      gradient.addColorStop(.45, b.metal ? '#82939f' : '#956039')
      gradient.addColorStop(1, b.metal ? '#3d4852' : '#54311c')
      ctx.fillStyle = gradient; ctx.strokeStyle = b.metal ? '#bac6cc' : '#dcaa76'
      ctx.lineWidth = 1
      ctx.fillRect(-bw / 2, -bh / 2, bw, bh)
      ctx.strokeRect(-bw / 2, -bh / 2, bw, bh)
      ctx.strokeStyle = b.metal ? 'rgba(255,255,255,.3)' : 'rgba(48,24,10,.45)'
      for (let i = 1; i < 4; i++) {
        const y = -bh / 2 + bh * i / 4
        ctx.beginPath(); ctx.moveTo(-bw / 2 + 3, y); ctx.lineTo(bw / 2 - 3, y + (b.metal ? -3 : 2)); ctx.stroke()
      }
      if (b.half) {
        ctx.fillStyle = b.metal ? '#eef6fa' : '#eac292'
        ctx.fillRect(-bw / 2, -bh / 2, 3, bh)
      }
      ctx.restore()
    }

    function tick(time) {
      const dt = Math.min((time - (lastTime || time)) / 1000, .04)
      lastTime = time
      ctx.clearRect(0, 0, width, height)
      spawn -= dt
      if (spawn <= 0 && w.blocks.length < 8) {
        w.blocks.push({ x: width * (.15 + Math.random() * .7), y: -35, size: Math.min(54, width * .13), metal: true, vy: reducedMotion ? 45 : 65 + Math.random() * 45, rotation: Math.random() * 2, spin: (Math.random() - .5) * 1.2 })
        spawn = reducedMotion ? 1.6 : .75
      }
      for (const b of w.blocks) {
        b.y += b.vy * dt; b.rotation += b.spin * dt; drawBlock(b)
      }
      w.blocks = w.blocks.filter((b) => b.y < height + 60)
      for (const p of w.pieces) {
        p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 240 * dt; p.rotation += p.spin * dt
        ctx.globalAlpha = Math.min(1, Math.max(0, p.life * 2))
        if (p.particle) {
          ctx.fillStyle = p.metal ? '#ffd18c' : '#c89259'
          ctx.fillRect(p.x, p.y, p.size, p.metal ? p.size * .45 : p.size)
        } else drawBlock(p)
      }
      ctx.globalAlpha = 1
      w.pieces = w.pieces.filter((p) => p.life > 0)
      w.trail.forEach((p) => { p.age += dt })
      w.trail = w.trail.filter((p) => p.age < .18)
      if (w.trail.length > 1) {
        ctx.beginPath(); ctx.moveTo(w.trail[0].x, w.trail[0].y)
        w.trail.slice(1).forEach((p) => ctx.lineTo(p.x, p.y))
        ctx.strokeStyle = '#ffe3b4'; ctx.lineWidth = 2; ctx.lineCap = 'round'
        ctx.shadowColor = '#ff7b25'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0
      }
      frame = requestAnimationFrame(tick)
    }
    const visibility = () => {
      cancelAnimationFrame(frame); lastTime = 0; w.last = null
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', visibility)
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  return <canvas className="cutting-canvas" ref={canvas} aria-hidden="true" />
})
