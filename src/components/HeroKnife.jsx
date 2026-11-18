import { useEffect, useRef, useState } from 'react'
import { ChefKnife, Golok, Sabit } from './ToolArt.jsx'
import CuttingGame from './CuttingGame.jsx'

const TOOLS = [
  { id: 'pisau', label: 'Pisau', Art: ChefKnife },
  { id: 'golok', label: 'Golok', Art: Golok },
  { id: 'celurit', label: 'Celurit', Art: Sabit },
]

export default function HeroKnife() {
  const [selected, setSelected] = useState('pisau')
  const [dragging, setDragging] = useState(false)
  const [angle, setAngle] = useState({ spin: -28, tilt: 0 })
  const [playing, setPlaying] = useState(false)
  const [cuts, setCuts] = useState(0)
  const [pointer, setPointer] = useState(null)
  const game = useRef(null)
  const drag = useRef(null)
  const holdTimer = useRef(null)
  const tool = TOOLS.find((item) => item.id === selected)
  const Art = tool.Art

  function start(e) {
    if (!e.isPrimary || e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, onTool: Boolean(e.target.closest('.knife-activate')), ...angle }
    setDragging(true)
    if (drag.current.onTool) {
      const rect = e.currentTarget.getBoundingClientRect()
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      holdTimer.current = setTimeout(() => { setPointer(point); setCuts(0); setPlaying(true) }, 280)
    }
  }

  function follow(e, cutting) {
    const rect = e.currentTarget.getBoundingClientRect()
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setPointer(point)
    if (cutting) game.current?.cut(point)
  }

  function move(e) {
    if (playing) {
      follow(e, Boolean(drag.current))
      return
    }
    if (!drag.current) return
    if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 10) {
      clearTimeout(holdTimer.current)
    }
    setAngle({
      spin: drag.current.spin + (e.clientX - drag.current.x) * 0.65,
      tilt: Math.max(-35, Math.min(35, drag.current.tilt - (e.clientY - drag.current.y) * 0.3)),
    })
  }

  function stop() {
    clearTimeout(holdTimer.current)
    drag.current = null
    setDragging(false)
    game.current?.stop()
  }

  function endCutting() {
    stop()
    setPlaying(false)
    setPointer(null)
  }

  useEffect(() => {
    const release = () => endCutting()
    window.addEventListener('pointerup', release)
    window.addEventListener('blur', release)
    return () => { clearTimeout(holdTimer.current); window.removeEventListener('pointerup', release); window.removeEventListener('blur', release) }
  }, [])

  function swap(direction) {
    endCutting()
    setSelected(TOOLS[(TOOLS.findIndex((t) => t.id === selected) + direction + TOOLS.length) % TOOLS.length].id)
  }

  function keyDown(e) {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.closest('.knife-activate')) {
      e.preventDefault()
      if (!e.repeat) { setCuts(0); setPlaying(true) }
      return
    }
    if (playing) {
      if (e.key === 'Escape') endCutting()
      return
    }
    const steps = { ArrowLeft: -15, ArrowRight: 15, ArrowUp: -15, ArrowDown: 15 }
    if (!(e.key in steps)) return
    e.preventDefault()
    setAngle((a) => ({ ...a, spin: a.spin + steps[e.key] }))
  }

  return (
    <div className={`knife-showcase${dragging ? ' is-dragging' : ''}${playing ? ' is-cutting' : ''}`}>
      {playing && <>
        <CuttingGame ref={game} onCut={() => setCuts((n) => n + 1)} />
        <div className="cutting-score" aria-live="polite"><strong>{cuts}</strong> potongan</div>
      </>}
      <div
        className="knife-touch"
        tabIndex={0}
        role="group"
        aria-label={`Ilustrasi ${tool.label.toLowerCase()} interaktif`}
        aria-describedby="knife-help"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={endCutting}
        onPointerCancel={endCutting}
        onLostPointerCapture={endCutting}
        onKeyDown={keyDown}
        onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') endCutting() }}
      >
        <div className="knife-angle" style={playing ? {
          left: pointer ? pointer.x : '50%', top: pointer ? pointer.y : '45%',
          transform: 'translate(-68%, -50%) rotate(-25deg)',
        } : { transform: `rotateX(${angle.tilt}deg) rotateZ(${angle.spin}deg)` }}>
          <div className="knife-spin">
            <button key={selected} className="knife-swap knife-activate" type="button" onContextMenu={(e) => e.preventDefault()}
              aria-label={`Tahan ${tool.label.toLowerCase()} untuk memotong besi`}>
              <Art className={`hero-knife hero-knife-${selected}`} title={`${tool.label} tempa PANDE`} />
            </button>
          </div>
        </div>
      </div>
      <div className="knife-controls">
        <span id="knife-help">{playing ? 'Lepas untuk kembali' : 'Tahan alat untuk memotong besi'}<span className="sr-only">. Bisa juga tahan Spasi atau Enter pada alat.</span></span>
      </div>
      <div className="knife-carousel" role="group" aria-label="Pilih jenis alat tempa">
          <button type="button" onClick={() => swap(-1)} aria-label="Alat sebelumnya"><svg viewBox="0 0 28 40" aria-hidden="true"><path d="M21 4 7 20l14 16" /></svg></button>
          <span aria-live="polite">{tool.label}<small>{String(TOOLS.findIndex((t) => t.id === selected) + 1).padStart(2, '0')} / 03</small></span>
          <button type="button" onClick={() => swap(1)} aria-label="Alat berikutnya"><svg viewBox="0 0 28 40" aria-hidden="true"><path d="m7 4 14 16L7 36" /></svg></button>
      </div>
    </div>
  )
}
