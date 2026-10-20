import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { T } from './ui'
import { useUI } from '../context/UIContext'
import { radii, useTheme } from '../theme'

export function Toast() {
  const { toastMsg } = useUI()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  if (!toastMsg) return null
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 24, right: 24, bottom: 90 + ins.bottom, alignItems: 'center' }}>
      <View style={{ backgroundColor: t.text, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radii.md }}>
        <T w="medium" size={13} color={t.bg} accessibilityRole="alert">{toastMsg}</T>
      </View>
    </View>
  )
}
