import gloveImage from '../assets/thermal-glove-unified.svg'

type Screen = string
interface Props { navigate: (s: Screen) => void }

const MiniMapDot = ({ x, y, level }: { x: number; y: number; level: 'safe' | 'caution' | 'risk' }) => {
  const color = level === 'safe' ? '#2EB87C' : level === 'caution' ? '#F5890A' : '#D60019'
  return <circle cx={x} cy={y} r="5" fill={color} stroke="white" strokeWidth="2" />
}

export default function HomeScreen({ navigate }: Props) {
  return (
    <div className="geometric-page min-h-screen pb-28">
      <header className="home-header px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'var(--orange)' }}>THERMO GUARD / 01</p>
            <h1 className="text-[28px] leading-tight font-bold tracking-tight mt-1" style={{ color: 'var(--text)' }}>Stay ahead of heat.</h1>
            <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>Your daily surface safety dashboard</p>
          </div>
          <button onClick={() => navigate('profile')} aria-label="Open profile"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'var(--card)', color: 'var(--orange)', border: '1px solid var(--border)' }}>AC</button>
        </div>
      </header>

      <main className="px-4">
        <section className="home-hero relative overflow-hidden rounded-[28px]">
          <div className="relative z-10 px-5 pt-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em]" style={{ color: 'var(--orange)' }}>DEVICE / TG-01</p>
              <h2 className="text-[25px] leading-tight font-bold mt-1" style={{ color: 'var(--text)' }}>Protection at hand.</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Smart glove · Palm protection</p>
            </div>
            <span className="text-[10px] font-bold tracking-wide rounded-full px-2.5 py-1.5 whitespace-nowrap"
              style={{ color: '#FFBE9C', background: 'rgba(239,98,44,.18)', border: '1px solid rgba(239,98,44,.32)' }}>
              READY TO PAIR
            </span>
          </div>

          <div className="relative h-[370px] overflow-hidden">
            <div className="absolute left-5 top-5 h-[1px] w-10" style={{ background: '#DFDBD5' }} />
            <div className="absolute right-5 bottom-7 h-[1px] w-10" style={{ background: '#DFDBD5' }} />
            <img src={gloveImage} alt="Thermo Guard glove with three orange palm airbags, fingertip sensor and wrist modules"
              className="hero-sketch absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: 'calc(50% - 12px)' }} />
          </div>

          <div className="relative z-10 px-4 pb-4">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="glass-card rounded-[20px] px-3.5 py-3" style={{ background: 'var(--card)' }}>
                <p className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--muted)' }}>SURFACE TEMP</p>
                <p className="mono text-lg font-bold mt-1" style={{ color: 'var(--text)' }}>—°C</p>
              </div>
              <div className="rounded-[20px] px-3.5 py-3" style={{ background: 'var(--card)' }}>
                <p className="text-[10px] font-semibold tracking-wide" style={{ color: 'var(--muted)' }}>AIRBAG STATUS</p>
                <p className="text-sm font-bold mt-1 flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#2EB87C' }} /> Standby
                </p>
              </div>
            </div>
            <button onClick={() => navigate('device-connection')}
              className="geo-primary w-full min-h-12 flex items-center justify-center gap-2 text-sm font-bold active:scale-[.98] transition-transform">
              Connect glove & start detection <span aria-hidden="true">↗</span>
            </button>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em]" style={{ color: 'var(--orange)' }}>CITY CONDITIONS</p>
              <h2 className="text-lg font-bold mt-0.5" style={{ color: 'var(--text)' }}>Around you</h2>
            </div>
            <span className="text-[11px]" style={{ color: 'var(--muted)' }}>Shanghai · Sample view</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="geo-card rounded-[22px] p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Air temperature</p>
              <p className="mono text-[28px] leading-none font-bold mt-3" style={{ color: 'var(--text)' }}>38°C</p>
              <p className="text-[11px] mt-3" style={{ color: 'var(--muted)' }}>Sunny · High UV</p>
            </div>
            <div className="geo-card rounded-[22px] p-4" style={{ background: 'rgba(239,98,44,.17)', border: '1px solid rgba(239,98,44,.3)' }}>
              <p className="text-xs font-medium" style={{ color: '#FFC1A1' }}>Nearby surface risk</p>
              <p className="text-[27px] leading-none font-bold mt-3" style={{ color: '#FF9E72' }}>HIGH</p>
              <p className="text-[11px] mt-3" style={{ color: '#FFC1A1' }}>Check before touching</p>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <button onClick={() => navigate('report')}
            className="glass-card w-full rounded-[20px] p-4 flex items-center gap-3 text-left active:scale-[.99] transition-transform"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'var(--orange-light)', color: 'var(--orange)' }} aria-hidden="true">⌁</div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Report a hot surface</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Scan a patch and share its location</p>
            </div>
            <span className="text-lg" style={{ color: 'var(--orange)' }} aria-hidden="true">↗</span>
          </button>
        </section>

        <section className="glass-card mt-6 rounded-[20px] overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em]" style={{ color: 'var(--orange)' }}>EXPLORE</p>
              <h2 className="text-sm font-bold mt-0.5" style={{ color: 'var(--text)' }}>Nearby risk map</h2>
            </div>
            <button onClick={() => navigate('heatmap')} className="text-xs font-semibold" style={{ color: 'var(--orange)' }}>Open map ↗</button>
          </div>
          <svg viewBox="0 0 340 140" width="100%" className="block" role="img" aria-label="Sample map with hot surface markers" style={{ background: '#252D2E' }}>
            {[60, 120, 180, 240, 300].map(x => <line key={x} x1={x} y1="0" x2={x} y2="140" stroke="#505A59" strokeWidth="6" />)}
            {[35, 70, 105].map(y => <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#505A59" strokeWidth="4" />)}
            <rect x="63" y="3" width="54" height="30" rx="3" fill="#394243" />
            <rect x="123" y="3" width="54" height="62" rx="3" fill="#394243" />
            <rect x="183" y="38" width="54" height="30" rx="3" fill="#394243" />
            <rect x="243" y="3" width="54" height="62" rx="3" fill="#394243" />
            <rect x="63" y="73" width="114" height="30" rx="3" fill="#394243" />
            <rect x="183" y="3" width="54" height="30" rx="3" fill="#42554A" />
            <MiniMapDot x={90} y={52} level="risk" />
            <MiniMapDot x={152} y={30} level="caution" />
            <MiniMapDot x={210} y={52} level="risk" />
            <MiniMapDot x={270} y={18} level="caution" />
            <MiniMapDot x={315} y={88} level="safe" />
            <circle cx="170" cy="88" r="8" fill="var(--orange)" opacity=".18" />
            <circle cx="170" cy="88" r="4" fill="var(--orange)" stroke="white" strokeWidth="2" />
          </svg>
        </section>
      </main>
    </div>
  )
}
