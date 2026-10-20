import { Pressable, View } from 'react-native'
import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { go } from '../navigation/ref'
import { radii, useTheme } from '../theme'
import { required, useForm } from './useForm'

export default function AnnouncementForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const { t } = useTheme()
  const f = useForm({ title: '', category: 'Academic', body: '', urgent: false, by: me.name })
  async function submit() {
    if (!f.validate({ title: required('Add a title.'), body: required('Add the announcement details.') })) return
    f.setBusy(true)
    try {
      await api.createAnnouncement({ ...f.values, title: f.values.title.trim(), body: f.values.body.trim(), by: f.values.by.trim() || me.name })
      closeSheet(); go('Announcements'); toast('Announcement posted.')
    } catch { f.setBusy(false); toast('Only admins can post announcements.') }
  }
  return (
    <Sheet title="📢 New Announcement">
      <Field label="Title" required error={f.errors.title}><Input value={f.values.title} onChangeText={f.set('title')} placeholder="e.g. Room change for CS 301" autoFocus /></Field>
      <Field label="Category"><ChipSelect options={['Academic', 'Finance', 'Events', 'Facilities', 'Org', 'Other']} value={f.values.category} onChange={f.set('category')} /></Field>
      <Field label="Details" required error={f.errors.body}><Input value={f.values.body} onChangeText={f.set('body')} multiline placeholder="What do students need to know?" /></Field>
      <Field label="Posted by"><Input value={f.values.by} onChangeText={f.set('by')} placeholder="Office or organization" /></Field>
      <Pressable onPress={() => f.set('urgent')(!f.values.urgent)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }} accessibilityRole="checkbox" accessibilityState={{ checked: f.values.urgent }}>
        <View style={{ width: 22, height: 22, borderRadius: radii.sm, borderWidth: 2, borderColor: t.accent, backgroundColor: f.values.urgent ? t.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
          {f.values.urgent ? <T w="bold" size={13} color={t.accentInk}>✓</T> : null}
        </View>
        <T size={14}>Mark as urgent</T>
      </Pressable>
      <Button title={f.busy ? 'Posting…' : 'Post Announcement'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
