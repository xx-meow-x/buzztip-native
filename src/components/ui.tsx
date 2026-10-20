import { forwardRef, type ComponentRef, type ReactNode } from 'react'
import {
  ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View,
  type ScrollViewProps, type StyleProp, type TextInputProps, type TextProps, type ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { fonts, radii, useTheme, type Theme } from '../theme'
import { Icon } from './Icon'
import { initials as toInitials } from '../lib/format'

// Text with the app font and theme color. w: body | medium | semi | bold | display
interface TProps extends TextProps {
  w?: keyof typeof fonts
  size?: number
  muted?: boolean
  color?: string
}

export function T({ w = 'body', size = 14, muted, color, style, ...rest }: TProps) {
  const { t } = useTheme()
  return <Text style={[{ fontFamily: fonts[w], fontSize: size, color: color || (muted ? t.muted : t.text) }, style]} {...rest} />
}

export function Screen({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  return <View style={[{ flex: 1, backgroundColor: t.bg, paddingTop: ins.top }, style]}>{children}</View>
}

// Scrolling content area. Leaves room for the bottom nav and + button.
export function Body({ children, bottom = 130, style, ...rest }: ScrollViewProps & { children: ReactNode; bottom?: number }) {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[{ padding: 18, paddingBottom: bottom }, style]} {...rest}>
      {children}
    </ScrollView>
  )
}

export function IconButton({ onPress, children, label, style }: { onPress: () => void; children: ReactNode; label: string; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme()
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
      style={[{ height: 40, minWidth: 40, paddingHorizontal: 10, borderRadius: radii.md, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, alignItems: 'center', justifyContent: 'center' }, style]}>
      {children}
    </Pressable>
  )
}

export function ThemeToggle() {
  const { t, toggle } = useTheme()
  return (
    <IconButton onPress={toggle} label={t.dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Icon name={t.dark ? 'sun' : 'moon'} />
    </IconButton>
  )
}

export function Avatar({ name = '', initials, color = '#888', src, size = 38, children }: { name?: string; initials?: string; color?: string; src?: string; size?: number; children?: ReactNode }) {
  const { t } = useTheme()
  return (
    <View style={{ width: size, height: size, borderRadius: radii.avatar, backgroundColor: src ? t.surface2 : color, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {src ? <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} />
        : children ? <Text style={{ fontSize: size * 0.45 }}>{children}</Text>
        : <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: Math.max(10, size * 0.32) }}>{initials || toInitials(name)}</Text>}
    </View>
  )
}

type PillTone = 'urgent' | 'lost' | 'found' | 'late' | 'course'

export function Pill({ children, tone }: { children: ReactNode; tone?: PillTone }) {
  const { t } = useTheme()
  const tones: Record<PillTone, [string, string]> = {
    urgent: [t.accent, t.accentInk], lost: [t.lost, t.semInk], found: [t.found, t.semInk],
    late: [t.lost, t.semInk], course: [t.surface2, t.accentText],
  }
  const [bg, fg] = (tone && tones[tone]) || [t.surface2, t.muted]
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 7, paddingVertical: 2, borderRadius: radii.sm, alignSelf: 'flex-start' }}>
      <Text style={{ color: fg, fontFamily: tone ? fonts.bold : fonts.medium, fontSize: 10 }}>{children}</Text>
    </View>
  )
}

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'lost' | 'found'
  disabled?: boolean
  small?: boolean
  style?: StyleProp<ViewStyle>
}

export function Button({ title, onPress, variant = 'primary', disabled, small, style }: ButtonProps) {
  const { t } = useTheme()
  const v: [string, string, string] = {
    primary: [t.accent, t.accentInk, t.accent] as [string, string, string],
    secondary: ['transparent', t.accentText, t.accent] as [string, string, string],
    lost: [t.lost, t.semInk, t.lost] as [string, string, string],
    found: [t.found, t.semInk, t.found] as [string, string, string],
  }[variant]
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
      style={({ pressed }) => [{ height: small ? 40 : 48, borderRadius: radii.md, borderWidth: 1.5, backgroundColor: v[0], borderColor: v[2], alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : pressed ? 0.85 : 1, marginBottom: 12 }, style]}>
      <Text style={{ color: v[1], fontFamily: fonts.semi, fontSize: small ? 14 : 16 }}>{title}</Text>
    </Pressable>
  )
}

