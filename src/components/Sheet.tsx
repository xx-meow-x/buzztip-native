import { type ReactNode } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { T } from './ui'
import { useUI } from '../context/UIContext'
import { radii, useTheme } from '../theme'

// Bottom sheet. Used as the root of every form in src/sheets.
export function Sheet({ title, children }: { title: ReactNode; children: ReactNode }) {
  const { closeSheet } = useUI()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  return (
    <Modal transparent animationType="slide" onRequestClose={closeSheet} statusBarTranslucent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={{ flex: 1, backgroundColor: t.scrim }} onPress={closeSheet} accessibilityLabel="Close" />
        <View style={{ maxHeight: '88%', width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: t.surface, borderTopLeftRadius: radii.lg + 4, borderTopRightRadius: radii.lg + 4, borderWidth: 1, borderColor: t.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, paddingBottom: 8 }}>
            <View style={{ flex: 1 }}>{typeof title === 'string' ? <T w="bold" size={17}>{title}</T> : title}</View>
            <Pressable onPress={closeSheet} hitSlop={12} accessibilityLabel="Close"><T size={26} muted>×</T></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 18, paddingTop: 8, paddingBottom: 24 + ins.bottom }}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
