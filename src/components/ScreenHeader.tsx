import { type ReactNode } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Icon } from './Icon'
import { IconButton, T, ThemeToggle } from './ui'
import { useTheme } from '../theme'
import type { Nav, RootStackParamList } from '../types'

// Back arrow, centered title (or custom children), theme toggle.
export function ScreenHeader({ title, back, children }: { title?: string; back?: Exclude<keyof RootStackParamList, 'Conversation'>; children?: ReactNode }) {
  const navigation = useNavigation<Nav>()
  const { t } = useTheme()
  const onBack = () => (back ? navigation.navigate(back) : navigation.canGoBack() ? navigation.goBack() : navigation.replace('Home'))
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: t.border }}>
      <IconButton onPress={onBack} label="Back"><Icon name="back" /></IconButton>
      <View style={{ flex: 1, alignItems: children ? 'flex-start' : 'center' }}>
        {children || <T w="semi" size={16}>{title}</T>}
      </View>
      <ThemeToggle />
    </View>
  )
}
