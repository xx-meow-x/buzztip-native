import { ICONS } from '../assets/icons'
import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input, Segmented, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { go } from '../navigation/ref'
import { useTheme } from '../theme'
import { required, useForm } from './useForm'

export default function LostFoundForm({ kind = 'lost' }: { kind?: 'lost' | 'found' }) {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const { t } = useTheme()
  const f = useForm<{ kind: 'lost' | 'found'; title: string; category: string; where: string; body: string }>({ kind, title: '', category: 'Electronics', where: '', body: '' })
  const lost = f.values.kind === 'lost'
  async function submit() {
    if (!f.validate({ title: required('Add the item’s name so people can find it.') })) return
    f.setBusy(true)
    try {
      await api.createLostFound({ kind: f.values.kind, title: f.values.title.trim(), category: f.values.category, where: f.values.where.trim() || 'Location not specified', body: f.values.body.trim() || 'No description added.' })
      closeSheet(); go('LostFound'); toast(lost ? 'Lost item posted.' : 'Found item posted.')
    } catch { f.setBusy(false); toast('Couldn’t post. Try again.') }
  }
  return (
    <Sheet title={<T w="bold" size={17} color={lost ? t.lost : t.found}>{lost ? `${ICONS.lost} Report a Lost Item` : `${ICONS.found} Report a Found Item`}</T>}>
      <Segmented value={f.values.kind} onChange={f.set('kind')} options={[{ value: 'lost', label: 'I lost something' }, { value: 'found', label: 'I found something' }]} />
      <Field label="Item Name" required error={f.errors.title}><Input value={f.values.title} onChangeText={f.set('title')} placeholder={lost ? 'e.g. Black Calculator' : 'e.g. TIP ID Card'} autoFocus /></Field>
      <Field label="Category"><ChipSelect options={['Electronics', 'ID / Card', 'Accessories', 'Personal Item', 'Books & Notes', 'Clothing', 'Other']} value={f.values.category} onChange={f.set('category')} /></Field>
      <Field label={lost ? 'Last Seen Location' : 'Where You Found It'}><Input value={f.values.where} onChangeText={f.set('where')} placeholder="e.g. Room 204, Building B" /></Field>
      <Field label="Description"><Input value={f.values.body} onChangeText={f.set('body')} multiline placeholder="Any identifying details, color, markings, etc." /></Field>
      <Button variant={lost ? 'lost' : 'found'} title={f.busy ? 'Posting…' : lost ? 'Post Lost Item' : 'Post Found Item'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
