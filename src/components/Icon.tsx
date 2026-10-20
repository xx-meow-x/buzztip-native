import Svg, { Circle, G, Path } from 'react-native-svg'
import { useTheme } from '../theme'

const LINE: Record<string, string> = {
  back: 'M15 18l-6-6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  sun: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  check: 'M5 12l5 5 9-10',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
}

// Line icons. They take the current text color unless you pass `color`.
export type IconName = 'back' | 'menu' | 'moon' | 'sun' | 'check' | 'bookmark' | 'heart' | 'send' | 'pin'

export function Icon({ name, size = 20, color, filled = false, strokeWidth = 2 }: { name: IconName; size?: number; color?: string; filled?: boolean; strokeWidth?: number }) {
  const { t } = useTheme()
  const c = color || t.text
  if (name === 'send')
    return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M3 20l18-8L3 4v6l12 2-12 2z" fill={c} /></Svg>
  if (name === 'pin')
    return <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill={c} /></Svg>
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill="none" stroke={c} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {name === 'sun' && <Circle cx="12" cy="12" r="4" />}
        <Path d={LINE[name]} fill={filled ? c : 'none'} />
      </G>
    </Svg>
  )
}
