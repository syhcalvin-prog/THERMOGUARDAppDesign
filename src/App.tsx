import { useState } from 'react'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import HeatMapScreen from './screens/HeatMapScreen'
import ReportScreen from './screens/ReportScreen'
import DeviceConnectionScreen from './screens/DeviceConnectionScreen'
import DeviceCheckScreen from './screens/DeviceCheckScreen'
import LiveDetectionScreen from './screens/LiveDetectionScreen'
import CriticalWarningScreen from './screens/CriticalWarningScreen'
import WorkReportScreen from './screens/WorkReportScreen'

type Screen =
  | 'home' | 'heatmap' | 'report'
  | 'device-connection' | 'device-check' | 'live-detection'
  | 'critical-warning' | 'work-report' | 'profile'

const TAB_SCREEN: Record<number, Screen> = {
  0: 'home',
  1: 'heatmap',
  2: 'report',
  3: 'device-connection',
  4: 'profile',
}

const HIDE_NAV: Screen[] = ['critical-warning', 'report']

function ProfileScreen({ navigate }: { navigate: (s: Screen) => void }) {
  return (
    <div className="geometric-page min-h-screen pb-28 pt-14">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pt-3 pb-2"
        style={{ background: 'rgba(29,33,34,0.88)', backdropFilter: 'blur(16px)' }}>
        <h1 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Profile</h1>
      </div>
      <div className="px-5">
        {/* Avatar */}
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-4"
            style={{ background: '#F7E5DA', color: 'var(--orange)', borderColor: 'var(--orange)' }}>
            AC
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Alex Chen</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Outdoor Safety Inspector · ID #0289</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Sessions', value: '47' },
            { label: 'Reports', value: '128' },
            { label: 'Safe Days', value: '31' },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="mono text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[
            { icon: '🛡️', label: 'Safety Preferences' },
            { icon: '📳', label: 'Alert Settings' },
            { icon: '🗺️', label: 'Region & Language' },
            { icon: '📱', label: 'Device Management' },
            { icon: 'ℹ️', label: 'About THERMO GUARD' },
          ].map((item, idx) => (
            <div key={item.label}
              className="flex items-center gap-3 px-4 py-4"
              style={{
                background: 'var(--card)',
                borderBottom: idx < 4 ? '1px solid var(--border)' : 'none',
              }}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium flex-1" style={{ color: 'var(--text)' }}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          ))}
        </div>

        <div className="pt-6 text-center">
          <p className="text-xs" style={{ color: 'var(--muted)' }}>THERMO GUARD v2.4.1 · © 2026 ThermoTech</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeTab, setActiveTab] = useState(0)

  const navigate = (to: string) => {
    setScreen(to as Screen)
    const tabEntry = Object.entries(TAB_SCREEN).find(([, s]) => s === to)
    if (tabEntry) setActiveTab(Number(tabEntry[0]))
  }

  const handleTabPress = (tab: number) => {
    setActiveTab(tab)
    setScreen(TAB_SCREEN[tab])
  }

  const showNav = !HIDE_NAV.includes(screen)

  return (
    <div className="min-h-screen flex justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[430px] relative min-h-screen flex flex-col shadow-2xl" style={{ background: 'var(--bg)' }}>
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          {screen === 'home'              && <HomeScreen navigate={navigate}/>}
          {screen === 'heatmap'           && <HeatMapScreen navigate={navigate}/>}
          {screen === 'report'            && <ReportScreen navigate={navigate}/>}
          {screen === 'device-connection' && <DeviceConnectionScreen navigate={navigate}/>}
          {screen === 'device-check'      && <DeviceCheckScreen navigate={navigate}/>}
          {screen === 'live-detection'    && <LiveDetectionScreen navigate={navigate}/>}
          {screen === 'critical-warning'  && <CriticalWarningScreen navigate={navigate}/>}
          {screen === 'work-report'       && <WorkReportScreen navigate={navigate}/>}
          {screen === 'profile'           && <ProfileScreen navigate={navigate}/>}
        </div>

        {showNav && (
          <BottomNav
            activeTab={activeTab}
            onTabPress={handleTabPress}
            onReport={() => { setScreen('report') }}
          />
        )}
      </div>
    </div>
  )
}
