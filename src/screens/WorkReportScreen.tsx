import { useState } from 'react'

type Screen = string
interface Props { navigate: (s: Screen) => void }

const sessionTemps = [36,38,40,43,45,48,46,48,44,41,43,46,48,52,49,45,42,40,38,36]
const W = 280, H = 80, minT = 32, maxT = 56

function tempToY(t: number) { return H - ((t - minT) / (maxT - minT)) * H }
function tempPath() {
  return sessionTemps.map((t, i) => {
    const x = (i / (sessionTemps.length - 1)) * W
    const y = tempToY(t)
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')
}

const MAINT = [
  { label: 'Sensor Calibration', status: 'normal' as const,  value: 'Accurate ±0.5°C' },
  { label: 'Airbag Airtightness', status: 'normal' as const, value: 'Sealed ✓' },
  { label: 'Air Pump',            status: 'normal' as const,  value: 'Functional' },
  { label: 'Battery Health',      status: 'caution' as const, value: '78% · Degrading' },
  { label: 'Bluetooth Module',    status: 'normal' as const,  value: 'BT 5.0 OK' },
]

const statusColor = { normal: '#2EB87C', caution: '#F5890A', error: '#D60019' }

export default function WorkReportScreen({ navigate }: Props) {
  const [tab, setTab] = useState<'report'|'maintenance'>('report')

  const path = tempPath()
  // Fill path
  const fill = path + ` L${W},${H} L0,${H} Z`

  return (
    <div className="geometric-page min-h-screen pb-28 pt-14">

      {/* NAV BAR */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2 flex items-center gap-4"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('live-detection')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Session Complete</h1>
        <div className="flex-1"/>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,90,26,0.1)', color: 'var(--orange)' }}>
          Export PDF
        </button>
      </div>

      <div className="px-5">

        {/* SESSION HEADER */}
        <div className="geometric-report rounded-2xl p-4 mb-4 shadow-sm fade-up"
          style={{ background: '#171B1C', border: '1px solid rgba(239,98,44,0.28)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Session · Today</p>
              <p className="text-sm font-semibold text-white mt-0.5">Pudong Industrial Zone</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(214,0,25,0.25)', color: '#FF6B6B' }}>
              HIGH RISK SESSION
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label:'Start',    value:'08:24' },
              { label:'End',      value:'11:38' },
              { label:'Duration', value:'3h 14m' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="mono text-lg font-bold text-white">{value}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex gap-2 mb-4 rounded-2xl p-1" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {(['report','maintenance'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'var(--orange)' : 'transparent',
                color: tab === t ? 'white' : 'var(--muted)',
              }}
            >
              {t === 'report' ? '📋 Work Report' : '🔧 Maintenance'}
            </button>
          ))}
        </div>

        {tab === 'report' ? (
          <>
            {/* KEY STATS GRID */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label:'Max Temperature',    value:'52°C',  color:'#FF8A84', mono:true },
                { label:'Heat Contacts',       value:'14×',   color:'var(--text)', mono:true },
                { label:'High-Risk Duration',  value:'38 min',color:'#E84018', mono:false },
                { label:'Airbag Deployments',  value:'3×',    color:'#F5890A', mono:true },
              ].map(({ label, value, color, mono }) => (
                <div key={label} className="geo-card rounded-[24px] p-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
                  <p className="text-xs mb-1" style={{ color:'var(--muted)' }}>{label}</p>
                  <p className={`text-2xl font-bold ${mono?'mono':''}`} style={{ color }}>{value}</p>
                </div>
              ))}
            </div>

            {/* TEMPERATURE TIMELINE */}
            <div className="geo-card rounded-[24px] p-4 mb-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color:'var(--muted)' }}>TEMPERATURE TIMELINE</p>
                <span className="mono text-xs" style={{ color:'var(--muted)' }}>08:24 → 11:38</span>
              </div>
              <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow:'visible' }}>
                <defs>
                  <linearGradient id="fill-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E84018" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#E84018" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Threshold lines */}
                {[{t:49,c:'#D60019'},{t:43,c:'#E84018'},{t:40,c:'#F5890A'}].map(({t,c}) => {
                  const y = tempToY(t)
                  return <line key={t} x1="0" y1={y} x2={W} y2={y} stroke={c} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4"/>
                })}
                {/* Fill */}
                <path d={fill} fill="url(#fill-grad)"/>
                {/* Line */}
                <path d={path} fill="none" stroke="#E84018" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Max point marker */}
                {(() => {
                  const maxIdx = sessionTemps.indexOf(Math.max(...sessionTemps))
                  const mx = (maxIdx / (sessionTemps.length-1)) * W
                  const my = tempToY(sessionTemps[maxIdx])
                  return (
                    <g>
                      <circle cx={mx} cy={my} r="4" fill="#D60019"/>
                      <text x={mx} y={my-7} textAnchor="middle" fontSize="8" fill="#D60019" fontFamily="DM Mono,monospace" fontWeight="600">52°C</text>
                    </g>
                  )
                })()}
                {/* X-axis labels */}
                {['08:24','09:30','10:30','11:38'].map((label, i) => {
                  const x = (i / 3) * W
                  return <text key={label} x={x} y={H + 16} textAnchor={i===0?'start':i===3?'end':'middle'} fontSize="7" fill="var(--muted)" fontFamily="DM Mono,monospace">{label}</text>
                })}
              </svg>
            </div>

            {/* TIME DISTRIBUTION */}
            <div className="geo-card rounded-[24px] p-4 mb-4" style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color:'var(--muted)' }}>EXPOSURE DISTRIBUTION</p>
              {/* Stacked bar */}
              <div className="flex rounded-xl overflow-hidden h-6 mb-3">
                <div className="flex items-center justify-center" style={{ width:'40%', background:'#2EB87C' }}>
                  <span className="text-[10px] font-bold text-white">40%</span>
                </div>
                <div className="flex items-center justify-center" style={{ width:'35%', background:'#F5890A' }}>
                  <span className="text-[10px] font-bold text-white">35%</span>
                </div>
                <div className="flex items-center justify-center" style={{ width:'25%', background:'#D60019' }}>
                  <span className="text-[10px] font-bold text-white">25%</span>
                </div>
              </div>
              <div className="flex gap-4">
                {[{c:'#2EB87C',l:'Safe',v:'1h 17m'},{c:'#F5890A',l:'Caution',v:'1h 08m'},{c:'#D60019',l:'High Risk',v:'49 min'}].map(({c,l,v})=>(
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background:c }}/>
                    <div>
                      <p className="text-[10px]" style={{ color:'var(--muted)' }}>{l}</p>
                      <p className="text-xs font-semibold" style={{ color:'var(--text)' }}>{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* MAINTENANCE STATUS */}
            <div className="rounded-2xl overflow-hidden mb-4" style={{ border:'1px solid var(--border)' }}>
              {MAINT.map((m, idx) => (
                <div key={m.label}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ background:'var(--card)', borderBottom: idx < MAINT.length-1 ? '1px solid var(--border)' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: m.status === 'normal' ? 'rgba(46,184,124,0.1)' : 'rgba(245,137,10,0.1)' }}>
                    {m.status === 'normal' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="#2EB87C" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v5M12 16h.01" stroke="#F5890A" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="12" cy="12" r="9" stroke="#F5890A" strokeWidth="1.8"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color:'var(--text)' }}>{m.label}</p>
                    <p className="text-xs" style={{ color: statusColor[m.status] }}>{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* NEXT MAINTENANCE */}
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-3"
              style={{ background:'var(--card)', border:'1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background:'rgba(245,137,10,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="#F5890A" strokeWidth="1.8"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#F5890A" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs" style={{ color:'var(--muted)' }}>Next Scheduled Maintenance</p>
                <p className="text-base font-semibold" style={{ color:'var(--text)' }}>Oct 15, 2026</p>
                <p className="text-xs" style={{ color:'#F5890A' }}>Battery replacement recommended</p>
              </div>
            </div>

            {/* DIAGNOSIS BUTTONS */}
            <button className="w-full py-3.5 rounded-2xl font-semibold text-sm mb-3 flex items-center justify-center gap-2"
              style={{ background:'rgba(255,90,26,0.08)', border:'1.5px solid var(--orange)', color:'var(--orange)' }}>
              🔍 Run Diagnosis
            </button>
          </>
        )}

        {/* BOTTOM ACTION */}
        <button
          onClick={() => navigate('home')}
          className="w-full py-4 rounded-[18px] font-semibold text-base text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background:'linear-gradient(135deg,#FF6B2C,#FF4500)' }}
        >
          View Full Report
        </button>
      </div>
    </div>
  )
}
