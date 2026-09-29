import { useState, useEffect } from 'react'
import GloveModel from '../components/GloveModel'

type Screen = string
interface Props { navigate: (s: Screen) => void }

type ItemStatus = 'checking' | 'normal' | 'warning' | 'error'

interface CheckItem {
  id: string
  label: string
  sublabel: string
  status: ItemStatus
}

const ITEMS: CheckItem[] = [
  { id:'sensor', label:'Index Finger Sensor', sublabel:'Thermal accuracy ±0.5°C', status:'normal' },
  { id:'arduino', label:'Arduino Control Module', sublabel:'Firmware v2.4.1', status:'normal' },
  { id:'pump', label:'Air Pump', sublabel:'Micro air pump · Max 15 kPa', status:'normal' },
  { id:'airbag', label:'Palm Airbag', sublabel:'Airtight seal test', status:'normal' },
  { id:'battery', label:'Battery', sublabel:'78% · LiPo 600mAh', status:'normal' },
  { id:'bt', label:'Bluetooth Connection', sublabel:'BT 5.0 · -62 dBm', status:'normal' },
]

const statusColor = { checking:'var(--muted)', normal:'#2EB87C', warning:'#F5890A', error:'#D60019' }
const statusLabel = { checking:'Checking…', normal:'Normal', warning:'Warning', error:'Error' }

export default function DeviceCheckScreen({ navigate }: Props) {
  const [progress, setProgress] = useState(0)
  const [items, setItems] = useState<CheckItem[]>(
    ITEMS.map(i => ({ ...i, status: 'checking' as ItemStatus }))
  )
  const [allReady, setAllReady] = useState(false)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 12) + 8
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setAllReady(true)
      }
      setProgress(current)
      // Reveal items progressively
      const revealed = Math.floor((current / 100) * ITEMS.length)
      setItems(prev => prev.map((item, idx) => ({
        ...item,
        status: idx < revealed ? 'normal' : 'checking',
      })))
    }, 350)
    return () => clearInterval(interval)
  }, [])

  // Ring path: r=36, circumference ≈ 226
  const circumference = 226
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="geometric-page min-h-screen pb-28 pt-14">

      {/* NAV BAR */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2 flex items-center gap-4"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('device-connection')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Device Check</h1>
        <div className="flex-1"/>
        <span className="mono text-sm font-semibold" style={{ color: allReady ? '#2EB87C' : 'var(--orange)' }}>
          {progress}%
        </span>
      </div>

      <div className="px-5">

        {/* HERO: GLOVE + RING PROGRESS */}
        <div className="geometric-stage flex justify-center mb-4 relative rounded-[28px]" style={{ height: 300 }}>
          {/* Background subtle circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}/>
          </div>

          {/* Progress ring SVG */}
          <svg className="absolute" width="280" height="280" viewBox="0 0 80 80" style={{ top: 10, left: '50%', transform: 'translateX(-50%)' }}>
            {/* Track */}
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
            {/* Progress arc */}
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke={allReady ? '#2EB87C' : 'var(--orange)'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>

          {/* Progress stays visible beside the glove. */}
          <div className="absolute top-2 left-2 z-20 rounded-xl px-3 py-2"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="mono text-base font-bold" style={{ color: allReady ? '#2EB87C' : 'var(--orange)' }}>{progress}%</p>
            <p className="text-[9px] font-semibold tracking-wide" style={{ color: 'var(--muted)' }}>
              {allReady ? 'COMPLETE' : 'CHECKING'}
            </p>
          </div>

          <div className="relative mt-8 glove-center-adjust">
            <GloveModel airbagState="deflated" width={200} className="drop-shadow-lg"/>
          </div>
        </div>

        {/* Check title */}
        <div className="text-center mb-4">
          {allReady ? (
            <div className="fade-up">
              <h2 className="text-lg font-bold" style={{ color: '#2EB87C' }}>All systems ready</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>6/6 checks passed — safe to begin work</p>
            </div>
          ) : (
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>System Check in progress</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Please wait…</p>
            </div>
          )}
        </div>

        {/* CHECK ITEMS LIST */}
        <div className="geo-card rounded-[24px] overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
          {items.map((item, idx) => (
            <div key={item.id}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{
                background: 'var(--card)',
                borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              {/* Status indicator */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: item.status === 'checking'
                    ? 'rgba(0,0,0,0.05)'
                    : item.status === 'normal'
                    ? 'rgba(46,184,124,0.12)'
                    : item.status === 'warning'
                    ? 'rgba(245,137,10,0.12)'
                    : 'rgba(214,0,25,0.12)',
                }}>
                {item.status === 'checking' ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="var(--muted)" strokeWidth="3" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="var(--muted)" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                ) : item.status === 'normal' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="#2EB87C" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v5M12 16h.01" stroke={statusColor[item.status]} strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke={statusColor[item.status]} strokeWidth="1.8"/>
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.label}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--muted)' }}>{item.sublabel}</p>
              </div>

              <span className="text-xs font-semibold" style={{ color: statusColor[item.status] }}>
                {statusLabel[item.status]}
              </span>
            </div>
          ))}
        </div>

        {/* START BUTTON */}
        <button
          onClick={() => allReady && navigate('live-detection')}
          disabled={!allReady}
          className="w-full py-4 rounded-[18px] font-semibold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: allReady
              ? 'var(--orange)'
              : 'rgba(255,255,255,0.09)',
            color: allReady ? 'white' : 'var(--muted)',
          }}
        >
          {allReady ? '🛡️  Start Safe Work' : 'Running diagnostics…'}
        </button>
      </div>
    </div>
  )
}
