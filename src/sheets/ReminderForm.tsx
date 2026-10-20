import { View } from 'react-native'
import { DateTimeField } from '../components/DateTimeField'
import { Sheet } from '../components/Sheet'
import { Button, Field, Input } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { combine, tomorrowAt } from '../lib/format'
import { required, useForm } from './useForm'

export default function ReminderForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ title: '', date: tomorrowAt(8), time: tomorrowAt(8) })
  async function submit() {
    if (!f.validate({ title: required('Give your reminder a title.') })) return
    f.setBusy(true)
    try {
      await api.createReminder({ title: f.values.title.trim(), at: combine(f.values.date, f.values.time) })
      closeSheet(); toast('Reminder saved.')
    } catch { f.setBusy(false); toast('Couldn’t save the reminder. Try again.') }
  }
  return (
    <Sheet title="🔔 New Reminder">
      <Field label="Title" required error={f.errors.title}><Input value={f.values.title} onChangeText={f.set('title')} placeholder="e.g. CS399 Assignment" autoFocus /></Field>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><Field label="Date"><DateTimeField mode="date" value={f.values.date} onChange={f.set('date')} /></Field></View>
        <View style={{ flex: 1 }}><Field label="Time"><DateTimeField mode="time" value={f.values.time} onChange={f.set('time')} /></Field></View>
      </View>
      <Button title={f.busy ? 'Saving…' : 'Save Reminder'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
