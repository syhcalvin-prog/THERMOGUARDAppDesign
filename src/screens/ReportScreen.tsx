import { useState, useEffect } from 'react'

type Screen = string
interface Props { navigate: (s: Screen) => void }
type Stage = 'camera' | 'result' | 'success'
type FacilityType = 'Bus Stop Rail' | 'Metal Bench' | 'Manhole Cover' | 'Playground' | 'Other'

export default function ReportScreen({ navigate }: Props) {
  const [stage, setStage] = useState<Stage>('camera')
  const [locating, setLocating] = useState(true)
  const [flash, setFlash] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [facility, setFacility] = useState<FacilityType>('Bus Stop Rail')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLocating(false), 1800)
    return () => clearTimeout(t)
  }, [])

  const handleCapture = () => {
    setFlash(true)
    setTimeout(() => { setFlash(false); setStage('result') }, 400)
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => setStage('success'), 1800)
  }

  if (stage === 'success') return (
    <div className="geometric-page min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20 fade-up">
      <div className="check-in w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
        style={{ background: 'var(--safe)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text)' }}>
        High-risk location reported
      </h2>
      <p className="text-sm text-center mb-1" style={{ color: 'var(--muted)' }}>
        This hot surface has been logged and added to the public Heat Risk Map.
      </p>
      <p className="text-xs text-center mb-8" style={{ color: 'var(--muted)' }}>
        Synced to public Heat Risk Map — thank you for keeping the city safer.
      </p>
      <div className="glass-card w-full rounded-2xl p-4 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D60019' }}/>
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>HIGH RISK · 52°C</span>
        </div>
        <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>Bus Stop Rail</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Pudong Blvd · Reported just now</p>
      </div>
      <button
        onClick={() => navigate('heatmap')}
        className="w-full py-4 rounded-[18px] font-semibold text-white mb-3"
        style={{ background: 'var(--orange)' }}
      >
        View on Heat Map
      </button>
      <button onClick={() => navigate('home')} className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
        Back to Home
      </button>
    </div>
  )

  if (stage === 'result') return (
    <div className="geometric-page min-h-screen pb-28 pt-14">
      {/* Nav */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2 flex items-center gap-4"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => setStage('camera')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Review Report</h1>
      </div>

      <div className="px-5 fade-up">
        {/* Photo thumbnail */}
        <div className="rounded-2xl overflow-hidden mb-4 h-52 flex items-center justify-center relative"
          style={{ background: '#15191A' }}>
          <div className="text-center">
            <div className="text-4xl mb-2">🌡️</div>
            <p className="text-sm text-white opacity-60">Thermal patch detected</p>
          </div>
          {/* Detected patch overlay */}
          <div className="absolute top-4 right-4 rounded-xl px-3 py-2"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#D60019' }}/>
              <span className="text-xs font-bold text-white">RED</span>
            </div>
            <span className="text-[10px] text-white opacity-60">Patch color</span>
          </div>
        </div>

        {/* Analysis result card */}
        <div className="glass-card rounded-2xl p-4 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>Risk Assessment</p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: '#D60019' }}>HIGH RISK</div>
                <span className="mono text-lg font-bold" style={{ color: '#FF8A84' }}>52°C</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Patch Color</p>
              <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                <div className="w-4 h-4 rounded-full border-2" style={{ background: '#D60019', borderColor: 'rgba(0,0,0,0.1)' }}/>
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Critical Red</span>
              </div>
            </div>
          </div>

          <div className="h-px mb-3" style={{ background: 'var(--border)' }}/>

          {/* Auto-detected info */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: '📍 Location', value: 'Pudong Blvd, Shanghai' },
              { label: '🕐 Time', value: 'Today 14:32' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: 'var(--card-2)' }}>
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--muted)' }}>{label}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Facility type selector */}
          <div className="mb-3">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Facility Type</p>
            <div className="flex flex-wrap gap-2">
              {(['Bus Stop Rail','Metal Bench','Manhole Cover','Playground','Other'] as FacilityType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFacility(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: facility === f ? 'var(--orange)' : 'var(--card-2)',
                    color: facility === f ? 'white' : 'var(--text)',
                    border: `1.5px solid ${facility === f ? 'var(--orange)' : 'var(--border)'}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted)' }}>Description (optional)</p>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Add details about the facility location…"
              rows={2}
              className="w-full rounded-xl px-3 py-2.5 text-sm resize-none outline-none"
              style={{
                background: 'var(--card-2)',
                border: '1.5px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-[18px] font-semibold text-white text-base flex items-center justify-center gap-2"
          style={{ background: submitting ? '#ccc' : 'var(--orange)' }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.25"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Submitting…
            </>
          ) : 'Submit Report'}
        </button>
      </div>
    </div>
  )

  // CAMERA VIEW
  return (
    <div className="h-screen overflow-hidden relative" style={{ background: '#0F0F10' }}>
      {/* Flash overlay */}
      {flash && <div className="absolute inset-0 bg-white z-50"/>}

      {/* Camera viewport */}
      <div className="absolute inset-0">
        {/* Simulated camera background */}
        <div className="w-full h-full" style={{ background: 'linear-gradient(170deg,#1A1A20,#0D0D0F)' }}>
          {/* Simulated surface / hot metal object */}
          <div className="absolute inset-x-0 bottom-1/3 h-1/3"
            style={{ background: 'linear-gradient(0deg,#2A2218,#1A1510)' }}/>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {/* Thermal patch mockup */}
            <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-2xl"
              style={{ background: '#1E1008' }}>
              <div className="text-center">
                <div className="text-2xl font-black" style={{ color: '#FF2D00', fontFamily: 'Impact, sans-serif' }}>!</div>
                <div className="text-[8px] font-bold" style={{ color: '#FFD700' }}>HOT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 px-5 pt-12 pb-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}>
        <button onClick={() => navigate('home')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">Thermal Patch Detector</p>
          <p className="text-[10px] text-white opacity-60">Scan for heat-reactive patches</p>
        </div>
        {/* Flash button */}
        <button onClick={() => setFlash(f => !f)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* SCAN FRAME */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Corner brackets */}
          {[['top-0 left-0','border-t-2 border-l-2 rounded-tl-xl'],
            ['top-0 right-0','border-t-2 border-r-2 rounded-tr-xl'],
            ['bottom-0 left-0','border-b-2 border-l-2 rounded-bl-xl'],
            ['bottom-0 right-0','border-b-2 border-r-2 rounded-br-xl']].map(([pos, cls]) => (
            <div key={pos} className={`absolute w-8 h-8 ${pos} ${cls} border-[#FF5A1A]`}/>
          ))}

          {/* Scanning line */}
          <div className="absolute left-1 right-1 scan-line overflow-hidden pointer-events-none"
            style={{ top: 0, height: '2px' }}>
            <div className="w-full h-full" style={{ background: 'linear-gradient(to right, transparent, #FF5A1A, transparent)' }}/>
          </div>

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1 h-8 rounded-full" style={{ background: 'rgba(255,90,26,0.4)' }}/>
            <div className="h-1 w-8 rounded-full absolute" style={{ background: 'rgba(255,90,26,0.4)' }}/>
          </div>
        </div>
      </div>

      {/* HINT TEXT */}
      <div className="absolute top-1/2 mt-36 left-0 right-0 flex flex-col items-center gap-1">
        <p className="text-white text-sm font-medium text-center px-4">
          Align the patch inside the frame
        </p>
        {/* Location status */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`w-2 h-2 rounded-full ${locating ? 'blink' : ''}`}
            style={{ background: locating ? '#F5890A' : '#2EB87C' }}/>
          <span className="text-xs text-white opacity-70">
            {locating ? 'Acquiring location…' : 'Pudong Blvd, Shanghai'}
          </span>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 pt-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
        {/* Gallery */}
        <button className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/>
            <circle cx="8.5" cy="8.5" r="2" stroke="white" strokeWidth="1.5"/>
            <path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Capture */}
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: 'transparent', border: '4px solid white' }}
        >
          <div className="w-14 h-14 rounded-full"
            style={{ background: 'var(--orange)' }}/>
        </button>

        {/* Flash toggle placeholder */}
        <div className="w-12 h-12"/>
      </div>
    </div>
  )
}
