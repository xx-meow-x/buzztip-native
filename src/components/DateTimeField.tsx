import { createElement, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { T } from './ui'
import { radii, useTheme } from '../theme'

// mode: 'date' | 'time'. value is a Date.
export function DateTimeField({ value, onChange, mode = 'date' }: { value: Date; onChange: (d: Date) => void; mode?: 'date' | 'time' }) {
  const { t } = useTheme()
  const [show, setShow] = useState(false)
  if (Platform.OS === 'web') {
    const p = (n: number) => String(n).padStart(2, '0')
    const iso = mode === 'date'
      ? `${value.getFullYear()}-${p(value.getMonth() + 1)}-${p(value.getDate())}`
      : `${p(value.getHours())}:${p(value.getMinutes())}`
    return createElement('input', {
      type: mode,
      value: iso,
      onChange: (e: { target: { value: string } }) => {
        const v = e.target.value
        if (!v) return
        const d = new Date(value)
        if (mode === 'date') { const [y, m, day] = v.split('-').map(Number); d.setFullYear(y, m - 1, day) }
        else { const [h, mi] = v.split(':').map(Number); d.setHours(h, mi) }
        onChange(d)
      },
      style: { height: 46, width: '100%', boxSizing: 'border-box', padding: '0 14px', borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.text, fontSize: 15 },
    })
  }
  if (Platform.OS === 'ios') {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        <DateTimePicker value={value} mode={mode} display="compact" themeVariant={t.dark ? 'dark' : 'light'} onChange={(_, d) => d && onChange(d)} />
      </View>
    )
  }
  const label = mode === 'date'
    ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return (
    <>
      <Pressable onPress={() => setShow(true)} style={{ height: 46, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radii.md, borderWidth: 1, borderColor: t.border, backgroundColor: t.surface }}>
        <T size={15}>{label}</T>
      </Pressable>
      {show && (
        <DateTimePicker value={value} mode={mode} onChange={(e, d) => { setShow(false); if (e.type === 'set' && d) onChange(d) }} />
      )}
    </>
  )
}
