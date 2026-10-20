import { Pressable, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ICONS } from '../assets/icons'
import { T } from './ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { totalUnread } from '../data/selectors'
import { fonts, radii, useTheme } from '../theme'
import type { Nav, RootStackParamList } from '../types'

const NAV_H = 62

export function BottomNav({ fab = true }: { fab?: boolean }) {
  const navigation = useNavigation<Nav>()
  const route = useRoute()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  const { state, me } = useApp()
  const { openSheet } = useUI()
  const unread = totalUnread(state, me.id)

  const tab = (name: 'Home' | 'Chats' | 'Profile', icon: string, label: string, badge?: number) => {
    const on = route.name === (name as keyof RootStackParamList)
    return (
      <Pressable key={name} onPress={() => !on && navigation.replace(name)} accessibilityRole="button" accessibilityLabel={label}
        style={{ width: 72, alignItems: 'center', gap: 2 }}>
        <View>
          <T size={20} style={{ opacity: on ? 1 : 0.6 }}>{icon}</T>
          {badge ? (
            <View style={{ position: 'absolute', top: -4, right: -10, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
              <T w="bold" size={10} color={t.accentInk}>{badge > 9 ? '9+' : badge}</T>
            </View>
          ) : null}
        </View>
        <T w="semi" size={11} color={on ? t.accentText : t.muted}>{label}</T>
      </Pressable>
    )
  }

  return (
    <>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: NAV_H + ins.bottom, paddingBottom: ins.bottom, backgroundColor: t.surface, borderTopWidth: 1, borderTopColor: t.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
        {tab('Home', ICONS.home, 'Home')}
        {tab('Chats', ICONS.chats, 'Chats', unread)}
        {tab('Profile', ICONS.profile, 'Profile')}
      </View>
      {fab && (
        <Pressable onPress={() => openSheet('create')} accessibilityRole="button" accessibilityLabel="Create new"
          style={{ position: 'absolute', right: 18, bottom: NAV_H + ins.bottom + 14, width: 52, height: 52, borderRadius: radii.lg, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }}>
          <T size={30} color={t.accentInk} style={{ fontFamily: fonts.medium, marginTop: -2 }}>+</T>
        </Pressable>
      )}
    </>
  )
}
