import gloveImage from '../assets/thermal-glove-unified.svg'

interface GloveModelProps {
  airbagState?: 'deflated' | 'caution' | 'high-risk' | 'critical'
  width?: number
  className?: string
}

export default function GloveModel({
  airbagState = 'deflated',
  width = 200,
  className = '',
}: GloveModelProps) {
  const riskGlow = airbagState === 'critical' ? 'glove-crit'
    : airbagState === 'high-risk' ? 'glove-hi' : ''

  return (
    <img
      src={gloveImage}
      alt="Thermo Guard glove with three orange palm airbags, fingertip sensor and wrist modules"
      width={width}
      draggable={false}
      className={[className, riskGlow].filter(Boolean).join(' ')}
      style={{ width, height: 'auto', maxWidth: '100%', display: 'block' }}
    />
  )
}
