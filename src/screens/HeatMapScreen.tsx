import { useState } from 'react'

type Screen = string
interface Props { navigate: (s: Screen) => void }

type Filter = 'all' | 'safe' | 'caution' | 'risk'

interface Marker {
  id: number; x: number; y: number
  level: 'safe'|'caution'|'risk'
  type: string; temp: string; time: string
  distance: string; reports: number
}

const markers: Marker[] = [
  { id:1, x:72,  y:120, level:'risk',    type:'Bus Stop Rail',       temp:'52°C', time:'12 min ago', distance:'0.2 km', reports:7 },
  { id:2, x:148, y:80,  level:'caution', type:'Playground Equipment', temp:'44°C', time:'38 min ago', distance:'0.5 km', reports:3 },
  { id:3, x:208, y:148, level:'risk',    type:'Metal Bench',          temp:'49°C', time:'5 min ago',  distance:'0.8 km', reports:5 },
  { id:4, x:268, y:60,  level:'caution', type:'Traffic Sign Post',    temp:'43°C', time:'1h ago',     distance:'1.1 km', reports:2 },
  { id:5, x:310, y:180, level:'safe',    type:'Bike Rack',            temp:'38°C', time:'2h ago',     distance:'1.4 km', reports:1 },
  { id:6, x:118, y:210, level:'risk',    type:'Manhole Cover',        temp:'58°C', time:'2 min ago',  distance:'0.3 km', reports:9 },
  { id:7, x:340, y:112, level:'caution', type:'Construction Fence',   temp:'45°C', time:'22 min ago', distance:'1.6 km', reports:4 },
]

const levelColor = { safe:'#2EB87C', caution:'#F5890A', risk:'#D60019' }
const levelLabel = { safe:'Safe', caution:'Caution', risk:'High Risk' }

