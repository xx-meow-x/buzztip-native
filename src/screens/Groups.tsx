import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { Avatar, Body, Button, Pill, Rows, Screen, Segmented, SmallButton, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { groupConvId, isMember } from '../data/selectors'
import { initials } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { Group, ScreenProps } from '../types'

export default function Groups({ navigation }: ScreenProps<'Groups'>) {
  const { state, me, api, loading } = useApp()
  const { openSheet, toast } = useUI()
  const { t } = useTheme()
  const [tab, setTab] = useState<'mine' | 'popular' | 'discover'>('mine')

  let rows = state.groups
  if (tab === 'mine') rows = rows.filter((g) => isMember(g, me.id)).sort((a, b) => (b.isCourse ? 1 : 0) - (a.isCourse ? 1 : 0))
  if (tab === 'popular') rows = [...rows].sort((a, b) => b.memberIds.length - a.memberIds.length)
  if (tab === 'discover') rows = rows.filter((g) => !isMember(g, me.id) && !g.isCourse)

  async function toggle(g: Group) {
    const joining = !isMember(g, me.id)
    try {
      await api.toggleGroup(g)
      toast(joining ? `Joined ${g.name}. Its group chat is now in Chats.` : `Left ${g.name}.`)
    } catch { toast('Couldn’t update that group. Try again.') }
  }

  const emptyText = tab === 'mine' ? 'You haven’t joined any groups yet. Try the Discover tab.'
    : tab === 'discover' ? 'Nothing new to discover. Create a group with the button above.' : 'No groups yet. Create the first one!'

  return (
    <Screen>
      <ScreenHeader title="Groups" />
      <Body>
        <Segmented value={tab} onChange={setTab} options={[{ value: 'mine', label: 'My Groups' }, { value: 'popular', label: 'Popular' }, { value: 'discover', label: 'Discover' }]} />
        <Button small variant="secondary" title="+ Create a group" onPress={() => openSheet('group')} />
        <Rows loading={loading} rows={rows} empty={emptyText} render={(g) => {
          const joined = isMember(g, me.id)
          return (
            <View key={g.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 8 }}>
              <Pressable disabled={!joined} onPress={() => navigation.navigate('Conversation', { id: groupConvId(g.id) })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar initials={g.isCourse ? g.course.replace(/\s+/g, '').slice(0, 3) : initials(g.name)} color={g.color} />
                <View style={{ flex: 1, gap: 4 }}>
                  <T w="semi" size={14} numberOfLines={1}>{g.name}</T>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Pill>{g.category}</Pill><T size={11} muted>{g.memberIds.length} members</T>
                  </View>
                </View>
              </Pressable>
              {g.isCourse
                ? <Pill tone="course">{joined ? 'Enrolled' : 'Not enrolled'}</Pill>
                : <SmallButton title={joined ? 'Joined' : 'Join'} outlined={joined} onPress={() => toggle(g)} />}
            </View>
          )
        }} />
        {tab === 'mine' ? <T size={12} muted style={{ textAlign: 'center', marginTop: 8 }}>Course groups are added from your enrollment and update each term.</T> : null}
      </Body>
      <BottomNav />
    </Screen>
  )
}
