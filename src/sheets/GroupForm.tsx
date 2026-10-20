import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, View } from 'react-native'
import { collection, endAt, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore'
import { Sheet } from '../components/Sheet'
import { Avatar, Button, ChipSelect, Field, Input, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { db } from '../lib/firebase'
import { go } from '../navigation/ref'
import { radii, useTheme } from '../theme'
import type { Person } from '../types'
import { required, useForm } from './useForm'

export default function GroupForm() {
  const { api, me } = useApp()
  const { closeSheet, toast } = useUI()
  const { t } = useTheme()
  const f = useForm({ name: '', category: 'Academic', description: '' })
  const [picked, setPicked] = useState<Person[]>([])
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<Person[]>([])
  const [searching, setSearching] = useState(false)

  // Search classmates by name (prefix match), 300ms after you stop typing.
  useEffect(() => {
    const q = term.trim().toLowerCase()
    if (q.length < 2) { setResults([]); return }
    setSearching(true)
    const id = setTimeout(async () => {
      try {
        const snap = await getDocs(query(collection(db, 'users'), orderBy('nameLower'), startAt(q), endAt(q + '\uf8ff'), limit(8)))
        setResults(snap.docs.map((d) => ({ id: d.id, name: d.data().name, color: d.data().color })).filter((u) => u.id !== me.id))
      } catch { setResults([]) }
      setSearching(false)
    }, 300)
    return () => clearTimeout(id)
  }, [term, me.id])

  const toggle = (u: Person) => setPicked((p) => (p.some((x) => x.id === u.id) ? p.filter((x) => x.id !== u.id) : [...p, u]))

  async function submit() {
    if (!f.validate({ name: required('Give your group a name.') })) return
    f.setBusy(true)
    try {
      const convId = await api.createGroup({ name: f.values.name.trim(), category: f.values.category, description: f.values.description.trim(), memberIds: picked.map((u) => u.id) })
      closeSheet(); go('Conversation', { id: convId }); toast('Group created. Say hi!')
    } catch { f.setBusy(false); toast('Couldn’t create the group. Try again.') }
  }

  return (
    <Sheet title="👥 New Group">
      <Field label="Group Name" required error={f.errors.name}><Input value={f.values.name} onChangeText={f.set('name')} placeholder="e.g. CS 305 Capstone Team" autoFocus maxLength={60} /></Field>
      <Field label="Category"><ChipSelect options={['Academic', 'Organization', 'Culture', 'Tech', 'Sports', 'Governance', 'Friends', 'Other']} value={f.values.category} onChange={f.set('category')} /></Field>
      <Field label="Description"><Input value={f.values.description} onChangeText={f.set('description')} placeholder="What's this group for?" maxLength={140} /></Field>
      <Field label="Add Members" hint={`${picked.length} selected`}>
        <Input value={term} onChangeText={setTerm} placeholder="Search classmates by name..." autoCapitalize="none" />
        {picked.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {picked.map((u) => (
              <Pressable key={u.id} onPress={() => toggle(u)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 10, paddingLeft: 4, height: 32, borderRadius: radii.md, backgroundColor: t.accent }}>
                <Avatar name={u.name} color={u.color} size={24} /><T w="semi" size={12} color={t.accentInk}>{u.name.split(' ')[0]} ×</T>
              </Pressable>
            ))}
          </View>
        )}
        {searching ? <ActivityIndicator color={t.accent} style={{ marginTop: 10 }} /> : results.map((u) => (
          <Pressable key={u.id} onPress={() => toggle(u)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <Avatar name={u.name} color={u.color} size={28} /><T size={14} style={{ flex: 1 }}>{u.name}</T>
            <T size={12} color={t.accentText}>{picked.some((x) => x.id === u.id) ? 'Added' : 'Add'}</T>
          </Pressable>
        ))}
        {!searching && term.trim().length >= 2 && results.length === 0 ? <T size={12} muted style={{ marginTop: 8 }}>No one with that name has joined yet.</T> : null}
      </Field>
      <Button title={f.busy ? 'Creating…' : 'Create Group'} onPress={submit} disabled={f.busy} />
    </Sheet>
  )
}
