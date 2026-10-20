import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  type User, type UserCredential,
  createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail,
  signInWithEmailAndPassword, signOut, updateProfile as setAuthProfile,
} from 'firebase/auth'
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { normalize } from '../lib/firestore'
import { isTipEmail } from '../lib/auth'
import { getEnrolledCourses } from '../lib/enrollment'
import { pickColor } from '../config'
import type { Profile } from '../types'

export type AuthStatus = 'loading' | 'signedOut' | 'unverified' | 'ready' | 'error'

interface AuthValue {
  status: AuthStatus
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  error: string | null
  register: (f: { name: string; email: string; password: string; label: string }) => Promise<void>
  login: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
  resendVerification: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshVerification: () => Promise<boolean>
  retry: () => void
}

const Ctx = createContext<AuthValue | null>(null)
const pendingKey = (uid: string) => `bt-pending-${uid}`

// Runs once the email is verified. Rules only let verified @tip.edu.ph accounts write,
// which is why the profile is created here and not at sign-up.
async function ensureProfile(u: User) {
  const ref = doc(db, 'users', u.uid)
  if ((await getDoc(ref)).exists()) return
  const label = (await AsyncStorage.getItem(pendingKey(u.uid))) || 'Student'
  const name = u.displayName || (u.email ?? 'student').split('@')[0]
  await setDoc(ref, {
    name, nameLower: name.toLowerCase(), label, program: '', avatar: '',
    courses: getEnrolledCourses(), color: pickColor(), createdAt: serverTimestamp(),
  })
  AsyncStorage.removeItem(pendingKey(u.uid)).catch(() => {})
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [, setTick] = useState(0)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        // Defense in depth: the server should never create these, but never keep one signed in.
        if (u && !isTipEmail(u.email)) { signOut(auth); return }
        setUser(u)
        setBooted(true)
      }),
    []
  )

  const verified = !!user?.emailVerified
  useEffect(() => {
    if (!user || !verified) { setProfile(null); setAdmin(false); return }
    let unsub: (() => void) | undefined
    let cancelled = false
    ;(async () => {
      try {
        // Force a fresh token so email_verified is true in what the rules see.
        const tok = await user.getIdTokenResult(true)
        if (cancelled) return
        setAdmin(tok.claims.admin === true)
        await ensureProfile(user)
        if (cancelled) return
        unsub = onSnapshot(
          doc(db, 'users', user.uid),
          (s) => setProfile(s.exists() ? ({ id: s.id, ...normalize(s.data()) } as Profile) : null),
          (e) => setError(e.message)
        )
      } catch (e) {
        if (!cancelled) setError((e as Error).message || 'Could not load your account.')
      }
    })()
    return () => { cancelled = true; unsub && unsub() }
  }, [user?.uid, verified, attempt])

  let status: AuthStatus = 'ready'
  if (error) status = 'error'
  else if (!booted) status = 'loading'
  else if (!user) status = 'signedOut'
  else if (!verified) status = 'unverified'
  else if (!profile) status = 'loading'

  const actions = useMemo(
    () => ({
      async register({ name, email, password, label }: { name: string; email: string; password: string; label: string }) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
        await setAuthProfile(cred.user, { displayName: name.trim() })
        await AsyncStorage.setItem(pendingKey(cred.user.uid), label)
        try { await sendEmailVerification(cred.user) } catch { /* they can resend from the next screen */ }
      },
      login: (email: string, password: string) => signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password),
      logout: () => signOut(auth),
      resendVerification: () => sendEmailVerification(auth.currentUser as User),
      resetPassword: (email: string) => sendPasswordResetEmail(auth, email.trim().toLowerCase()),
      async refreshVerification(): Promise<boolean> {
        const u = auth.currentUser
        if (!u) return false
        await u.reload()
        setTick((x) => x + 1)
        return u.emailVerified
      },
      retry() { setError(null); setAttempt((a) => a + 1) },
    }),
    []
  )

  const value = useMemo<AuthValue>(
    () => ({ status, user, profile, isAdmin: admin, error, ...actions }),
    [status, user, profile, admin, error, actions]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>')
  return v
}
