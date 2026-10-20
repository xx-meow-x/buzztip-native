import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, BackHandler, Pressable, ScrollView, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ICONS } from '../assets/icons'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { BottomNav } from '../components/BottomNav'
import { ChatRow } from '../components/ChatRow'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { PostCard } from '../components/PostCard'
import { Avatar, Body, IconButton, Input, Pill, Screen, SectionHeader, T, ThemeToggle } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { sortedConversations } from '../data/selectors'
import { fonts, radii, useTheme } from '../theme'
import type { AppState, NoParamScreen, ScreenProps } from '../types'

const TILES: [NoParamScreen, string, string][] = [
  ['Chats', ICONS.chats, 'Chats'], ['Announcements', ICONS.announcements, 'Admin'], ['Events', ICONS.events, 'Events'],
  ['Reminders', ICONS.reminders, 'Remind'], ['Marketplace', ICONS.marketplace, 'Market'], ['Groups', ICONS.groups, 'Groups'],
  ['LostFound', ICONS.lostFound, 'Lost+'], ['FreedomWall', ICONS.freedomWall, 'Freedom'],
]

interface SearchHit {
  key: string
  type: string
  title: string
  to: NoParamScreen
}

function useSearch(state: AppState, q: string): SearchHit[] {
  return useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    const hit = (...xs: string[]) => xs.join(' ').toLowerCase().includes(term)
    const clip = (s: string) => s.slice(0, 60) + (s.length > 60 ? '…' : '')
    const out: SearchHit[] = [
      ...state.groups.filter((g) => hit(g.name, g.category)).map((g) => ({ key: g.id, type: 'Group', title: g.name, to: 'Groups' as const })),
      ...state.announcements.filter((a) => hit(a.title, a.body)).map((a) => ({ key: a.id, type: 'Announcement', title: a.title, to: 'Announcements' as const })),
      ...state.events.filter((e) => hit(e.title, e.venue)).map((e) => ({ key: e.id, type: 'Event', title: e.title, to: 'Events' as const })),
      ...state.listings.filter((l) => hit(l.title)).map((l) => ({ key: l.id, type: 'Marketplace', title: l.title, to: 'Marketplace' as const })),
      ...state.lostFound.filter((l) => hit(l.title, l.where)).map((l) => ({ key: l.id, type: 'Lost & Found', title: l.title, to: 'LostFound' as const })),
      ...state.posts.filter((p) => hit(p.body)).map((p) => ({ key: p.id, type: 'Post', title: clip(p.body), to: 'Feed' as const })),
    ]
    return out.slice(0, 20)
  }, [state, q])
}

