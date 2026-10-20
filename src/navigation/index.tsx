import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import type { RootStackParamList } from '../types'
import AccountError from '../screens/AccountError'
import Announcements from '../screens/Announcements'
import Chats from '../screens/Chats'
import Conversation from '../screens/Conversation'
import Events from '../screens/Events'
import Feed from '../screens/Feed'
import FreedomWall from '../screens/FreedomWall'
import Groups from '../screens/Groups'
import Home from '../screens/Home'
import Login from '../screens/Login'
import LostFound from '../screens/LostFound'
import Marketplace from '../screens/Marketplace'
import Profile from '../screens/Profile'
import Register from '../screens/Register'
import Reminders from '../screens/Reminders'
import VerifyEmail from '../screens/VerifyEmail'
import Welcome from '../screens/Welcome'

const Stack = createNativeStackNavigator<RootStackParamList>()
const tab = { animation: 'none' as const } // Home / Chats / Profile swap instantly like tabs

// What you can reach depends on where you are in sign-in. Anything unverified or signed-out
// simply has no screens to navigate to, and the security rules block the data anyway.
export function RootNavigator() {
  const { status } = useAuth()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'signedOut' && (
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </>
      )}
      {status === 'unverified' && <Stack.Screen name="VerifyEmail" component={VerifyEmail} />}
      {status === 'error' && <Stack.Screen name="AccountError" component={AccountError} />}
      {status === 'ready' && (
        <>
          <Stack.Screen name="Home" component={Home} options={tab} />
          <Stack.Screen name="Chats" component={Chats} options={tab} />
          <Stack.Screen name="Profile" component={Profile} options={tab} />
          <Stack.Screen name="Conversation" component={Conversation} />
          <Stack.Screen name="Groups" component={Groups} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="Announcements" component={Announcements} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="LostFound" component={LostFound} />
          <Stack.Screen name="Reminders" component={Reminders} />
          <Stack.Screen name="Marketplace" component={Marketplace} />
          <Stack.Screen name="FreedomWall" component={FreedomWall} />
        </>
      )}
    </Stack.Navigator>
  )
}
