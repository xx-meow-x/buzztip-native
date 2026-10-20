import { Sheet } from '../components/Sheet'
import { Button, ChipSelect, Field, Input } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { go } from '../navigation/ref'
import { required, useForm } from './useForm'

export default function PostForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ body: '', category: 'General' })
  async function submit() {
    if (!f.validate({ body: required('Write something before posting.') })) return
    f.setBusy(true)
    try {
      await api.createPost({ body: f.values.body.trim(), category: f.values.category })
      closeSheet(); go('Feed'); toast('Posted to the Campus Feed.')
    } catch { f.setBusy(false); toast('Couldn’t post. Try again.') }
  }
  return (
    <Sheet title="📝 New Post">
      <Field label="What's on your mind?" required error={f.errors.body}>
        <Input value={f.values.body} onChangeText={f.set('body')} multiline maxLength={500} autoFocus placeholder="Share an update, ask a question, find study buddies..." />
      </Field>
      <Field label="Topic"><ChipSelect options={['General', 'Academic', 'Tech', 'Org', 'Sports', 'Question']} value={f.values.category} onChange={f.set('category')} /></Field>
      <Button title={f.busy ? 'Posting…' : 'Post'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
