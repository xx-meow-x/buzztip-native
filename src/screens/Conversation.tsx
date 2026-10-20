import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Avatar, Empty, Input, Screen, T } from '../components/ui'
import { useApp, useMessages } from '../context/DataContext'
import { conversationMeta, hasUnread } from '../data/selectors'
import { clock } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { Message, ScreenProps } from '../types'

export default function Conversation({ route, navigation }: ScreenProps<'Conversation'>) {
  const { id } = route.params
  const { state, me, api, loading } = useApp()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  const messages = useMessages(id)
  const [text, setText] = useState('')
  const list = useRef<FlatList<Message>>(null)
  const conv = state.conversations.find((c) => c.id === id)

  // Not a member (or it doesn't exist): back to the chat list.
  useEffect(() => { if (!loading && !conv) navigation.navigate('Chats') }, [loading, conv, navigation])
  // Opening a chat (or getting a message while it's open) clears its unread dot.
  const unread = conv ? hasUnread(conv, me.id) : false
  useEffect(() => { if (unread) api.markRead(id).catch(() => {}) }, [unread, conv?.lastAt, id, api])

  if (!conv) return <Screen><ActivityIndicator color={t.accent} style={{ marginTop: 60 }} /></Screen>
  const meta = conversationMeta(conv, me.id)

  function send() {
    const body = text.trim()
    if (!body) return
    setText('')
    api.sendMessage(id, body).catch(() => setText(body)) // put the text back if it failed
  }

  const renderItem = ({ item: m }: { item: Message }) => {
    if (m.system) return <T size={12} muted style={{ textAlign: 'center', marginVertical: 6 }}>{m.text}</T>
    const mine = m.from === me.id
    return (
      <View style={{ alignSelf: mine ? 'flex-end' : 'flex-start', alignItems: mine ? 'flex-end' : 'flex-start', maxWidth: '78%', marginBottom: 10 }}>
        {!mine && conv.type === 'group' ? <T size={11} muted style={{ marginBottom: 3 }}>{m.fromName}</T> : null}
        <View style={{ backgroundColor: mine ? t.accent : t.surface2, borderWidth: mine ? 0 : 1, borderColor: t.border, borderRadius: radii.lg, borderTopRightRadius: mine ? radii.sm : radii.lg, borderTopLeftRadius: mine ? radii.lg : radii.sm, paddingHorizontal: 12, paddingVertical: 9 }}>
          <T size={14} color={mine ? t.accentInk : t.text} style={{ lineHeight: 20 }}>{m.text}</T>
        </View>
        <T size={10} muted style={{ marginTop: 3 }}>{clock(m.at)}</T>
      </View>
    )
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScreenHeader back="Chats">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar initials={meta.initials} color={meta.color} size={34} />
            <View style={{ flexShrink: 1 }}>
              <T w="bold" size={14} numberOfLines={1}>{meta.title}</T>
              <T size={11} color={t.accentText}>{meta.subtitle}</T>
            </View>
          </View>
        </ScreenHeader>
        {messages === null ? <ActivityIndicator color={t.accent} style={{ marginTop: 40 }} /> : (
          <FlatList ref={list} data={messages} keyExtractor={(m) => m.id} renderItem={renderItem}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            ListEmptyComponent={<Empty>Say hi to start the conversation.</Empty>}
            onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
            keyboardShouldPersistTaps="handled" />
        )}
        <View style={{ flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 12 + (Platform.OS === 'ios' ? 0 : 0) + ins.bottom * 0.5, borderTopWidth: 1, borderTopColor: t.border, alignItems: 'flex-end' }}>
          <Input value={text} onChangeText={setText} placeholder="Type a message..." multiline style={{ flex: 1, minHeight: 42, maxHeight: 110, paddingVertical: 10 }} maxLength={2000} />
          <Pressable onPress={send} disabled={!text.trim()} accessibilityLabel="Send"
            style={{ width: 42, height: 42, borderRadius: radii.md, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', opacity: text.trim() ? 1 : 0.5 }}>
            <Icon name="send" color={t.accentInk} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}
