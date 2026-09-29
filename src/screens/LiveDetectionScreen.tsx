import { useState, useEffect, useRef } from 'react'
import GloveModel from '../components/GloveModel'

type Screen = string
interface Props { navigate: (s: Screen) => void }
type RiskLevel = 'safe'|'caution'|'high-risk'|'critical'

const TEMPS = [36, 38, 40, 41, 43, 44, 43, 45, 46, 48, 47, 48]

function getRisk(t: number): RiskLevel {
  if (t < 40)  return 'safe'
  if (t < 43)  return 'caution'
  if (t < 49)  return 'high-risk'
  return 'critical'
}

const RISK_LABEL = { safe:'SAFE', caution:'CAUTION', 'high-risk':'HIGH RISK', critical:'CRITICAL' }
const RISK_COLOR = { safe:'#2EB87C', caution:'#F5890A', 'high-risk':'#E84018', critical:'#D60019' }
const AIRBAG_STATE: Record<RiskLevel,'deflated'|'caution'|'high-risk'|'critical'> = {
  safe: 'deflated', caution: 'caution', 'high-risk': 'high-risk', critical: 'critical'
}
const AIRBAG_LABEL = { safe:'Standby', caution:'Alert', 'high-risk':'Inflating', critical:'Inflated' }

export default function LiveDetectionScreen({ navigate }: Props) {
  const [tempIdx, setTempIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [history, setHistory] = useState(TEMPS.slice(0, 1))
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
      setTempIdx(i => {
        const next = (i + 1) % TEMPS.length
        setHistory(h => [...h.slice(-11), TEMPS[next]])
        return next
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const temp = TEMPS[tempIdx]
  const risk = getRisk(temp)

  useEffect(() => {
    if (risk === 'critical') navigate('critical-warning')
  }, [risk])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  // SVG chart: w=280, h=56
  const chartW = 280, chartH = 56
  const minT = 34, maxT = 52
  const pts = history.map((t, i) => {
    const x = (i / 11) * chartW
    const y = chartH - ((t - minT) / (maxT - minT)) * chartH
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="geometric-page min-h-screen pb-28 pt-14">

      {/* NAV BAR */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2 flex items-center gap-4"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('device-check')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full blink" style={{ background: '#D60019' }}/>
          <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text)' }}>LIVE</span>
        </div>
        <div className="flex-1"/>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(255,90,26,0.08)', border: '1px solid rgba(255,90,26,0.2)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M23 7l-7 5 7 5V7zM1 5h15v14H1z" stroke="#FF5A1A" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span className="mono text-xs font-semibold" style={{ color: 'var(--orange)' }}>78%</span>
        </div>
      </div>

      <div className="px-5">

        {/* TEMP + RISK HERO */}
        <div className="geometric-temperature text-center mb-2 rounded-[26px] py-3">
          <div className="inline-flex items-baseline gap-1">
            <span className="mono font-black" style={{ fontSize: 72, lineHeight: 1, color: RISK_COLOR[risk], letterSpacing: '-0.04em' }}>
              {temp}
            </span>
            <span className="mono text-3xl font-bold" style={{ color: RISK_COLOR[risk] }}>°C</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-1">
            <div className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
              style={{ background: RISK_COLOR[risk] }}>
              {RISK_LABEL[risk]}
            </div>
            <span className="mono text-sm font-medium" style={{ color: 'var(--muted)' }}>{mm}:{ss}</span>
          </div>
        </div>

        {/* GLOVE MODEL — state-aware */}
        <div className="geometric-stage flex justify-center mb-2 relative rounded-[28px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-60 h-60 rounded-full"
              style={{
                background: `radial-gradient(circle, ${RISK_COLOR[risk]}18 0%, transparent 70%)`,
                transition: 'background 0.5s ease'
              }}
            />
          </div>
          <GloveModel
            airbagState={AIRBAG_STATE[risk]}
            width={210}
            className="relative z-10 drop-shadow-xl glove-center-adjust"
          />
        </div>

        {/* STATUS STRIP */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Contact Time', value: `${mm}:${ss}`, mono: true },
            { label: 'Airbag Status', value: AIRBAG_LABEL[risk], mono: false },
            { label: 'Device', value: 'TG-01', mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="geo-card rounded-[18px] p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
              <p className={`text-sm font-bold ${mono ? 'mono' : ''}`} style={{ color: 'var(--text)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* TEMPERATURE CHART */}
        <div className="geo-card rounded-[24px] p-4 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>SURFACE TEMPERATURE</p>
            <span className="mono text-xs font-medium" style={{ color: RISK_COLOR[risk] }}>Live</span>
          </div>

          {/* Risk threshold lines */}
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 16}`} style={{ overflow: 'visible' }}>
            {/* Grid / threshold lines */}
            {[{t:49,c:'#D60019',label:'49°C Critical'},{t:43,c:'#E84018',label:'43°C High'},{t:40,c:'#F5890A',label:'40°C Caution'}].map(({t,c,label}) => {
              const y = chartH - ((t - minT)/(maxT - minT)) * chartH
              return (
                <g key={t}>
                  <line x1="0" y1={y} x2={chartW} y2={y} stroke={c} strokeWidth="1" strokeDasharray="4 3" opacity="0.35"/>
                  <text x={chartW - 2} y={y - 2} textAnchor="end" fontSize="7" fill={c} fontFamily="DM Mono, monospace">{label}</text>
                </g>
              )
            })}
            {/* Gradient fill */}
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RISK_COLOR[risk]} stopOpacity="0.25"/>
                <stop offset="100%" stopColor={RISK_COLOR[risk]} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {history.length > 1 && (
              <>
                <polyline
                  points={pts + ` ${(history.length-1)/11*chartW},${chartH} 0,${chartH}`}
                  fill="url(#chart-grad)"
                  stroke="none"
                />
                <polyline
                  points={pts}
                  fill="none"
                  stroke={RISK_COLOR[risk]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Latest dot */}
                {(() => {
                  const lx = ((history.length-1)/11)*chartW
                  const ly = chartH - ((history[history.length-1]-minT)/(maxT-minT))*chartH
                  return <circle cx={lx} cy={ly} r="3.5" fill={RISK_COLOR[risk]}/>
                })()}
              </>
            )}
          </svg>
        </div>

        {/* END SESSION */}
        <button
          onClick={() => navigate('work-report')}
          className="w-full py-4 rounded-[18px] font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="6" width="12" height="12" rx="2" stroke="var(--text)" strokeWidth="1.8"/>
          </svg>
          End Session
        </button>
      </div>
    </div>
  )
}
