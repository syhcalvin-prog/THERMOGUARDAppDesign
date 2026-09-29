interface BottomNavProps {
  activeTab: number
  onTabPress: (tab: number) => void
  onReport: () => void
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
      stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V13h6v8" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const MapIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2.5" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8"/>
  </svg>
)

const CameraIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z"
      stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8"/>
  </svg>
)

const GloveIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v5" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v6" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 9V5a2 2 0 00-2-2v0a2 2 0 00-2 2v9" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M6 14v-3a2 2 0 00-2-2v0a2 2 0 00-2 2v5c0 4 3 7 7 7h4c3.3 0 5-2 5-5v-3" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#EF622C' : '#9A9894'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const tabs = [
  { label: 'Home',     icon: HomeIcon,    idx: 0 },
  { label: 'Heat Map', icon: MapIcon,     idx: 1 },
  { label: '',         icon: CameraIcon,  idx: 2 },
  { label: 'Glove',   icon: GloveIcon,   idx: 3 },
  { label: 'Profile',  icon: ProfileIcon, idx: 4 },
]

export default function BottomNav({ activeTab, onTabPress, onReport }: BottomNavProps) {
  return (
    <nav aria-label="Primary navigation"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{ background: 'rgba(30,34,35,.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderTop: '1px solid var(--border)' }}>
      <div className="grid grid-cols-5 items-center px-3 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))]">
        {tabs.map(tab => {
          if (tab.idx === 2) return (
            <button key={tab.idx} onClick={onReport} aria-label="Report hot surface"
              className="flex flex-col items-center gap-1">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'var(--orange)' }}>
                <CameraIcon />
              </span>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--orange)' }}>Report</span>
            </button>
          )
          const Icon = tab.icon
          const isActive = activeTab === tab.idx
          return (
            <button key={tab.idx} onClick={() => onTabPress(tab.idx)}
              aria-label={tab.label} aria-current={isActive ? 'page' : undefined}
              className="min-h-[57px] flex flex-col items-center justify-center gap-1 rounded-xl"
              style={{ background: isActive ? 'var(--orange-light)' : 'transparent' }}>
              <Icon active={isActive} />
              <span className="text-[10px] font-semibold"
                style={{ color: isActive ? 'var(--orange)' : 'var(--muted)' }}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