export default function HeatMapScreen({ navigate }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<'nearby'|'latest'>('nearby')
  const [selected, setSelected] = useState<Marker | null>(null)

  const visible = markers.filter(m =>
    filter === 'all' ? true : m.level === filter
  )

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: '#202728' }}>

      {/* ── FULL-SCREEN MAP ── */}
      <svg viewBox="0 0 390 720" width="100%" height="100%" className="absolute inset-0">
        {/* Terrain */}
        <rect width="390" height="720" fill="#202728"/>

        {/* Water body */}
        <path d="M0,550 Q80,530 160,545 Q240,560 320,540 Q380,530 390,545 L390,720 L0,720 Z" fill="#304248" opacity="0.6"/>

        {/* Major roads */}
        {[0,65,130,195,260,325,390].map((x,i) => (
          <line key={`v${i}`} x1={x} y1="0" x2={x} y2="720" stroke="#4A5453" strokeWidth={x===195?10:6}/>
        ))}
        {[0,80,160,240,320,400,480,560,640,720].map((y,i) => (
          <line key={`h${i}`} x1="0" y1={y} x2="390" y2={y} stroke="#4A5453" strokeWidth={y===240?8:5}/>
        ))}

        {/* City blocks */}
        {[
          [68,84,54,72],[68,164,54,72],[68,244,54,72],
          [133,84,54,72],[133,164,54,72],
          [198,84,54,72],[198,244,54,72],
          [263,84,54,72],[263,164,54,72],[263,244,54,72],
          [328,84,54,72],[328,164,54,72],
          [68,408,54,72],[133,408,54,72],[198,408,54,72],
        ].map(([x,y,w,h],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#343D3D"/>
        ))}

        {/* Parks */}
        <rect x="198" y="164" width="54" height="72" rx="4" fill="#3D5145"/>
        <rect x="133" y="328" width="120" height="72" rx="4" fill="#3D5145"/>

        {/* Building details */}
        <rect x="72"  y="88"  width="14" height="14" rx="2" fill="#414A49"/>
        <rect x="90"  y="88"  width="28" height="64" rx="2" fill="#414A49"/>
        <rect x="202" y="88"  width="46" height="30" rx="2" fill="#414A49"/>
        <rect x="267" y="88"  width="20" height="64" rx="2" fill="#414A49"/>
        <rect x="291" y="88"  width="26" height="40" rx="2" fill="#414A49"/>

        {/* ── RISK MARKERS ── */}
        {visible.map(m => (
          <g key={m.id} onClick={() => setSelected(m)} style={{ cursor:'pointer' }}>
            {/* Outer ring */}
            <circle cx={m.x} cy={m.y} r="14" fill={levelColor[m.level]} opacity="0.18"/>
            {/* Marker */}
            <circle cx={m.x} cy={m.y} r="9" fill={levelColor[m.level]}/>
            <circle cx={m.x} cy={m.y} r="5" fill="white" opacity="0.9"/>
            {/* Report count badge */}
            {m.reports >= 5 && (
              <g>
                <circle cx={m.x+8} cy={m.y-8} r="7" fill={levelColor[m.level]}/>
                <text x={m.x+8} y={m.y-5} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold" fontFamily="Inter">{m.reports}</text>
              </g>
            )}
          </g>
        ))}

        {/* Current location */}
        <circle cx="195" cy="300" r="16" fill="var(--orange)" opacity="0.15"/>
        <circle cx="195" cy="300" r="9" fill="var(--orange)"/>
        <circle cx="195" cy="300" r="5" fill="white"/>
        <circle cx="195" cy="300" r="2" fill="#F7E5DA"/>
      </svg>

      {/* ── TOP OVERLAY ── */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-14 pb-3 flex flex-col gap-2.5"
        style={{ background: 'rgba(29,34,35,0.84)', backdropFilter: 'blur(16px)' }}>
        {/* Search bar */}
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="var(--muted)" strokeWidth="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Search location or facility…</span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {(['all','safe','caution','risk'] as Filter[]).map(f => {
            const active = filter === f
            const color = f === 'safe' ? '#2EB87C' : f === 'caution' ? '#F5890A' : f === 'risk' ? '#D60019' : 'var(--text)'
            const label = f === 'all' ? 'All' : f === 'safe' ? 'Safe' : f === 'caution' ? 'Caution' : 'High Risk'
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: active ? (f === 'all' ? '#141819' : color) : 'var(--card)',
                  color: active ? 'white' : (f === 'all' ? 'var(--text)' : color),
                  border: `1.5px solid ${active ? 'transparent' : (f === 'all' ? 'var(--border)' : color + '55')}`,
                }}
              >
                {label}
              </button>
            )
          })}
          <div className="flex-shrink-0 mx-2 w-px self-stretch" style={{ background: 'var(--border)' }}/>
          {(['nearby','latest'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: sort === s ? '#141819' : 'var(--card)',
                color: sort === s ? 'white' : 'var(--muted)',
                border: `1.5px solid ${sort === s ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {s === 'nearby' ? 'Nearby' : 'Latest'}
            </button>
          ))}
        </div>
      </div>

      {/* LOCATE BUTTON */}
      <button
        className="absolute bottom-36 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="var(--orange)" strokeWidth="2"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── DETAIL CARD (bottom sheet) ── */}
      {selected ? (
        <div
          className="glass-card absolute bottom-24 left-3 right-3 rounded-3xl p-4 shadow-2xl fade-up"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
                  style={{ background: levelColor[selected.level] }}>
                  {levelLabel[selected.level].toUpperCase()}
                </div>
                <span className="mono text-sm font-semibold" style={{ color: levelColor[selected.level] }}>
                  {selected.temp}
                </span>
              </div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text)' }}>{selected.type}</h3>
            </div>
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--card-2)', color: 'var(--muted)' }}>
              ✕
            </button>
          </div>

          {/* Photo strip */}
          <div className="rounded-xl overflow-hidden mb-3 h-24 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2A2A2A, #3A3A3A)' }}>
            <div className="text-center">
              <div className="text-2xl mb-1">📷</div>
              <p className="text-xs text-white opacity-60">Field photo</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Reported', value: selected.time },
              { label: 'Distance', value: selected.distance },
              { label: 'Reports', value: `${selected.reports}x` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-2.5" style={{ background: 'var(--card-2)' }}>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{label}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-2xl font-semibold text-sm text-white"
            style={{ background: levelColor[selected.level] }}>
            View Details
          </button>
        </div>
      ) : (
        /* Collapsed summary strip */
        <div className="glass-card absolute bottom-24 left-3 right-3 rounded-2xl p-3.5 shadow-lg flex items-center justify-between"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Showing {visible.length} risk points</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Tap a marker for details</p>
          </div>
          <div className="flex gap-2">
            {(['risk','caution','safe'] as const).map(l => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: levelColor[l] }}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
