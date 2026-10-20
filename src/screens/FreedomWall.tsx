import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { ICONS } from '../assets/icons'
import { BottomNav } from '../components/BottomNav'
import { Logo } from '../components/Logo'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Input, Pill, Rows, Screen, SmallButton, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { timeAgo } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { ScreenProps, WallPost } from '../types'

const MAX = 280

export default function FreedomWall({ route }: ScreenProps<'FreedomWall'>) {
  const { state, api, loading } = useApp()
  const { toast } = useUI()
  const { t } = useTheme()
  const [text, setText] = useState('')

  async function post() {
    const body = text.trim()
    if (!body) return
    setText('')
    try { await api.createWallPost(body); toast('Posted anonymously.') } catch { setText(body); toast('Couldn’t post. Try again.') }
  }

  return (
    <Screen>
      <ScreenHeader title="Freedom Wall" />
      <Body>
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 14 }}>
          <Input value={text} onChangeText={setText} maxLength={MAX} multiline autoFocus={!!route.params?.focus} placeholder="Share something anonymously..." style={{ borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 0, minHeight: 70 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <T size={11} muted>Your name is never shown · {text.length}/{MAX}</T>
            <SmallButton title="Post" onPress={post} disabled={!text.trim()} />
          </View>
        </View>
        <Rows loading={loading} rows={state.wall} empty="The wall is empty. Say something!" render={(w) => {
          return <WallPostCard key={w.id} w={w} mine={state.wallMine.includes(w.id)} />
        }} />
      </Body>
      <BottomNav />
    </Screen>
  )
}

function WallPostCard({ w, mine }: { w: WallPost; mine: boolean }) {
  const { me, api } = useApp()
  const { t } = useTheme()
  const on = w.buzzedBy.includes(me.id)
  return (
    <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <View style={{ width: 30, height: 30, borderRadius: radii.avatar, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center' }}><Logo size={24} /></View>
        <T w="semi" size={13}>{w.alias}</T>{mine ? <Pill>yours</Pill> : null}
        <T size={11} muted style={{ marginLeft: 'auto' }}>{timeAgo(w.at)}</T>
      </View>
      <T size={14} style={{ lineHeight: 20 }}>{w.body}</T>
      <Pressable onPress={() => api.toggleBuzz(w)} accessibilityLabel="Buzz this post"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, height: 30, borderRadius: radii.sm, borderWidth: 1, borderColor: on ? t.accent : t.border, backgroundColor: on ? t.surface2 : 'transparent' }}>
        <T size={13}>{ICONS.buzz}</T><T size={12} color={on ? t.accentText : t.muted}>{w.buzzedBy.length}</T>
      </Pressable>
    </View>
  )
}
