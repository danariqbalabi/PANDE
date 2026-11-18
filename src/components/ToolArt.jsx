import { useId } from 'react'

// Hand-crafted SVG illustrations of PANDE forged products. Light comes from the top-left.
// Every gradient id is prefixed with a per-instance uid so many copies can share a page.

const useUid = () => 'ta' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
const url = (u, n) => `url(#${u}-${n})`

// Thin dark outline keeps silhouettes crisp on light backgrounds; light rims do the job on dark ones.
const OUT = { stroke: '#1d1f22', strokeOpacity: 0.55, strokeWidth: 1, strokeLinejoin: 'round' }
const EDGE = { fill: 'none', stroke: '#f7fafc', strokeWidth: 1.3, strokeLinecap: 'round' }
const SPINE = { fill: 'none', stroke: '#ffffff', strokeOpacity: 0.55, strokeWidth: 1, strokeLinecap: 'round' }
const BEVEL = { fill: 'none', stroke: '#3d444c', strokeOpacity: 0.25, strokeWidth: 0.8 }
const SCALE = { fill: '#3d444c', fillOpacity: 0.22 } // forge-scale / hamon band
const GRAIN = { fill: 'none', stroke: '#2e1c0f', strokeOpacity: 0.35, strokeWidth: 0.8, strokeLinecap: 'round' }
const WOODLIGHT = { fill: 'none', stroke: '#c48d5c', strokeOpacity: 0.5, strokeWidth: 1.4, strokeLinecap: 'round' }

const STEEL = [['0', '#e9edf1'], ['0.45', '#aab2bb'], ['0.85', '#5d6670'], ['1', '#7d8690']]
const stops = (list) => list.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)