// Small gold/outlined button used for Join, Post, + Group, + Sell
export function SmallButton({ title, onPress, outlined, disabled, style }: { title: string; onPress: () => void; outlined?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const { t } = useTheme()
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={[{ height: 32, paddingHorizontal: 14, borderRadius: radii.sm, borderWidth: 1.5, borderColor: t.accent, backgroundColor: outlined ? 'transparent' : t.accent, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }, style]}>
      <Text style={{ color: outlined ? t.accentText : t.accentInk, fontFamily: fonts.semi, fontSize: 12 }}>{title}</Text>
    </Pressable>
  )
}

export const Input = forwardRef<ComponentRef<typeof TextInput>, TextInputProps>(function Input({ multiline, style, ...rest }, ref) {
  const { t } = useTheme()
  return (
    <TextInput ref={ref} multiline={multiline} placeholderTextColor={t.muted}
      style={[{ minHeight: multiline ? 90 : 46, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface, color: t.text, borderRadius: radii.md, paddingHorizontal: 14, paddingVertical: multiline ? 12 : 0, textAlignVertical: multiline ? 'top' : 'center', fontSize: 15, fontFamily: fonts.body }, style]}
      {...rest} />
  )
})

export function Field({ label, required, error, hint, children }: { label?: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
  const { t } = useTheme()
  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <T w="semi" size={12}>{label}</T>
          {required ? <T w="semi" size={12} color={t.lost}> *</T> : null}
          {hint ? <T size={11} muted style={{ marginLeft: 8 }}>{hint}</T> : null}
        </View>
      ) : null}
      {children}
      {error ? <T size={12} color={t.lost} style={{ marginTop: 4 }}>{error}</T> : null}
    </View>
  )
}

export function Segmented<V extends string>({ options, value, onChange }: { options: { value: V; label: string }[]; value: V; onChange: (v: V) => void }) {
  const { t } = useTheme()
  return (
    <View style={{ flexDirection: 'row', gap: 4, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 4, marginBottom: 14 }}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} accessibilityRole="tab" accessibilityState={{ selected: on }}
            style={{ flex: 1, height: 34, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.accent : 'transparent' }}>
            <Text style={{ color: on ? t.accentInk : t.muted, fontFamily: fonts.semi, fontSize: 13 }}>{o.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

// Horizontal filter chips (Announcements)
export function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const { t } = useTheme()
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, flexGrow: 0 }} contentContainerStyle={{ gap: 8 }}>
      {options.map((o) => {
        const on = o === value
        return (
          <Pressable key={o} onPress={() => onChange(o)} style={{ paddingHorizontal: 14, height: 32, borderRadius: radii.md, borderWidth: 1, borderColor: on ? t.accent : t.border, backgroundColor: on ? t.accent : t.surface, justifyContent: 'center' }}>
            <Text style={{ color: on ? t.accentInk : t.muted, fontFamily: fonts.semi, fontSize: 12 }}>{o}</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

// Replaces <select>: tap one option.
export function ChipSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const { t } = useTheme()
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o === value
        return (
          <Pressable key={o} onPress={() => onChange(o)} accessibilityState={{ selected: on }}
            style={{ paddingHorizontal: 12, height: 34, borderRadius: radii.md, borderWidth: 1, borderColor: on ? t.accent : t.border, backgroundColor: on ? t.accent : t.surface, justifyContent: 'center' }}>
            <Text style={{ color: on ? t.accentInk : t.text, fontFamily: fonts.medium, fontSize: 13 }}>{o}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <T muted style={{ textAlign: 'center', paddingVertical: 28, paddingHorizontal: 10, lineHeight: 20 }}>{children}</T>
}

// Spinner while the first load is happening, empty message afterwards, otherwise the rows.
export function Rows<R>({ loading, rows, empty, render }: { loading?: boolean; rows: R[]; empty?: string; render?: (row: R) => ReactNode }) {
  const { t } = useTheme()
  if (loading && !rows.length) return <ActivityIndicator color={t.accent} style={{ marginTop: 30 }} />
  if (!rows.length) return <Empty>{empty}</Empty>
  return <>{render ? rows.map(render) : null}</>
}

export function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  const { t } = useTheme()
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
      <T w="bold" size={15}>{title}</T>
      {onSeeAll ? <Pressable onPress={onSeeAll}><T size={12} color={t.accentText}>See all</T></Pressable> : null}
    </View>
  )
}

export const card = (t: Theme): ViewStyle => ({ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 8 })
