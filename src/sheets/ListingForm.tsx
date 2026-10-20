import { Image } from 'react-native'
import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { pickImage } from '../lib/images'
import { go } from '../navigation/ref'
import { radii } from '../theme'
import { required, useForm } from './useForm'

export default function ListingForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ title: '', price: '', condition: 'Good', body: '', imageUri: '' })
  async function photo() { const uri = await pickImage(); if (uri) f.set('imageUri')(uri) }
  async function submit() {
    const ok = f.validate({
      title: required('Add an item name.'),
      price: (v) => (v === '' || isNaN(Number(v)) || Number(v) < 0 ? 'Add a price of ₱0 or more.' : null),
    })
    if (!ok) return
    f.setBusy(true)
    try {
      await api.createListing({ title: f.values.title.trim(), price: Number(f.values.price), condition: f.values.condition, body: f.values.body.trim() || 'No description added.', imageUri: f.values.imageUri })
      closeSheet(); go('Marketplace'); toast('Listing posted.')
    } catch { f.setBusy(false); toast('Couldn’t post the listing. Try again.') }
  }
  return (
    <Sheet title="🛒 New Listing">
      <Field label="Item Name" required error={f.errors.title}><Input value={f.values.title} onChangeText={f.set('title')} placeholder="e.g. Physics Lab Manual" autoFocus /></Field>
      <Field label="Price (₱)" required error={f.errors.price}><Input value={f.values.price} onChangeText={f.set('price')} keyboardType="numeric" placeholder="250" /></Field>
      <Field label="Condition"><ChipSelect options={['Brand New', 'Like New', 'Good', 'Fair']} value={f.values.condition} onChange={f.set('condition')} /></Field>
      <Field label="Description"><Input value={f.values.body} onChangeText={f.set('body')} multiline placeholder="Edition, defects, where to meet up on campus..." /></Field>
      <Field label="Photo (optional)">
        <Button small variant="secondary" title={f.values.imageUri ? 'Change photo' : 'Choose a photo'} onPress={photo} style={{ marginBottom: 0 }} />
        {f.values.imageUri ? <Image source={{ uri: f.values.imageUri }} style={{ width: '100%', height: 160, borderRadius: radii.md, marginTop: 10 }} /> : null}
      </Field>
      <Button title={f.busy ? 'Posting…' : 'Post Listing'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
