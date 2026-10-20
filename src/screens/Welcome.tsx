import { View } from 'react-native'
import { Logo } from '../components/Logo'
import { Button, Screen, T, ThemeToggle } from '../components/ui'
import { fonts, radii, useTheme } from '../theme'
import type { ScreenProps } from '../types'

export default function Welcome({ navigation }: ScreenProps<'Welcome'>) {
  const { t } = useTheme()
  return (
    <Screen>
      <View style={{ alignItems: 'flex-end', padding: 18 }}><ThemeToggle /></View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 }}>
        <View style={{ width: 112, height: 112, borderRadius: radii.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <Logo size={76} />
        </View>
        <T size={38} color={t.accent} style={{ fontFamily: fonts.display, letterSpacing: 1 }}>BUZZTIP</T>
        <T muted size={15} style={{ marginTop: 6, marginBottom: 26 }}>Connect. Communicate. Campus.</T>
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 16, maxWidth: 300 }}>
          <T muted size={14} style={{ textAlign: 'center', lineHeight: 21 }}>Your campus buzz in one place: announcements, chats, events and more.</T>
        </View>
      </View>
      <View style={{ paddingHorizontal: 28, paddingBottom: 32 }}>
        <Button title="Get started" onPress={() => navigation.navigate('Register')} />
        <Button title="Log in" variant="secondary" onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  )
}
