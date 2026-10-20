import { Image, View } from 'react-native'
import { Sheet } from '../components/Sheet'
import { Button, Pill, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { peso, timeAgo } from '../lib/format'
import { go } from '../navigation/ref'
import { radii, useTheme } from '../theme'
import type { Listing } from '../types'

export default function ListingDetail({ id }: { id: string }) {
  const { state, me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const { t } = useTheme()
  const l = state.listings.find((x) => x.id === id)
  if (!l) return null
  const item: Listing = l
  const mine = item.by === me.id

  async function message() {
    try {
      const convId = await api.openDm({ id: item.by, name: item.byName, color: item.byColor }, `Hi! Is your ${item.title} still available?`)
      closeSheet(); go('Conversation', { id: convId })
    } catch { toast('Couldn’t open that chat. Try again.') }
  }

  return (
    <Sheet title={l.title}>
      <View style={{ height: 180, borderRadius: radii.md, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 12 }}>
        {l.image ? <Image source={{ uri: l.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <T size={56}>📦</T>}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <T w="bold" size={22} color={t.accentText}>{peso(l.price)}</T>{l.sold ? <Pill tone="late">SOLD</Pill> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Pill>{l.condition}</Pill><T size={12} muted>{mine ? 'Your listing' : `Sold by ${l.byName}`} · {timeAgo(l.at)}</T>
      </View>
      <T size={14} style={{ lineHeight: 21, marginBottom: 18 }}>{l.body}</T>
      {mine
        ? <Button variant="secondary" title={l.sold ? 'Mark as available' : 'Mark as sold'} onPress={() => api.toggleSold(l)} />
        : <Button title={l.sold ? 'This item is sold' : '💬 Message Seller'} onPress={message} disabled={l.sold} />}
    </Sheet>
  )
}
