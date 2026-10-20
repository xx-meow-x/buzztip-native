import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { AuthShell } from './AuthShell'
import { Button, T } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { authMessage } from '../lib/auth'
import { radii, useTheme } from '../theme'
import type { ScreenProps } from '../types'

// Shown after sign-up (and on login) until the @tip.edu.ph inbox is confirmed.
// Until then the security rules block every read and write, so nothing in the app is reachable.
export default function VerifyEmail({ navigation }: ScreenProps<'VerifyEmail'>) {
  const { user, refreshVerification, resendVerification, logout } = useAuth()
  const { t } = useTheme()
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  async function check() {
    setBusy(true)
    setMsg('')
    try {
      const ok = await refreshVerification() // when true, the app moves on by itself
      if (!ok) setMsg('Not verified yet. Open the link in the email, then tap this again.')
    } catch (e) { setMsg(authMessage(e)) }
    setBusy(false)
  }

  async function resend() {
    try {
      await resendVerification()
      setMsg('Sent again. Check your inbox and spam folder.')
      setCooldown(30)
    } catch (e) { setMsg(authMessage(e)) }
  }

  return (
    <AuthShell navigation={navigation} back={false} subtitle="One more step" title="Check your email" blurb="Confirm that this TIP address is yours.">
      <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 14, marginBottom: 20 }}>
        <T size={13} muted style={{ lineHeight: 20 }}>We sent a link to</T>
        <T w="bold" size={15} style={{ marginVertical: 4 }}>{user?.email}</T>
        <T size={13} muted style={{ lineHeight: 20 }}>Open it on any device, then come back here. It can land in spam.</T>
      </View>
      {msg ? <T size={12} color={t.accentText} style={{ marginBottom: 12 }}>{msg}</T> : null}
      <Button title={busy ? 'Checking…' : 'I’ve verified my email'} onPress={check} disabled={busy} />
      <Button title={cooldown ? `Resend email (${cooldown}s)` : 'Resend email'} variant="secondary" onPress={resend} disabled={cooldown > 0} />
      <Button title="Use a different account" variant="secondary" onPress={logout} style={{ borderColor: t.border }} />
    </AuthShell>
  )
}
