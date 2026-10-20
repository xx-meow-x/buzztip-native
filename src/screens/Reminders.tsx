import { Pressable, View } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Button, Empty, Pill, Screen, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { clock, shortDate } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { Reminder } from '../types'

export default function Reminders() {
  const { state, api } = useApp()
  const { openSheet } = useUI()
  const { t } = useTheme()
  const upcoming = state.reminders.filter((r) => !r.done).sort((a, b) => a.at - b.at)
  const done = state.reminders.filter((r) => r.done)

  const Row = (r: Reminder) => {
    const late = !r.done && r.at < Date.now()
    return (
      <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: late ? t.lost : t.border, borderRadius: radii.md, padding: 12, marginBottom: 8, opacity: r.done ? 0.6 : 1 }}>
        <Pressable onPress={() => api.toggleReminder(r)} accessibilityLabel={r.done ? 'Mark as not done' : 'Mark as done'}
          style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: r.done ? t.accent : late ? t.lost : t.muted, backgroundColor: r.done ? t.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {r.done ? <Icon name="check" size={14} strokeWidth={3} color={t.accentInk} /> : null}
        </Pressable>
        <View style={{ flex: 1 }}>
          <T w="semi" size={14} style={r.done ? { textDecorationLine: 'line-through' } : null}>{r.title}</T>
          <T size={11} muted>{shortDate(r.at)} · {clock(r.at)}{late ? ' · Overdue' : ''}</T>
        </View>
        {late ? <Pill tone="late">LATE</Pill> : null}
        {r.done ? <Pressable onPress={() => api.deleteReminder(r.id)} hitSlop={10} accessibilityLabel="Delete reminder"><T size={22} muted>×</T></Pressable> : null}
      </View>
    )
  }

  return (
    <Screen>
      <ScreenHeader title="Reminders" />
      <Body>
        <T w="bold" size={15} style={{ marginBottom: 10 }}>Upcoming</T>
        {upcoming.length ? upcoming.map(Row) : <Empty>Nothing coming up. Add a reminder below.</Empty>}
        {done.length > 0 && <><T w="bold" size={15} style={{ marginTop: 20, marginBottom: 10 }}>Completed</T>{done.map(Row)}</>}
        <Button title="+ Add Reminder" onPress={() => openSheet('reminder')} style={{ marginTop: 10 }} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
