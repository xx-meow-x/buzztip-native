import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(config)

// initializeAuth can only run once (fast refresh re-runs this file), so fall back to getAuth.
let auth: Auth
if (Platform.OS === 'web') {
  auth = getAuth(app) // the browser keeps you signed in on its own
} else {
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  } catch {
    auth = getAuth(app)
  }
}

export { app, auth }
export const db = getFirestore(app)
export const storage = getStorage(app)
