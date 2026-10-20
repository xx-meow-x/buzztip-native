import { Pressable } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { PostCard } from '../components/PostCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Rows, Screen, SmallButton, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { radii, useTheme } from '../theme'

export default function Feed() {
  const { state, me, loading } = useApp()
  const { openSheet } = useUI()
  const { t } = useTheme()
  return (
    <Screen>
      <ScreenHeader title="Campus Feed" />
      <Body>
        <Pressable onPress={() => openSheet('post')}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 14 }}>
          <T size={13} muted style={{ flex: 1 }} numberOfLines={1}>What’s happening on campus, {me.name.split(' ')[0]}?</T>
          <SmallButton title="Post" onPress={() => openSheet('post')} />
        </Pressable>
        <Rows loading={loading} rows={state.posts} empty="Nothing posted yet. Be the first to share something." render={(p) => <PostCard key={p.id} post={p} />} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
