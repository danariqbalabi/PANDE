import { useRef, useState } from 'react'
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
  const tool = TOOLS.find((item) => item.id === selected)
  const Art = tool.Art

  function start(e) {
    if (!e.isPrimary || e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, ...angle }
    setDragging(true)
    if (playing) follow(e, true)
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
    setAngle({
      spin: drag.current.spin + (e.clientX - drag.current.x) * 0.65,
      tilt: Math.max(-35, Math.min(35, drag.current.tilt - (e.clientY - drag.current.y) * 0.3)),
    })
  }

  function stop() {
    drag.current = null
    setDragging(false)
    game.current?.stop()
  }

  function keyDown(e) {
    if (playing) {
      if (e.key === 'Escape') { setPlaying(false); stop() }
      return
    }
    const steps = { ArrowLeft: -15, ArrowRight: 15, ArrowUp: -15, ArrowDown: 15 }
    if (!(e.key in steps)) return
    e.preventDefault()
    setAngle((a) => ({ ...a, spin: a.spin + steps[e.key] }))
  }

  return (
    <div className={`knife-showcase${dragging ? ' is-dragging' : ''}${playing ? ' is-cutting' : ''}`}>
      <div className="knife-orbit" aria-hidden="true" />
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
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onKeyDown={keyDown}
      >
        <div className="knife-angle" style={playing ? {
          left: pointer ? pointer.x : '50%', top: pointer ? pointer.y : '45%',
          transform: 'translate(-68%, -50%) rotate(-25deg)',
        } : { transform: `rotateX(${angle.tilt}deg) rotateZ(${angle.spin}deg)` }}>
          <div className="knife-spin">
            <div key={selected} className="knife-swap">
              <Art className={`hero-knife hero-knife-${selected}`} title={`${tool.label} tempa PANDE`} />
            </div>
          </div>
        </div>
      </div>
      <div className="knife-controls">
        <span id="knife-help">{playing ? 'Tahan & geser buat potong kayu / besi' : 'Geser untuk memutar ↔'}<span className="sr-only">{playing ? '. Tekan Escape untuk keluar.' : '. Gunakan tombol panah saat ilustrasi dipilih.'}</span></span>
        <div className="knife-picker" role="group" aria-label="Pilih jenis alat tempa">
          {TOOLS.map((item) => (
            <button key={item.id} type="button" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}>
              {item.label}
            </button>
          ))}
        </div>
        <button className="cutting-toggle" type="button" aria-pressed={playing} onClick={() => {
          stop(); setPointer(null); setCuts(0); setPlaying((p) => !p)
        }}>{playing ? 'Selesai main ↗' : 'Coba potong ↗'}</button>
      </div>
    </div>
  )
}
