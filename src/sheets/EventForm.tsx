import { View } from 'react-native'
import { DateTimeField } from '../components/DateTimeField'
import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { combine, tomorrowAt } from '../lib/format'
import { go } from '../navigation/ref'
import { required, useForm } from './useForm'

export default function EventForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ title: '', date: tomorrowAt(13), time: tomorrowAt(13), venue: '', category: 'Social', host: me.name })
  async function submit() {
    if (!f.validate({ title: required('Name your event.'), venue: required('Add where it happens.') })) return
    const { title, date, time, venue, category, host } = f.values
    f.setBusy(true)
    try {
      await api.createEvent({ title: title.trim(), at: combine(date, time), venue: venue.trim(), category, host: host.trim() || me.name })
      closeSheet(); go('Events'); toast('Event created. You’re marked as going.')
    } catch { f.setBusy(false); toast('Couldn’t create the event. Try again.') }
  }
  return (
    <Sheet title="🎪 New Event">
      <Field label="Event Name" required error={f.errors.title}><Input value={f.values.title} onChangeText={f.set('title')} placeholder="e.g. Study Jam for Midterms" autoFocus /></Field>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}><Field label="Date"><DateTimeField mode="date" value={f.values.date} onChange={f.set('date')} /></Field></View>
        <View style={{ flex: 1 }}><Field label="Time"><DateTimeField mode="time" value={f.values.time} onChange={f.set('time')} /></Field></View>
      </View>
      <Field label="Venue" required error={f.errors.venue}><Input value={f.values.venue} onChangeText={f.set('venue')} placeholder="e.g. Library, 2nd floor" /></Field>
      <Field label="Category"><ChipSelect options={['Social', 'Academic', 'Tech', 'Culture', 'Sports', 'Finance']} value={f.values.category} onChange={f.set('category')} /></Field>
      <Field label="Host"><Input value={f.values.host} onChangeText={f.set('host')} /></Field>
      <Button title={f.busy ? 'Creating…' : 'Create Event'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
