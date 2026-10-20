import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AuthShell } from './AuthShell'
import { Button, Field, Input, T } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { authMessage, isTipEmail } from '../lib/auth'
import { EMAIL_DOMAIN } from '../config'
import { useTheme } from '../theme'
import type { ScreenProps } from '../types'

export default function Login({ navigation }: ScreenProps<'Login'>) {
  const { login, resetPassword } = useAuth()
  const { toast } = useUI()
  const { t } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!email.trim() || !password) return setError('Enter your email and password.')
    setBusy(true)
    setError('')
    try {
      await login(email, password)
    } catch (e) {
      setError(authMessage(e))
      setBusy(false)
    }
  }

  async function forgot() {
    if (!isTipEmail(email)) return setError(`Enter your @${EMAIL_DOMAIN} email above first, then tap “Forgot password?”.`)
    try {
      await resetPassword(email)
    } catch { /* same message either way, so this can't be used to find out who has an account */ }
    setError('')
    toast('If that account exists, a reset link is on its way.')
  }

  return (
    <AuthShell navigation={navigation} subtitle="Welcome back" title="Welcome Back" blurb="Sign in to continue">
      <Field label="TIP Email">
        <Input value={email} onChangeText={setEmail} placeholder={`youremail@${EMAIL_DOMAIN}`} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
      </Field>
      <Field label="Password">
        <Input value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoComplete="current-password" textContentType="password" onSubmitEditing={submit} />
      </Field>
      {error ? <T size={12} color={t.lost} style={{ marginBottom: 12 }}>{error}</T> : null}
      <Pressable onPress={forgot} style={{ alignSelf: 'flex-end', marginBottom: 18 }}><T size={13} color={t.accentText}>Forgot password?</T></Pressable>
      <Button title={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 6 }}>
        <T muted size={13}>New here? </T>
        <Pressable onPress={() => navigation.replace('Register')}><T w="semi" size={13} color={t.accentText}>Create an account</T></Pressable>
      </View>
    </AuthShell>
  )
}
