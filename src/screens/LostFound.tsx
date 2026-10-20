import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ICONS } from '../assets/icons'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Input, Pill, Rows, Screen, Segmented, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { initials, shortDate } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { LostFoundItem, ScreenProps } from '../types'

export default function LostFound({ navigation }: ScreenProps<'LostFound'>) {
  const { state, me, api, loading } = useApp()
  const { openSheet, toast } = useUI()
  const { t } = useTheme()
  const ins = useSafeAreaInsets()
  const [tab, setTab] = useState<'all' | 'lost' | 'found'>('all')
  const [q, setQ] = useState('')

  const all = state.lostFound
  const nLost = all.filter((x) => x.kind === 'lost').length
  const term = q.trim().toLowerCase()
  const rows = all.filter((x) => (tab === 'all' || x.kind === tab) && (!term || `${x.title} ${x.where} ${x.body} ${x.category}`.toLowerCase().includes(term)))

  async function message(x: LostFoundItem, text?: string) {
    try {
      const id = await api.openDm({ id: x.by, name: x.byName, color: x.byColor }, text)
      if (text) toast(`Message sent to ${x.byName}.`)
      navigation.navigate('Conversation', { id })
    } catch { toast('Couldn’t open that chat. Try again.') }
  }
  const claim = (x: LostFoundItem) => message(x, x.kind === 'lost'
    ? `Hi! I think I found your ${x.title}. Where can we meet?`
    : `Hi! I think the ${x.title} you found is mine. Can I pick it up?`)

  const Stat = ({ n, label, color }: { n: number; label: string; color: string }) => (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, paddingVertical: 10 }}>
      <T w="bold" size={20} color={color}>{n}</T><T size={11} muted>{label}</T>
    </View>
  )
  const Act = ({ title, onPress, color }: { title: string; onPress: () => void; color?: string }) => (
    <Pressable onPress={onPress} style={{ flex: 1, height: 36, borderRadius: radii.sm, borderWidth: 1.5, borderColor: color || t.border, backgroundColor: color || 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      <T w="semi" size={13} color={color ? t.semInk : t.text}>{title}</T>
    </Pressable>
  )

  return (
    <Screen>
      <ScreenHeader title="Lost & Found" />
      <Body bottom={90 + ins.bottom}>
        <Input value={q} onChangeText={setQ} placeholder="Search items or location..." style={{ height: 42, minHeight: 42, marginBottom: 12 }} />
        <Segmented value={tab} onChange={setTab} options={[{ value: 'all', label: 'All' }, { value: 'lost', label: `${ICONS.lost} Lost` }, { value: 'found', label: `${ICONS.found} Found` }]} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          <Stat n={all.length} label="Total Posts" color={t.accentText} />
          <Stat n={nLost} label="Lost" color={t.lost} />
          <Stat n={all.length - nLost} label="Found" color={t.found} />
        </View>
        <Rows loading={loading} rows={rows} empty={all.length ? 'No items match your search.' : 'No lost or found items yet.'} render={(x) => {
          const mine = x.by === me.id
          const tone = x.kind === 'lost' ? t.lost : t.found
          return (
            <View key={x.id} style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderLeftWidth: 3, borderLeftColor: tone, borderRadius: radii.md, padding: 12, marginBottom: 8, opacity: x.resolved ? 0.6 : 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', gap: 6 }}><Pill tone={x.kind}>{x.kind.toUpperCase()}</Pill><Pill>{x.category}</Pill></View>
                <T size={11} muted>{shortDate(x.at)}</T>
              </View>
              <T w="bold" size={14} style={{ marginBottom: 4 }}>{x.title}</T>
              <T size={12} muted style={{ lineHeight: 18 }}>{x.body}</T>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}><Icon name="pin" size={14} color={t.muted} /><T size={12} muted numberOfLines={1}>{x.where}</T></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: x.byColor || '#888', alignItems: 'center', justifyContent: 'center' }}><T w="bold" size={9} color="#fff">{initials(x.byName)}</T></View>
                  <T size={12} muted>{mine ? 'You' : x.byName}</T>
                </View>
              </View>
              {mine ? <Act title={x.resolved ? 'Reopen post' : '✓ Mark as resolved'} onPress={() => api.resolveLostFound(x)} color={x.resolved ? undefined : t.found} />
                : x.resolved ? <T w="semi" size={13} color={t.found} style={{ textAlign: 'center' }}>✓ Resolved</T>
                : (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Act title={`${ICONS.chats} Message`} onPress={() => message(x)} />
                    <Act title={x.kind === 'lost' ? 'I found this!' : 'This is mine!'} onPress={() => claim(x)} color={x.kind === 'lost' ? t.found : t.accent} />
                  </View>
                )}
            </View>
          )
        }} />
      </Body>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, padding: 14, paddingBottom: 14 + ins.bottom, backgroundColor: t.bg, borderTopWidth: 1, borderTopColor: t.border }}>
        <Pressable onPress={() => openSheet('lostFound', { kind: 'lost' })} style={{ flex: 1, height: 46, borderRadius: radii.md, backgroundColor: t.lost, alignItems: 'center', justifyContent: 'center' }}><T w="semi" size={14} color={t.semInk}>{ICONS.lost} Report Lost</T></Pressable>
        <Pressable onPress={() => openSheet('lostFound', { kind: 'found' })} style={{ flex: 1, height: 46, borderRadius: radii.md, backgroundColor: t.found, alignItems: 'center', justifyContent: 'center' }}><T w="semi" size={14} color={t.semInk}>{ICONS.found} Report Found</T></Pressable>
      </View>
    </Screen>
  )
}
