import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon } from './Icon'
import { Pill, T, card } from './ui'
import { useApp } from '../context/DataContext'
import { timeAgo } from '../lib/format'
import { useTheme } from '../theme'
import type { Announcement } from '../types'

export function AnnouncementCard({ a, compact = false }: { a: Announcement; compact?: boolean }) {
  const { me, api } = useApp()
  const { t } = useTheme()
  const [open, setOpen] = useState(false)
  const saved = a.savedBy.includes(me.id)
  return (
    <View style={[card(t), a.urgent && { borderColor: t.accent }]}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
        {a.urgent ? <Pill tone="urgent">URGENT</Pill> : null}
        <Pill>{a.category}</Pill>
      </View>
      <T w="bold" size={14} style={{ marginBottom: 4 }}>{a.title}</T>
      <T size={12} muted style={{ lineHeight: 18 }} numberOfLines={open ? undefined : 2}>{a.body}</T>
      {!compact && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <T size={11} muted>{a.by} · {timeAgo(a.at)}</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Pressable onPress={() => api.toggleSaveAnnouncement(a)} hitSlop={8} accessibilityLabel={saved ? 'Remove from saved' : 'Save post'}>
              <Icon name="bookmark" size={18} filled={saved} color={saved ? t.accent : t.muted} />
            </Pressable>
            <Pressable onPress={() => setOpen(!open)} hitSlop={8}><T size={12} color={t.accentText}>{open ? 'Show less' : 'Read more'}</T></Pressable>
          </View>
        </View>
      )}
    </View>
  )
}
