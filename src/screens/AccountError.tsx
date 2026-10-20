import { View } from 'react-native'
import { Button, Screen, T } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function AccountError() {
  const { error, retry, logout } = useAuth()
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
        <T w="bold" size={20} style={{ marginBottom: 8 }}>Couldn’t load your account</T>
        <T muted size={14} style={{ marginBottom: 24, lineHeight: 21 }}>{error}</T>
        <Button title="Try again" onPress={retry} />
        <Button title="Log out" variant="secondary" onPress={logout} />
      </View>
    </Screen>
  )
}
