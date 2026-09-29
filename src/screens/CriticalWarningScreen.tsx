import { useEffect, useState } from 'react'
import GloveModel from '../components/GloveModel'

type Screen = string
interface Props { navigate: (s: Screen) => void }

export default function CriticalWarningScreen({ navigate }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [confirmLabel, setConfirmLabel] = useState("I'm Safe")

  useEffect(() => {
    // Pulse title with haptic-like feedback simulation
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([300, 100, 300, 100, 300])
    }
  }, [])

  const handleSafe = () => {
    setConfirmLabel('✓ Confirmed')
    setTimeout(() => navigate('live-detection'), 600)
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: '#301F22' }}>

      {/* TOP STATUS AREA */}
      <div className="px-6 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white blink"/>
          <span className="text-sm font-bold text-white tracking-wider">ALERT</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Vibrate icon */}
          <div className="flex flex-col gap-0.5 items-center">
            <div className="w-4 h-4 opacity-90">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 18V6M17 18V6M3 16V8M21 16V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="7" y="6" width="10" height="12" rx="2" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-[8px] text-white opacity-70">VIB</span>
          </div>
          {/* Sound icon */}
          <div className="flex flex-col gap-0.5 items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[8px] text-white opacity-70">SND</span>
          </div>
        </div>
      </div>

      {/* MAIN WARNING CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* Temperature — HUGE */}
        <div className="mb-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="mono font-black text-white" style={{ fontSize: 96, lineHeight: 1, letterSpacing: '-0.04em' }}>
              52
            </span>
            <span className="mono text-5xl font-bold text-white opacity-90">°C</span>
          </div>
        </div>

        {/* CRITICAL HEAT */}
        <div className="mb-4">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">CRITICAL HEAT</h1>
          <div className="h-0.5 w-16 mx-auto bg-white opacity-40 mb-3"/>
          <p className="text-lg font-semibold text-white opacity-90 mb-1">Hot surface detected</p>
          <p className="text-base text-white opacity-80 font-medium">Stop contact immediately</p>
        </div>

        {/* GLOVE with inflated airbag */}
        <div className="relative mb-4">
          {/* Glow backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-52 h-52 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)' }}/>
          </div>
          <GloveModel airbagState="critical" width={200} className="relative z-10 glove-center-adjust"/>
        </div>

        {/* Airbag status */}
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl mb-4"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.17)' }}>
          <div className="w-3 h-3 rounded-full bg-white blink"/>
          <span className="text-sm font-bold text-white">Airbag Status: </span>
          <span className="text-sm font-black text-white">INFLATED ✓</span>
        </div>

        {/* Sub-info */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          {[
            { label: 'Surface Temp', value: '52°C' },
            { label: 'Contact Time', value: '00:04' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl py-3 px-4"
              style={{ background: 'rgba(255,255,255,0.12)' }}>
              <p className="text-xs text-white opacity-60 mb-0.5">{label}</p>
              <p className="mono text-lg font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      <div className="px-6 pb-14">
        {/* I'm Safe */}
        <button
          onClick={handleSafe}
          className="w-full py-4.5 rounded-2xl font-black text-lg mb-3 transition-all active:scale-95"
          style={{
            background: 'white',
            color: '#D60019',
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          {confirmLabel}
        </button>

        {/* Emergency Help */}
        <button className="w-full py-3.5 rounded-2xl font-semibold text-base text-white"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.35)' }}>
          <span className="mr-2">🆘</span> Emergency Help
        </button>
      </div>
    </div>
  )
}
