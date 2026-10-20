import { Image, View } from 'react-native'
import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { pickImage } from '../lib/images'
import { radii } from '../theme'
import { required, useForm } from './useForm'

export default function ProfileForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ name: me.name, label: me.label || 'Student', program: me.program || '', avatarUri: '', removeAvatar: false })
  const preview = f.values.avatarUri || (f.values.removeAvatar ? '' : me.avatar)
  async function photo() { const uri = await pickImage(); if (uri) f.setValues((v) => ({ ...v, avatarUri: uri, removeAvatar: false })) }
  async function submit() {
    if (!f.validate({ name: required('Your name can’t be empty.') })) return
    f.setBusy(true)
    try {
      await api.updateProfile({ ...f.values, name: f.values.name.trim() })
      closeSheet(); toast('Profile updated.')
    } catch { f.setBusy(false); toast('Couldn’t save your profile. Try again.') }
  }
  return (
    <Sheet title="✏️ Edit Profile">
      <Field label="Display Name" required error={f.errors.name}><Input value={f.values.name} onChangeText={f.set('name')} maxLength={50} /></Field>
      <Field label="Role"><ChipSelect options={['Student', 'Faculty', 'Staff', 'Alumni']} value={f.values.label} onChange={f.set('label')} /></Field>
      <Field label="Program"><Input value={f.values.program} onChangeText={f.set('program')} placeholder="e.g. BS CS" maxLength={60} /></Field>
      <Field label="Profile Picture">
        {preview ? <Image source={{ uri: preview }} style={{ width: 84, height: 84, borderRadius: radii.avatar + 4, marginBottom: 10 }} /> : null}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button small variant="secondary" title={preview ? 'Change photo' : 'Choose a photo'} onPress={photo} style={{ flex: 1, marginBottom: 0 }} />
          {preview ? <Button small variant="secondary" title="Remove" onPress={() => f.setValues((v) => ({ ...v, avatarUri: '', removeAvatar: true }))} style={{ flex: 1, marginBottom: 0 }} /> : null}
        </View>
      </Field>
      <Button title={f.busy ? 'Saving…' : 'Save Changes'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
