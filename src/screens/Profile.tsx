import { Pressable, View } from 'react-native'
import { ICONS } from '../assets/icons'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { Avatar, Body, Screen, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { groupConvId, isMember } from '../data/selectors'
import { fonts, radii, useTheme } from '../theme'
import type { ScreenProps } from '../types'

export default function Profile({ navigation }: ScreenProps<'Profile'>) {
  const { state, me } = useApp()
  const { logout } = useAuth()
  const { openSheet, toast } = useUI()
  const { t } = useTheme()
  const posts = state.posts.filter((p) => p.authorId === me.id).length
  const groups = state.groups.filter((g) => isMember(g, me.id)).length
  const events = state.events.filter((e) => !e.holiday && e.goingIds.includes(me.id)).length
  const soon = (what: string) => toast(`${what} is coming in a later version.`)

  const Row = ({ icon, label, onPress, red }: { icon: string; label: string; onPress: () => void; red?: boolean }) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 14, marginBottom: 8 }}>
      <T size={16}>{icon}</T>
      <T w="medium" size={14} color={red ? t.lost : t.text} style={{ flex: 1 }}>{label}</T>
      {!red ? <T size={18} muted>›</T> : null}
    </Pressable>
  )
  const Stat = ({ n, label }: { n: number; label: string }) => <View style={{ alignItems: 'center' }}><T w="bold" size={20} color={t.accentText}>{n}</T><T size={11} muted>{label}</T></View>

  return (
    <Screen>
      <ScreenHeader><T size={17} color={t.accent} style={{ fontFamily: fonts.display }}>BUZZTIP</T></ScreenHeader>
      <Body>
        <View style={{ alignItems: 'center', paddingVertical: 14 }}>
          <View style={{ width: 84, height: 84, borderRadius: radii.avatar + 4, borderWidth: 2, borderColor: t.accent, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 }}>
            <Avatar name={me.name} color={t.surface2} src={me.avatar || undefined} size={80}>{ICONS.profile}</Avatar>
          </View>
          <T w="bold" size={18}>{me.name}</T>
          <T size={12} muted>{me.email}{me.label ? ` · ${me.label}` : ''}</T>
          <View style={{ flexDirection: 'row', gap: 36, marginTop: 14 }}>
            <Stat n={posts} label="Posts" /><Stat n={groups} label="Groups" /><Stat n={events} label="Events" />
          </View>
        </View>

        <T w="bold" size={15} style={{ marginTop: 6, marginBottom: 10 }}>My Courses</T>
        {me.courses.length ? me.courses.map((code) => {
          const g = state.groups.find((x) => x.isCourse && x.course === code)
          return (
            <Pressable key={code} onPress={() => g && navigation.navigate('Conversation', { id: groupConvId(g.id) })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 12, marginBottom: 8 }}>
              <T w="bold" size={13} color={t.accentText}>{code}</T><T size={12} muted style={{ flex: 1 }} numberOfLines={1}>{g?.name || ''}</T><T size={18} muted>›</T>
            </Pressable>
          )
        }) : <T size={12} muted style={{ marginBottom: 6, lineHeight: 18 }}>No courses detected yet. Once your student number is verified, your course group chats appear here automatically.</T>}
        <View style={{ height: 14 }} />

        <Row icon={ICONS.edit} label="Edit Profile" onPress={() => openSheet('profile')} />
        <Row icon={ICONS.settings} label="Account Settings" onPress={() => soon('Account Settings')} />
        <Row icon={ICONS.privacy} label="Privacy & Security" onPress={() => soon('Privacy & Security')} />
        <Row icon={ICONS.notifications} label="Notifications" onPress={() => soon('Notifications')} />
        <Row icon={ICONS.help} label="Help & Support" onPress={() => soon('Help & Support')} />
        <Row icon={ICONS.about} label="About BUZZTIP" onPress={() => toast('BUZZTIP v0.2 · Made for TIP students.')} />
        <Row icon={ICONS.logout} label="Log Out" red onPress={logout} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
