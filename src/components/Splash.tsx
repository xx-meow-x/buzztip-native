import { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { Logo } from './Logo'
import { T } from './ui'
import { fonts, radii, useTheme } from '../theme'

export function Splash() {
  const { t } = useTheme()
  const pulse = useRef(new Animated.Value(1)).current
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.06, duration: 900, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]))
    loop.start()
    return () => loop.stop()
  }, [pulse])
  return (
    <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale: pulse }], width: 112, height: 112, borderRadius: radii.lg, backgroundColor: t.surface2, borderWidth: 1, borderColor: t.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
        <Logo size={76} />
      </Animated.View>
      <T size={38} color={t.accent} style={{ fontFamily: fonts.display, letterSpacing: 1 }}>BUZZTIP</T>
      <T size={15} muted style={{ marginTop: 6 }}>What's the buzz?</T>
    </View>
  )
}
