import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Pill, Rows, Screen, Segmented, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { clock, weekday } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { CampusEvent } from '../types'

export default function Events() {
  const { state, me, api, loading } = useApp()
  const { t } = useTheme()
  const [tab, setTab] = useState<'up' | 'past'>('up')
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const isPast = (e: CampusEvent) => (e.holiday ? e.at < startOfToday : e.at < Date.now())
  const rows = state.events
    .filter((e) => (tab === 'past' ? isPast(e) : !isPast(e)))
    .sort((a, b) => (tab === 'past' ? b.at - a.at : a.at - b.at))

  return (
    <Screen>
      <ScreenHeader title="Events" />
      <Body>
        <Segmented value={tab} onChange={setTab} options={[{ value: 'up', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
        <Rows loading={loading} rows={rows} empty={tab === 'up' ? 'No upcoming events. Create one with the + button.' : 'No past events yet.'} render={(e) => {
          const going = e.goingIds.includes(me.id)
          const past = isPast(e)
          const d = new Date(e.at)
          let status = null
          if (!e.holiday) {
            if (past) status = going ? <T w="semi" size={12} color={t.accentText}>✓ Went</T> : null
            else if (going) status = <Pressable onPress={() => api.toggleGoing(e)} accessibilityLabel="Cancel RSVP"><T w="semi" size={12} color={t.accentText}>✓ Going</T></Pressable>
            else status = (
              <Pressable onPress={() => api.toggleGoing(e)} style={{ height: 28, paddingHorizontal: 12, borderRadius: radii.sm, backgroundColor: t.accent, justifyContent: 'center' }}>
                <T w="semi" size={12} color={t.accentInk}>RSVP</T>
              </Pressable>
            )
          }
          return (
            <View key={e.id} style={{ flexDirection: 'row', gap: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: going ? t.accent : t.border, borderRadius: radii.md, padding: 12, marginBottom: 8, opacity: past ? 0.65 : 1 }}>
              <View style={{ width: 48, height: 52, borderRadius: radii.sm, backgroundColor: going ? t.accent : t.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <T w="bold" size={10} color={going ? t.accentInk : t.muted}>{d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</T>
                <T w="bold" size={18} color={going ? t.accentInk : t.text}>{String(d.getDate()).padStart(2, '0')}</T>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <T w="bold" size={14} style={{ flex: 1 }}>{e.title}</T>{status}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="pin" size={13} color={t.muted} /><T size={12} muted>{e.venue}</T>
                </View>
                <T size={11} muted>
                  {weekday(e.at)} · {e.holiday ? 'All day' : clock(e.at)}{e.host ? ` · ${e.host}` : ''}{!e.holiday && e.goingIds.length ? ` · ${e.goingIds.length} going` : ''}
                </T>
                <Pill>{e.category}</Pill>
              </View>
            </View>
          )
        }} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
