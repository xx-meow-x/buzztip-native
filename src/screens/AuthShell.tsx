import { type ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { Screen, T, ThemeToggle } from '../components/ui'
import { fonts, useTheme } from '../theme'
import type { Nav } from '../types'

// Shared frame for Register, Login and VerifyEmail.
export function AuthShell({ navigation, subtitle, title, blurb, children, back = true }: { navigation: Pick<Nav, 'canGoBack' | 'goBack' | 'navigate'>; subtitle: string; title: string; blurb: string; children: ReactNode; back?: boolean }) {
  const { t } = useTheme()
  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, paddingBottom: 0 }}>
          {back ? (
            <Pressable onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome'))} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 40 }}>
              <Icon name="back" size={18} color={t.muted} /><T muted size={14}>Back</T>
            </Pressable>
          ) : <View />}
          <ThemeToggle />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 28, paddingTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 26 }}>
            <Logo size={34} />
            <View>
              <T size={16} color={t.accent} style={{ fontFamily: fonts.display, letterSpacing: 0.5 }}>BUZZTIP</T>
              <T size={11} muted>{subtitle}</T>
            </View>
          </View>
          <T size={26} style={{ fontFamily: fonts.display, marginBottom: 4 }}>{title}</T>
          <T muted size={14} style={{ marginBottom: 24 }}>{blurb}</T>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
