import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { AuthShell } from './AuthShell'
import { Button, ChipSelect, Field, Input, T } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { authMessage, validateRegistration, type RegistrationErrors, type RegistrationForm } from '../lib/auth'
import { EMAIL_DOMAIN, MIN_PASSWORD_LENGTH } from '../config'
import { useTheme } from '../theme'
import type { ScreenProps } from '../types'

export default function Register({ navigation }: ScreenProps<'Register'>) {
  const { register } = useAuth()
  const { t } = useTheme()
  const [form, setForm] = useState<RegistrationForm>({ name: '', email: '', password: '', label: 'Student' })
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [busy, setBusy] = useState(false)
  const set = (k: keyof RegistrationForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit() {
    const errs = validateRegistration(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    try {
      await register(form) // on success the app moves to the Verify Email screen on its own
    } catch (e) {
      setErrors({ form: authMessage(e) })
      setBusy(false)
    }
  }

  return (
    <AuthShell navigation={navigation} subtitle="Create an account" title="Create an Account" blurb="Join your campus community">
      <Field label="Full Name" error={errors.name}>
        <Input value={form.name} onChangeText={set('name')} placeholder="Juan Dela Cruz" autoComplete="name" textContentType="name" />
      </Field>
      <Field label="TIP Email" error={errors.email}>
        <Input value={form.email} onChangeText={set('email')} placeholder={`youremail@${EMAIL_DOMAIN}`} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
      </Field>
      <Field label="Password" error={errors.password}>
        <Input value={form.password} onChangeText={set('password')} placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`} secureTextEntry autoComplete="new-password" textContentType="newPassword" />
      </Field>
      <Field label="I am a">
        <ChipSelect options={['Student', 'Faculty', 'Staff', 'Alumni']} value={form.label} onChange={set('label')} />
      </Field>
      {errors.form ? <T size={12} color={t.lost} style={{ marginBottom: 12 }}>{errors.form}</T> : null}
      <T size={12} muted style={{ marginBottom: 14 }}>We’ll email you a link to confirm your TIP address before you can use the app.</T>
      <Button title={busy ? 'Creating account…' : 'Register'} onPress={submit} disabled={busy} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 6 }}>
        <T muted size={13}>Already have an account? </T>
        <Pressable onPress={() => navigation.replace('Login')}><T w="semi" size={13} color={t.accentText}>Log in</T></Pressable>
      </View>
    </AuthShell>
  )
}