export default function Home({ navigation }: ScreenProps<'Home'>) {
  const { state, me } = useApp()
  const { logout } = useAuth()
  const { toast } = useUI()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')

  const DRAWER_W = Math.min(300, width * 0.78)
  const x = useRef(new Animated.Value(DRAWER_W)).current
  useEffect(() => {
    Animated.timing(x, { toValue: menuOpen ? 0 : DRAWER_W, duration: 250, useNativeDriver: true }).start()
  }, [menuOpen, DRAWER_W, x])
  useEffect(() => {
    if (!menuOpen) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { setMenuOpen(false); return true })
    return () => sub.remove()
  }, [menuOpen])

  const chats = sortedConversations(state).slice(0, 3)
  const anns = [...state.announcements].sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.at - a.at).slice(0, 2)
  const posts = state.posts.slice(0, 2)
  const results = useSearch(state, q)

  const go = (name: 'Chats' | 'Groups' | 'Feed' | 'Announcements' | 'Events' | 'Reminders' | 'Marketplace' | 'LostFound' | 'FreedomWall' | 'Profile', params?: { saved?: boolean }) => {
    setMenuOpen(false)
    if (name === 'Announcements') navigation.navigate('Announcements', params)
    else navigation.navigate(name)
  }
  const soon = (what: string) => { setMenuOpen(false); toast(`${what} is coming in a later version.`) }
  const none = (msg: string) => <T size={13} muted style={{ marginBottom: 18 }}>{msg}</T>

  const item = (icon: string, label: string, onPress: () => void, extra?: 'on' | 'red') => (
    <Pressable key={label} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 11, paddingHorizontal: 18 }}>
      <T size={16}>{icon}</T>
      <T w={extra === 'on' ? 'semi' : 'body'} size={14} color={extra === 'on' ? t.accentText : extra === 'red' ? t.lost : t.text}>{label}</T>
    </Pressable>
  )

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: t.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Logo size={28} />
          <T size={18} color={t.accent} style={{ fontFamily: fonts.display, letterSpacing: 0.5 }}>BUZZTIP</T>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ThemeToggle />
          <IconButton onPress={() => setMenuOpen(true)} label="Open menu"><Icon name="menu" /></IconButton>
        </View>
      </View>

      <Body>
        <Input value={q} onChangeText={setQ} placeholder="Search BUZZTIP..." returnKeyType="search" style={{ height: 42, minHeight: 42 }} />
        {q.trim() ? (
          <View style={{ marginTop: 14 }}>
            {results.length ? results.map((r) => (
              <Pressable key={r.type + r.key} onPress={() => navigation.navigate(r.to)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 8 }}>
                <Pill>{r.type}</Pill><T w="semi" size={13} numberOfLines={1} style={{ flex: 1 }}>{r.title}</T>
              </Pressable>
            )) : <T muted style={{ textAlign: 'center', paddingVertical: 24 }}>Nothing matches “{q}”.</T>}
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14, marginBottom: 22 }}>
              {TILES.map(([to, icon, label]) => (
                <Pressable key={to} onPress={() => navigation.navigate(to)}
                  style={{ width: '23.2%', alignItems: 'center', gap: 6, paddingTop: 12, paddingBottom: 9, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md }}>
                  <T size={22}>{icon}</T><T size={11} muted>{label}</T>
                </Pressable>
              ))}
            </View>

            <SectionHeader title="Recent Chats" onSeeAll={() => navigation.navigate('Chats')} />
            {chats.length ? chats.map((c) => <ChatRow key={c.id} conv={c} card onPress={() => navigation.navigate('Conversation', { id: c.id })} />) : none('No chats yet. Join a group or message someone to start one.')}

            <SectionHeader title="Announcements" onSeeAll={() => navigation.navigate('Announcements')} />
            {anns.length ? anns.map((a) => <AnnouncementCard key={a.id} a={a} compact />) : none('No announcements yet.')}

            <View style={{ height: 10 }} />
            <SectionHeader title="Campus Feed" onSeeAll={() => navigation.navigate('Feed')} />
            {posts.length ? posts.map((p) => <PostCard key={p.id} post={p} />) : none('Nothing posted yet. Be the first with the + button.')}
          </>
        )}
      </Body>

      <BottomNav />

      <Animated.View pointerEvents={menuOpen ? 'auto' : 'none'} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: t.scrim, opacity: x.interpolate({ inputRange: [0, DRAWER_W], outputRange: [1, 0] }) }}>
        <Pressable style={{ flex: 1 }} onPress={() => setMenuOpen(false)} accessibilityLabel="Close menu" />
      </Animated.View>
      <Animated.View pointerEvents={menuOpen ? 'auto' : 'none'}
        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: DRAWER_W, backgroundColor: t.surface, borderLeftWidth: 1, borderLeftColor: t.border, transform: [{ translateX: x }], paddingTop: ins.top + 16 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: ins.bottom + 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: t.border, marginBottom: 8 }}>
            <Avatar name={me.name} color={t.surface2} size={44} src={me.avatar || undefined}>{ICONS.profile}</Avatar>
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} numberOfLines={1}>{me.name}</T>
              <T size={11} muted numberOfLines={1}>{me.email}</T>
            </View>
          </View>
          {item(ICONS.home, 'Home', () => setMenuOpen(false), 'on')}
          {item(ICONS.chats, 'Chats', () => go('Chats'))}
          {item(ICONS.groups, 'Groups', () => go('Groups'))}
          {item(ICONS.feed, 'Campus Feed', () => go('Feed'))}
          {item(ICONS.announcements, 'Announcements', () => go('Announcements'))}
          {item(ICONS.events, 'Events', () => go('Events'))}
          {item(ICONS.reminders, 'Reminders', () => go('Reminders'))}
          {item(ICONS.marketplace, 'Marketplace', () => go('Marketplace'))}
          {item(ICONS.lostFound, 'Lost & Found', () => go('LostFound'))}
          {item(ICONS.freedomWall, 'Freedom Wall', () => go('FreedomWall'))}
          <View style={{ height: 1, backgroundColor: t.border, marginHorizontal: 18, marginVertical: 8 }} />
          {item(ICONS.saved, 'Saved Posts', () => go('Announcements', { saved: true }))}
          {item(ICONS.files, 'My Files', () => soon('My Files'))}
          {item(ICONS.settings, 'Settings', () => go('Profile'))}
          {item(ICONS.help, 'Help & Support', () => soon('Help & Support'))}
          {item(ICONS.logout, 'Log Out', () => { setMenuOpen(false); logout() }, 'red')}
        </ScrollView>
      </Animated.View>
    </Screen>
  )
}
