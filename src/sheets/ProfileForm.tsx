import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Sheet } from '../components/Sheet'
import { Avatar, Button, ChipSelect, Field, Input, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { AVATAR_PRESETS, getAvatarPreset, pickImage } from '../lib/images'
import { radii, useTheme } from '../theme'
import { required, useForm } from './useForm'

function profileSaveError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code
    : ''
  if (code === 'storage/unauthorized') return 'Firebase Storage rejected the upload. Check that the Storage rules are deployed and your email is verified.'
  if (code === 'storage/bucket-not-found' || code === 'storage/no-default-bucket') return 'Firebase Storage bucket not found. Check EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.'
  if (code === 'storage/quota-exceeded') return 'Firebase Storage quota exceeded. Check your Firebase plan and billing settings.'
  if (code === 'storage/retry-limit-exceeded' || code === 'storage/canceled') return 'Photo upload failed or timed out. Check your connection and Firebase Storage setup, then try again.'
  if (code === 'permission-denied') return 'Firestore rejected the profile update. Check that your account is verified and the Firestore rules are deployed.'
  const message = error instanceof Error ? error.message : ''
  return message ? `Couldn’t save your profile: ${message}` : 'Couldn’t save your profile. Try again.'
}

export default function ProfileForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const { t } = useTheme()
  const [saveError, setSaveError] = useState('')
  const f = useForm({ name: me.name, label: me.label || 'Student', program: me.program || '', avatarUri: '', avatarPreset: getAvatarPreset(me.avatar)?.id || '', removeAvatar: false })
  const preview = f.values.avatarUri || f.values.avatarPreset || (f.values.removeAvatar ? '' : me.avatar)
  async function photo() { const uri = await pickImage(); if (uri) f.setValues((v) => ({ ...v, avatarUri: uri, avatarPreset: '', removeAvatar: false })) }
  function choosePreset(id: string) { f.setValues((v) => ({ ...v, avatarUri: '', avatarPreset: id, removeAvatar: false })) }
  function removePhoto() { f.setValues((v) => ({ ...v, avatarUri: '', avatarPreset: '', removeAvatar: true })) }
  async function submit() {
    if (!f.validate({ name: required('Your name can’t be empty.') })) return
    setSaveError('')
    f.setBusy(true)
    try {
      await api.updateProfile({ ...f.values, name: f.values.name.trim() })
      closeSheet(); toast('Profile updated.')
    } catch (error) {
      console.error('[profile] update failed', error)
      setSaveError(profileSaveError(error))
    } finally {
      f.setBusy(false)
    }
  }
  return (
    <Sheet title="✏️ Edit Profile">
      <Field label="Display Name" required error={f.errors.name}><Input value={f.values.name} onChangeText={f.set('name')} maxLength={50} /></Field>
      <Field label="Role"><ChipSelect options={['Student', 'Faculty', 'Staff', 'Alumni']} value={f.values.label} onChange={f.set('label')} /></Field>
      <Field label="Program"><Input value={f.values.program} onChangeText={f.set('program')} placeholder="e.g. BS CS" maxLength={60} /></Field>
      <Field label="Profile Picture">
        {preview ? <View style={{ width: 84, height: 84, borderRadius: radii.avatar + 4, overflow: 'hidden', marginBottom: 10 }}><Avatar name={me.name} src={preview} size={84} /></View> : null}
        <T w="semi" size={12} muted style={{ marginBottom: 8 }}>Choose a bee or flower</T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {AVATAR_PRESETS.map((preset) => {
            const selected = f.values.avatarPreset === preset.id
            return (
              <Pressable key={preset.id} onPress={() => choosePreset(preset.id)} accessibilityRole="button" accessibilityLabel={preset.label} accessibilityState={{ selected }}
                style={{ width: '31%', alignItems: 'center', padding: 7, borderRadius: radii.md, borderWidth: 2, borderColor: selected ? t.accent : t.border, backgroundColor: selected ? t.surface2 : t.surface }}>
                <Avatar src={preset.id} size={58} />
                <T w="medium" size={11} style={{ marginTop: 5, textAlign: 'center' }}>{preset.label}</T>
              </Pressable>
            )
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button small variant="secondary" title="Upload a photo" onPress={photo} style={{ flex: 1, marginBottom: 0 }} />
          {preview ? <Button small variant="secondary" title="Remove" onPress={removePhoto} style={{ flex: 1, marginBottom: 0 }} /> : null}
        </View>
      </Field>
      {saveError ? <T size={12} color={t.lost} style={{ marginBottom: 12, lineHeight: 18 }}>{saveError}</T> : null}
      <Button title={f.busy ? 'Saving…' : 'Save Changes'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
