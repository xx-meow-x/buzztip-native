import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque'
import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from '@expo-google-fonts/figtree'
import { ThemeProvider, useTheme } from './src/theme'
import { UIProvider } from './src/context/UIContext'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import { DataProvider } from './src/context/DataContext'
import { RootNavigator } from './src/navigation'
import { navRef } from './src/navigation/ref'
import { SheetHost } from './src/sheets'
import { Splash } from './src/components/Splash'
import { Toast } from './src/components/Toast'

function Gate() {
  const { status } = useAuth()
  const { t } = useTheme()
  const [minDone, setMinDone] = useState(false)
  useEffect(() => { const id = setTimeout(() => setMinDone(true), 1200); return () => clearTimeout(id) }, [])

  if (status === 'loading' || !minDone) return <Splash />
  const base = t.dark ? DarkTheme : DefaultTheme
  const navTheme = { ...base, colors: { ...base.colors, background: t.bg, card: t.bg, text: t.text, border: t.border, primary: t.accent } }
  return (
    <View style={{ flex: 1, backgroundColor: t.dark ? '#07070C' : '#EBE3C8' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', backgroundColor: t.bg, overflow: 'hidden' }}>
      <NavigationContainer ref={navRef} theme={navTheme}><RootNavigator /></NavigationContainer>
      <Toast />
      </View>
      <SheetHost />
    </View>
  )
}

function Shell() {
  const { t } = useTheme()
  return (
    <>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <Gate />
    </>
  )
}

export default function App() {
  const [loaded, fontError] = useFonts({
    BricolageGrotesque_800ExtraBold, Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold,
  })
  if (!loaded && !fontError) return null
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UIProvider>
          <AuthProvider>
            <DataProvider>
              <Shell />
            </DataProvider>
          </AuthProvider>
        </UIProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
