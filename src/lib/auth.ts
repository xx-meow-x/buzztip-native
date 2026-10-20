import { EMAIL_DOMAIN, MIN_PASSWORD_LENGTH } from '../config'

// UX only. The real gate is firestore.rules / storage.rules (+ the optional blocking function).
export const isTipEmail = (email: string | null | undefined = ''): boolean =>
  new RegExp(`^[^\\s@]+@${EMAIL_DOMAIN.replace(/\./g, '\\.')}$`, 'i').test((email ?? '').trim())

export interface RegistrationForm {
  name: string
  email: string
  password: string
  label: string
}
export type RegistrationErrors = Partial<Record<'name' | 'email' | 'password' | 'form', string>>

export function validateRegistration({ name, email, password }: RegistrationForm): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter your TIP email.'
  else if (!isTipEmail(email)) errors.email = `Use your @${EMAIL_DOMAIN} email address.`
  if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  return errors
}

export function authMessage(err: unknown): string {
  const e = err as { code?: string; message?: string } | null
  const code = e?.code || ''
  if (code === 'auth/email-already-in-use') return 'An account with this email already exists. Log in instead.'
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found')
    return 'That email and password don’t match an account. Check them and try again.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Wait a few minutes and try again.'
  if (code === 'auth/network-request-failed') return 'No connection. Check your internet and try again.'
  if (code === 'auth/weak-password') return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  if (code === 'auth/invalid-email') return 'That email address doesn’t look right.'
  if (code === 'auth/admin-restricted-operation' || /Only @/.test(e?.message || '')) return `Only @${EMAIL_DOMAIN} emails can register.`
  return 'Something went wrong. Please try again.'
}
