import { useState } from 'react'
import { View } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { ChatRow } from '../components/ChatRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Input, Rows, Screen, SmallButton } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { conversationMeta, sortedConversations } from '../data/selectors'
import type { ScreenProps } from '../types'

export default function Chats({ navigation }: ScreenProps<'Chats'>) {
  const { state, me, loading } = useApp()
  const { openSheet } = useUI()
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const list = sortedConversations(state).filter((c) => !term || conversationMeta(c, me.id).title.toLowerCase().includes(term))
  return (
    <Screen>
      <ScreenHeader title="Chats" />
      <Body>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 6 }}>
          <Input value={q} onChangeText={setQ} placeholder="Search chats..." style={{ flex: 1, height: 42, minHeight: 42 }} />
          <SmallButton title="+ Group" onPress={() => openSheet('group')} style={{ height: 42 }} />
        </View>
        <Rows loading={loading} rows={list}
          empty={q ? 'No chats match your search.' : 'No chats yet. Join a group or message someone to start one.'}
          render={(c) => <ChatRow key={c.id} conv={c} onPress={() => navigation.navigate('Conversation', { id: c.id })} />} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
