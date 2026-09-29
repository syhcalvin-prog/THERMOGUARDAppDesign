import { useState } from 'react'
import GloveModel from '../components/GloveModel'

type Screen = string
interface Props { navigate: (s: Screen) => void }
type ConnState = 'disconnected'|'connecting'|'connected'|'low-battery'

export default function DeviceConnectionScreen({ navigate }: Props) {
  const [connState, setConnState] = useState<ConnState>('disconnected')

  const handleConnect = () => {
    if (connState === 'connected') {
      navigate('device-check')
      return
    }
    setConnState('connecting')
    setTimeout(() => setConnState('connected'), 2200)
  }

  const stateColor = {
    disconnected: 'var(--muted)',
    connecting:   '#F5890A',
    connected:    '#2EB87C',
    'low-battery':'#D60019',
  }[connState]

  const stateLabel = {
    disconnected: 'Not Connected',
    connecting:   'Connecting…',
    connected:    'Connected',
    'low-battery':'Low Battery',
  }[connState]

  return (
    <div className="geometric-page min-h-screen pb-28 pt-14">

      {/* NAV BAR */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2 flex items-center gap-4"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => navigate('home')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Connect Device</h1>
        <div className="flex-1"/>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="var(--orange)"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="var(--orange)" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="px-5">

        {/* GLOVE HERO WITH BT RINGS */}
        <div className="geometric-stage flex justify-center items-center mb-6 relative rounded-[28px]" style={{ height: 320 }}>

          {/* Bluetooth rings (behind glove) */}
          {(connState === 'disconnected' || connState === 'connecting') && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1,2,3].map(i => (
                <div
                  key={i}
                  className={`absolute rounded-full border-2 bt-r${i}`}
                  style={{
                    width: 120 + i * 52,
                    height: 120 + i * 52,
                    borderColor: connState === 'connecting' ? 'rgba(239,98,44,0.25)' : 'rgba(0,0,0,0.08)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Connected green ring */}
          {connState === 'connected' && (
            <div className="absolute rounded-full border-2"
              style={{ width:280, height:280, borderColor:'rgba(46,184,124,0.25)', background:'rgba(46,184,124,0.05)' }}/>
          )}

          {/* Glove model */}
          <GloveModel
            airbagState="deflated"
            width={220}
            className="relative z-10 drop-shadow-2xl glove-center-adjust"
          />

          {/* BT icon floating above glove */}
          <div className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ background: connState === 'connecting' ? 'var(--orange)' : connState === 'connected' ? '#2EB87C' : 'var(--card)', border: '1px solid var(--border)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6.5 6.5l11 11M6.5 17.5l5-5-5-5M17.5 6.5l-5 5 5 5"
                stroke={connState === 'disconnected' ? 'var(--muted)' : 'white'} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* DEVICE CARD */}
        <div className="geo-card rounded-[24px] p-4 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>Thermo Glove TG-01</h2>
              <p className="mono text-xs mt-0.5" style={{ color: 'var(--muted)' }}>TG-01-2024-0891</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: connState === 'connected' ? 'rgba(46,184,124,0.1)' : 'rgba(255,255,255,0.08)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: stateColor }}/>
              <span className="text-xs font-semibold" style={{ color: stateColor }}>{stateLabel}</span>
            </div>
          </div>

          <div className="h-px mb-3" style={{ background: 'var(--border)' }}/>

          {/* Device specs */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Protocol', value: 'BT 5.0', icon: '📡' },
              { label: 'Battery',  value: '78%',     icon: '🔋' },
              { label: 'Signal',   value: '-62 dBm',  icon: '📶' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--card-2)' }}>
                <p className="text-lg mb-0.5">{icon}</p>
                <p className="mono text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEARBY DEVICES */}
        <div className="geo-card rounded-[24px] p-4 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--muted)' }}>NEARBY DEVICES</p>
          {[
            { name: 'Thermo Glove TG-01', id: 'TG-01-2024-0891', rssi: '-62', paired: true },
            { name: 'Thermo Glove TG-02', id: 'TG-02-2024-0344', rssi: '-78', paired: false },
          ].map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: d.paired ? 'rgba(255,90,26,0.1)' : 'var(--card-2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6.5 6.5l11 11M6.5 17.5l5-5-5-5M17.5 6.5l-5 5 5 5"
                      stroke={d.paired ? 'var(--orange)' : 'var(--muted)'} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{d.name}</p>
                  <p className="mono text-[10px]" style={{ color: 'var(--muted)' }}>{d.id} · {d.rssi} dBm</p>
                </div>
              </div>
              {d.paired && <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: 'rgba(255,90,26,0.1)', color: 'var(--orange)' }}>Paired</span>}
            </div>
          ))}
        </div>

        {/* CONNECT BUTTON */}
        <button
          onClick={handleConnect}
          className="w-full py-4 rounded-[18px] font-semibold text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: connState === 'connected'
              ? 'var(--safe)'
              : connState === 'connecting'
              ? 'var(--orange)'
              : 'var(--orange)'
          }}
        >
          {connState === 'connecting' && (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity="0.25"/>
              <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          )}
          {connState === 'connected' ? '✓  Run Device Check' : connState === 'connecting' ? 'Connecting…' : 'Connect Device'}
        </button>
      </div>
    </div>
  )
}
