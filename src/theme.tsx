import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { StyleSheet, useColorScheme, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Theme {
  dark: boolean
  bg: string
  surface: string
  surface2: string
  text: string
  muted: string
  accent: string
  accentInk: string
  accentText: string
  border: string
  lost: string
  found: string
  semInk: string
  scrim: string
}

type Mode = 'light' | 'dark'
interface ThemeValue {
  t: Theme
  mode: Mode
  toggle: () => void
}

export const radii = { sm: 6, avatar: 6, md: 8, lg: 12 }

// Font files are loaded in App.js. If they fail to load, the system font is used.
export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  body: 'Figtree_400Regular',
  medium: 'Figtree_500Medium',
  semi: 'Figtree_600SemiBold',
  bold: 'Figtree_700Bold',
}

const light: Theme = {
  dark: false, bg: '#F7F2E2', surface: '#FFFDF6', surface2: '#F1E9CC', text: '#2B2615', muted: '#7A7255',
  accent: '#E2B93B', accentInk: '#2B2210', accentText: '#8A6A0E', border: '#E0D6B2',
  lost: '#C2544B', found: '#3F8F5E', semInk: '#FFFFFF', scrim: 'rgba(0,0,0,.45)',
}
const dark: Theme = {
  dark: true, bg: '#0E0E16', surface: '#181826', surface2: '#1F1F31', text: '#F2F0E6', muted: '#8E8CA3',
  accent: '#E3C25E', accentInk: '#17130A', accentText: '#E3C25E', border: '#2A2A3D',
  lost: '#E07A72', found: '#6BBF8A', semInk: '#12121A', scrim: 'rgba(0,0,0,.6)',
}

const KEY = 'bt-theme'
const Ctx = createContext<ThemeValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme()
  const [saved, setSaved] = useState<Mode | null>(null)
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setSaved(v as Mode)).catch(() => {})
  }, [])
  const mode: Mode = saved || (system === 'dark' ? 'dark' : 'light')
  const toggle = useCallback(() => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'
    setSaved(next)
    AsyncStorage.setItem(KEY, next).catch(() => {})
  }, [mode])
  const value = useMemo(() => ({ t: mode === 'dark' ? dark : light, mode, toggle }), [mode, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>')
  return v
}

// const useStyles = makeStyles((t) => ({ box: { backgroundColor: t.surface } }))
export const makeStyles = <S extends Record<string, ViewStyle | TextStyle | ImageStyle>>(fn: (t: Theme) => S) => () => {
  const { t } = useTheme()
  return useMemo(() => StyleSheet.create(fn(t)), [t])
}