function Defs({ u }) {
  return (
    <defs>
      <linearGradient id={`${u}-steel`} x1="0" y1="0" x2="0" y2="1">{stops(STEEL)}</linearGradient>
      <linearGradient id={`${u}-steelH`} x1="1" y1="0" x2="0" y2="0">{stops(STEEL)}</linearGradient>
      <linearGradient id={`${u}-wood`} x1="0" y1="0" x2="0" y2="1">
        {stops([['0', '#9b6a42'], ['0.35', '#8a5a35'], ['1', '#5a3a22']])}
      </linearGradient>
      <linearGradient id={`${u}-woodH`} x1="0" y1="0" x2="1" y2="0">
        {stops([['0', '#9b6a42'], ['0.35', '#8a5a35'], ['1', '#5a3a22']])}
      </linearGradient>
      <linearGradient id={`${u}-ring`} x1="0" y1="0" x2="0" y2="1">
        {stops([['0', '#f0d58a'], ['0.5', '#c08f2e'], ['1', '#6e4c14']])}
      </linearGradient>
      <linearGradient id={`${u}-iron`} x1="0" y1="0" x2="0" y2="1">
        {stops([['0', '#7a828b'], ['0.3', '#6b737c'], ['1', '#3a3f45']])}
      </linearGradient>
      <linearGradient id={`${u}-ironH`} x1="0" y1="0" x2="1" y2="0">
        {stops([['0', '#3a3f45'], ['0.35', '#848c95'], ['1', '#2f3338']])}
      </linearGradient>
      <linearGradient id={`${u}-sheen`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${u}-brass`} cx="0.35" cy="0.35" r="0.7">
        {stops([['0', '#fff1b8'], ['0.45', '#d9a93f'], ['1', '#7a5617']])}
      </radialGradient>
      <radialGradient id={`${u}-rivet`} cx="0.35" cy="0.35" r="0.7">
        {stops([['0', '#ffffff'], ['0.45', '#b9c1c9'], ['1', '#4a525b']])}
      </radialGradient>
      <radialGradient id={`${u}-shadow`}>
        <stop offset="0" stopColor="#000" stopOpacity="0.45" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function Art({ u, vb, label, title, className, rest, children }) {
  return (
    <svg viewBox={vb} role="img" aria-label={title || label} className={className} {...rest}>
      <title>{title || label}</title>
      <Defs u={u} />
      {children}
    </svg>
  )
}

function Rivet({ u, cx, cy, r = 3.6, brass }) {
  return <circle cx={cx} cy={cy} r={r} fill={url(u, brass ? 'brass' : 'rivet')} stroke="#2a2622" strokeOpacity="0.6" strokeWidth="0.7" />
}

function Shadow({ u, cx, cy, rx, ry = 6 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={url(u, 'shadow')} />
}

export function ChefKnife({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 400 120" label="Pisau koki tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={205} cy={104} rx={182} ry={7} />
            <path d="M140,42 C110,40 80,38 52,39 C34,40 22,46 20,56 C22,67 34,73 52,74 C80,75 110,73 140,71 Z" fill={url(u, 'wood')} {...OUT} />
            <path d="M136,44 C110,42 80,40 52,41 C40,42 30,46 26,52" {...WOODLIGHT} />
            <path d="M48,48 C80,46 110,47 134,49 M40,58 C75,57 105,59 134,60 M50,67 C80,67 110,66 134,65" {...GRAIN} />
            <Rivet u={u} cx={62} cy={56} />
            <Rivet u={u} cx={92} cy={56} />
            <Rivet u={u} cx={122} cy={56} />
            <path d="M136,38 Q140,35 152,34 L152,80 Q140,79 136,75 Z" fill={url(u, 'steelH')} {...OUT} />
            <path d="M150,32 L300,30 C334,31 362,38 386,52 C352,70 306,82 240,84 L150,84 Z" fill={url(u, 'steel')} {...OUT} />
            <path d="M152,33 L300,31.5 C326,32 346,36 362,43 C344,46 330,49 312,47 C296,45 284,50 266,48 C250,46 236,51 218,49 C202,47 188,51 170,49 C162,48 156,49 152,48 Z" {...SCALE} />
            <path d="M152,32.6 L300,30.6 C330,31.5 356,37.5 380,50" {...SPINE} />
            <path d="M152,73 L240,74 C292,72 344,63 378,53" {...BEVEL} />
            <path d="M152,83 L240,83 C304,81 350,69 384,53" {...EDGE} />
            <path d="M168,58 l5,-5 l5,5 l-5,5 Z" fill="none" stroke="#3d444c" strokeOpacity="0.35" strokeWidth="0.9" />
          </>
    </Art>
  )
}

export function Golok({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 400 120" label="Golok tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={205} cy={106} rx={182} ry={7} />
            <path d="M132,44 C104,42 76,41 52,42 C36,43 24,48 19,58 C16,68 22,79 34,80 C46,81 56,76 70,74 C92,72 112,72 132,71 Z" fill={url(u, 'wood')} {...OUT} />
            <path d="M128,46 C104,44 76,43 52,44 C38,45 28,50 23,57" {...WOODLIGHT} />
            <path d="M44,52 C76,49 104,50 126,52 M32,64 C60,60 96,60 126,61 M40,74 C64,70 98,68 126,68" {...GRAIN} />
            <Rivet u={u} cx={70} cy={58} brass r={3.2} />
            <Rivet u={u} cx={104} cy={57} brass r={3.2} />
            <rect x="126" y="39" width="15" height="37" rx="3" fill={url(u, 'ring')} {...OUT} />
            <path d="M130,40 L130,75 M137,40 L137,75" stroke="#5a3f10" strokeOpacity="0.45" strokeWidth="0.8" />
            <path d="M140,40 L330,34 C356,33 376,38 388,48 C386,62 372,78 344,88 C300,100 220,96 140,78 Z" fill={url(u, 'steel')} {...OUT} />
            <path d="M142,41 L330,35 C350,34.5 366,37 378,42 C360,47 345,52 328,50 C310,48 296,54 278,52 C260,50 246,56 228,53 C210,50 196,55 178,52 C164,50 152,53 142,51 Z" {...SCALE} />
            <path d="M142,40.5 L330,34.6 C352,34 372,39 384,46" {...SPINE} />
            <path d="M142,70 C220,84 296,88 340,80 C362,74 378,62 386,50" {...BEVEL} />
            <path d="M142,77.5 C220,95 300,99 344,87 C370,79 384,64 387,50" {...EDGE} />
          </>
    </Art>
  )
}

export function Cleaver({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 400 160" label="Golok cincang (cleaver) tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={205} cy={147} rx={182} ry={7} />
            <path d="M128,36 C100,34 70,33 46,34 C30,35 20,41 18,49 C20,58 30,63 46,64 C70,65 100,63 128,61 Z" fill={url(u, 'wood')} {...OUT} />
            <path d="M124,38 C100,36 70,35 46,36 C34,37 26,41 22,46" {...WOODLIGHT} />
            <path d="M40,43 C70,40 100,41 122,43 M32,52 C66,51 100,52 122,53 M44,59 C74,60 100,59 122,58" {...GRAIN} />
            <Rivet u={u} cx={56} cy={49} brass />
            <Rivet u={u} cx={86} cy={49} brass />
            <Rivet u={u} cx={116} cy={49} brass />
            <path d="M124,32 L144,30 L144,66 L124,64 Q122,48 124,32 Z" fill={url(u, 'steelH')} {...OUT} />
            <path
              d="M140,22 L370,18 Q384,18 384,32 L386,110 Q386,124 372,126 C300,132 220,131 140,126 Z M364,52 A8,8 0 1,0 348,52 A8,8 0 1,0 364,52 Z"
              fill={url(u, 'steel')}
              fillRule="evenodd"
              {...OUT}
            />
            <path d="M142,23 L370,19 Q382,19 383,30 C368,36 352,32 336,36 C318,40 302,35 284,39 C266,43 250,37 232,41 C214,45 198,39 180,43 C166,46 152,42 142,44 Z" {...SCALE} />
            <path d="M200,22 L240,21 L190,128 L150,127 Z" fill="#fff" fillOpacity="0.1" />
            <circle cx="356" cy="52" r="8" fill="none" stroke="#3d444c" strokeWidth="1.4" />
            <path d="M361,58 A8,8 0 0,1 350,58.5" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" />
            <path d="M142,22.6 L370,18.6 Q383,18.6 383.5,30" {...SPINE} />
            <path d="M142,112 C220,117 300,118 384,110" {...BEVEL} />
            <path d="M142,125.5 C220,130.5 300,131.5 371,125.6 Q385,123.5 385.5,112" {...EDGE} />
          </>
    </Art>
  )
}

export function Sabit({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 240 240" label="Sabit (arit) tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={130} cy={227} rx={95} />
            <path d="M86,142 C70,92 88,42 138,28 C178,18 214,38 224,74 C208,56 184,46 156,50 C120,56 102,94 106,140 Z" fill={url(u, 'steel')} {...OUT} />
            <path d="M92,134 C80,94 96,52 138,38 C170,29 200,40 214,60" fill="none" stroke="#3d444c" strokeOpacity="0.2" strokeWidth="7" strokeLinecap="round" />
            <path d="M87,138 C71,92 89,43 138,29 C177,19 212,38 223,72" {...SPINE} />
            <path d="M214,68 C200,59 182,55 158,58 C128,63 112,96 113,136" {...BEVEL} />
            <path d="M223,73 C207,56 184,47 156,51 C121,57 103,94 106,139" {...EDGE} />
            <g transform="translate(96 146) rotate(18)">
              <path d="M-11,5 L11,5 L12,70 Q12,80 0,80 Q-12,80 -12,70 Z" fill={url(u, 'woodH')} {...OUT} />
              <path d="M-8,10 C-9,35 -8,55 -9,72" {...WOODLIGHT} />
              <path d="M-3,10 C-4,35 -2,55 -4,74 M5,10 C6,35 4,55 6,72" {...GRAIN} />
              <rect x="-12.5" y="-6" width="25" height="12" rx="2.5" fill={url(u, 'ring')} {...OUT} />
              <Rivet u={u} cx={0} cy={38} brass r={3.2} />
              <rect x="-12" y="72" width="24" height="7" rx="3" fill={url(u, 'ring')} {...OUT} />
            </g>
          </>
    </Art>
  )
}

export function Cangkul({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 240 240" label="Cangkul tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={90} cy={228} rx={80} />
            <g transform="translate(76 146) rotate(-40.7)">
              <rect x="0" y="-7" width="188" height="14" rx="7" fill={url(u, 'wood')} {...OUT} />
              <path d="M20,-5 L182,-5" {...WOODLIGHT} />
              <path d="M24,-1 C70,-2 120,0 176,-1 M30,3 C80,2 130,4 170,3" {...GRAIN} />
            </g>
            <path d="M40,150 L112,150 Q118,150 120,156 L132,212 Q133,220 125,220 L28,220 Q20,220 22,212 L32,156 Q34,150 40,150 Z" fill={url(u, 'steel')} {...OUT} />
            <path d="M36,152 L116,152 L120,168 C104,164 92,172 76,168 C60,164 46,172 30,168 Z" {...SCALE} />
            <path d="M48,180 L40,214" stroke="#fff" strokeOpacity="0.18" strokeWidth="10" />
            <path d="M33,152 L37,151 M40,150.6 L112,150.6" {...SPINE} />
            <path d="M27,206 L129,206" {...BEVEL} />
            <path d="M24,219.4 L129,219.4" {...EDGE} />
            <g transform="translate(76 146) rotate(-40.7)">
              <rect x="-6" y="-10" width="24" height="20" rx="5" fill={url(u, 'iron')} {...OUT} />
              <path d="M-2,-8.5 L14,-8.5" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" />
            </g>
          </>
    </Art>
  )
}

export function GarpuRumput({ className, title, ...rest }) {
  const u = useUid()
  const tines = [-22, -7.5, 7.5, 22]
  return (
    <Art vb="0 0 240 240" label="Garpu rumput tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={125} cy={226} rx={98} />
            <g transform="translate(30 208) rotate(-45)">
              <rect x="0" y="-6" width="124" height="12" rx="6" fill={url(u, 'wood')} {...OUT} />
              <path d="M10,-4 L118,-4" {...WOODLIGHT} />
              <path d="M14,0 C50,-1 90,1 116,0 M20,3 C60,2 96,4 114,3" {...GRAIN} />
              {tines.map((y) => (
                <g key={y}>
                  <path d={`M170,${y - 3} C198,${y - 3} 228,${y - 2.4} 250,${y} C228,${y + 1.6} 198,${y + 3} 170,${y + 3} Z`} fill={url(u, 'steel')} {...OUT} />
                  <path d={`M172,${y - 2.2} C200,${y - 2.2} 226,${y - 1.8} 246,${y - 0.4}`} {...SPINE} />
                </g>
              ))}
              <path d="M148,-6 C160,-6 160,-26 176,-26 L176,26 C160,26 160,6 148,6 Z" fill={url(u, 'steel')} {...OUT} />
              <path d="M150,-5 C158,-5 160,-15 168,-21" fill="none" stroke="#3d444c" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M118,-7.5 L150,-5.5 L150,5.5 L118,7.5 Z" fill={url(u, 'steel')} {...OUT} />
              <rect x="116" y="-8.5" width="6" height="17" rx="2" fill={url(u, 'iron')} {...OUT} />
              <path d="M124,-6.6 L148,-5" {...SPINE} />
            </g>
          </>
    </Art>
  )
}

export function Palu({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 240 240" label="Palu pandai besi" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={120} cy={224} rx={92} />
            <g transform="translate(40 205) rotate(-50)">
              <path d="M0,-9 C40,-8 100,-6 172,-7 L172,7 C100,6 40,8 0,9 Q-6,0 0,-9 Z" fill={url(u, 'wood')} {...OUT} />
              <path d="M4,-7 C40,-6.5 100,-4.5 150,-5" {...WOODLIGHT} />
              <path d="M6,-2 C50,-3 100,-1 146,-2 M8,4 C50,3 100,5 146,3" {...GRAIN} />
              <path d="M144,-48 L186,-48 L184,-38 L182,20 L174,52 L156,52 L148,20 L146,-38 Z" fill={url(u, 'steelH')} {...OUT} />
              <path d="M146,-38 L184,-38 M148,20 L182,20" {...BEVEL} />
              <path d="M144.5,-47 L185.5,-47" stroke="#f4f7fa" strokeWidth="2" />
              <path d="M175,51 L157,51" {...EDGE} />
              <path d="M150,-30 C162,-26 170,-30 180,-26 L180,-12 C170,-16 160,-10 150,-14 Z" {...SCALE} />
            </g>
          </>
    </Art>
  )
}

export function Engsel({ className, title, ...rest }) {
  const u = useUid()
  const hole = (cx, cy) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r="3.6" fill="#1e2125" />
      <path d={`M${cx - 3},${cy + 2} A3.6,3.6 0 0,0 ${cx + 3},${cy + 2}`} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
    </g>
  )
  const curl = { fill: 'none', stroke: url(u, 'iron'), strokeWidth: 5, strokeLinecap: 'round' }
  return (
    <Art vb="0 0 240 240" label="Engsel pintu tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={120} cy={204} rx={100} />
            <path d="M16,74 L42,70 L42,170 L16,166 Z" fill={url(u, 'iron')} {...OUT} />
            <path d="M172,109 C166,94 178,86 187,91 C193,95 189,103 182,101" {...curl} />
            <path d="M172,131 C166,146 178,154 187,149 C193,145 189,137 182,139" {...curl} />
            <path d="M56,94 L176,108 C190,100 206,98 226,120 C206,142 190,140 176,132 L56,146 Z" fill={url(u, 'iron')} {...OUT} />
            <path d="M58,95 L176,109 C190,101 206,99 225,119" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1" />
            <path d="M17,75 L41,71.5" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1" />
            {[[78, 112, 9, 5], [112, 128, 7, 4], [150, 114, 8, 4], [196, 122, 6, 4]].map(([cx, cy, rx, ry]) => (
              <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" fillOpacity="0.12" />
            ))}
            {[hole(90, 120), hole(130, 120), hole(165, 120), hole(205, 120), hole(29, 96), hole(29, 145)]}
            <rect x="40" y="62" width="20" height="116" rx="4" fill={url(u, 'ironH')} {...OUT} />
            <path d="M40,100 L60,100 M40,140 L60,140" stroke="#1e2125" strokeWidth="1.4" />
            <path d="M46,65 L46,97 M46,103 L46,137 M46,143 L46,175" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
            <rect x="44" y="56" width="12" height="7" rx="2" fill={url(u, 'iron')} {...OUT} />
            <rect x="44" y="177" width="12" height="7" rx="2" fill={url(u, 'iron')} {...OUT} />
          </>
    </Art>
  )
}

export function PembukaBotol({ className, title, ...rest }) {
  const u = useUid()
  const xs = Array.from({ length: 11 }, (_, i) => 40 + i * 9)
  return (
    <Art vb="0 0 240 240" label="Pembuka botol tempa" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={120} cy={224} rx={92} />
            <g transform="translate(34 200) rotate(-45)">
              <circle cx="14" cy="0" r="10.5" fill="none" stroke={url(u, 'iron')} strokeWidth="7" />
              <circle cx="14" cy="0" r="14" fill="none" {...OUT} />
              <circle cx="14" cy="0" r="7" fill="none" {...OUT} />
              <path d="M5,-8 A12,12 0 0,1 22,-9" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
              <rect x="24" y="-5" width="130" height="10" rx="3" fill={url(u, 'iron')} {...OUT} />
              {xs.map((x) => (
                <g key={x}>
                  <path d={`M${x},-5 L${x + 5},-5 L${x + 11},5 L${x + 6},5 Z`} fill="#fff" fillOpacity="0.35" />
                  <path d={`M${x + 5},-5 L${x + 8},-5 L${x + 14},5 L${x + 11},5 Z`} fill="#000" fillOpacity="0.25" />
                </g>
              ))}
              <rect x="34" y="-6" width="5" height="12" rx="1.5" fill={url(u, 'iron')} {...OUT} />
              <rect x="143" y="-6" width="5" height="12" rx="1.5" fill={url(u, 'iron')} {...OUT} />
              <path
                d="M148,-6 C162,-7 170,-24 194,-24 C214,-24 228,-13 228,0 C228,13 214,24 194,24 C170,24 162,7 148,6 Z M184,-11 L204,-11 C212,-11 215,-6 215,0 C215,6 212,11 204,11 L184,11 C189,5 189,-5 184,-11 Z"
                fill={url(u, 'iron')}
                fillRule="evenodd"
                {...OUT}
              />
              <path d="M152,-6 C164,-8 172,-22 194,-22.5 C210,-23 222,-15 226,-6" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="1" />
              <path d="M184.5,-10 C188,-5 188,5 184.5,10" fill="none" stroke="#f7fafc" strokeOpacity="0.7" strokeWidth="1" />
            </g>
          </>
    </Art>
  )
}

const ANVIL_BODY =
  'M22,60 C55,54 85,52 110,52 L125,52 L125,48 L268,48 L268,74 L250,78 C225,82 210,88 205,105 L205,130 C205,140 220,146 240,150 L250,170 L72,170 L82,150 C102,146 117,140 117,130 L117,105 C112,90 95,82 70,76 C50,70 32,66 22,60 Z'

export function Anvil({ className, title, ...rest }) {
  const u = useUid()
  return (
    <Art vb="0 0 300 200" label="Landasan tempa (anvil)" title={title} className={className} rest={rest} u={u}>
          <>
            <Shadow u={u} cx={160} cy={176} rx={124} ry={9} />
            <path d={ANVIL_BODY} fill={url(u, 'steel')} {...OUT} />
            <path d={ANVIL_BODY} fill={url(u, 'sheen')} />
            <path d="M72,170 L82,150 L240,150 L250,170 Z" fill="#000" fillOpacity="0.2" />
            <path d="M82,150 L240,150" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />
            <path d="M125,48.5 L268,48.5 L268,55 L125,55 Z" fill="#fff" fillOpacity="0.4" />
            <path d="M24,60 C55,54 85,52.6 124,52.6" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" />
            <path d="M126,58 C150,62 170,58 196,62 C220,66 244,60 266,63 L266,57 L126,57 Z" {...SCALE} />
            <rect x="240" y="48" width="10" height="3" fill="#1e2125" fillOpacity="0.7" />
            <circle cx="225" cy="49.5" r="1.8" fill="#1e2125" fillOpacity="0.7" />
            <path d="M268,48.5 L268,74" stroke="#1e2125" strokeOpacity="0.35" strokeWidth="2" />
          </>
    </Art>
  )
}

export const KATEGORI_ART = {
  alat_tani: Cangkul,
  pertukangan: Palu,
  dapur: ChefKnife,
  rumah_dekor: Engsel,
  suvenir: PembukaBotol,
  khusus: Anvil,
}

export function ToolArt({ kategori, className, title }) {
  const C = KATEGORI_ART[kategori] ?? Anvil
  return <C className={className} title={title} />
}

export function KnifeSet({ className }) {
  return (
    <svg viewBox="0 0 520 360" role="img" aria-label="Set pisau tempa PANDE" className={className}>
      <title>Set pisau tempa PANDE</title>
      <Cleaver x={30} y={0} width={375} height={150} />
      <Golok x={70} y={110} width={400} height={120} />
      <ChefKnife x={100} y={185} width={400} height={120} />
      <ChefKnife x={200} y={268} width={260} height={78} title="Pisau kupas" />
    </svg>
  )
}
