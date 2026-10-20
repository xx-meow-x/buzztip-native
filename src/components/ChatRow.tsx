import { Pressable, View } from 'react-native'
import { Avatar, Pill, T } from './ui'
import { useApp } from '../context/DataContext'
import { conversationMeta, hasUnread } from '../data/selectors'
import { timeAgo } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { Conversation } from '../types'

// One chat in a list. `card` gives the boxed style used on Home.
export function ChatRow({ conv, onPress, card = false }: { conv: Conversation; onPress: () => void; card?: boolean }) {
  const { me } = useApp()
  const { t } = useTheme()
  const meta = conversationMeta(conv, me.id)
  let preview = 'No messages yet'
  if (conv.lastText) {
    const who = conv.lastFrom === me.id ? 'You: ' : conv.type === 'group' && conv.lastFromName ? conv.lastFromName.split(' ')[0] + ': ' : ''
    preview = who + conv.lastText
  }
  const unread = hasUnread(conv, me.id)
  const box = card
    ? { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 10, marginBottom: 8 }
    : { borderBottomWidth: 1, borderBottomColor: t.border, paddingVertical: 12 }
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, box]}>
      <Avatar initials={meta.initials} color={meta.color} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <T w={unread ? 'bold' : 'semi'} size={14} numberOfLines={1} style={{ flexShrink: 1 }}>{meta.title}</T>
          {conv.isCourse ? <Pill tone="course">Course</Pill> : null}
        </View>
        <T size={12} muted numberOfLines={1} style={{ marginTop: 2 }}>{preview}</T>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <T size={11} muted>{timeAgo(conv.lastAt)}</T>
        {unread ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.accent }} /> : null}
      </View>
    </Pressable>
  )
}
