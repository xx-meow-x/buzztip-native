import { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Input, Pill, Rows, Screen, SmallButton, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { peso } from '../lib/format'
import { radii, useTheme } from '../theme'

export default function Marketplace() {
  const { state, me, loading } = useApp()
  const { openSheet } = useUI()
  const { t } = useTheme()
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const rows = state.listings.filter((l) => !term || `${l.title} ${l.condition}`.toLowerCase().includes(term))
  return (
    <Screen>
      <ScreenHeader title="Marketplace" />
      <Body>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <Input value={q} onChangeText={setQ} placeholder="Search items..." style={{ flex: 1, height: 42, minHeight: 42 }} />
          <SmallButton title="+ Sell" onPress={() => openSheet('listing')} style={{ height: 42 }} />
        </View>
        {loading && !rows.length ? <Rows loading rows={[]} /> : rows.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {rows.map((l) => (
              <Pressable key={l.id} onPress={() => openSheet('item', { id: l.id })} style={{ width: '48.2%', backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: radii.md, padding: 8, opacity: l.sold ? 0.6 : 1 }}>
                <View style={{ height: 96, borderRadius: radii.sm, backgroundColor: t.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 8 }}>
                  {l.image ? <Image source={{ uri: l.image }} style={{ width: '100%', height: '100%' }} /> : <T size={34}>📦</T>}
                  {l.sold ? <View style={{ position: 'absolute', top: 6, left: 6 }}><Pill tone="late">SOLD</Pill></View> : null}
                </View>
                <T w="semi" size={13} numberOfLines={1}>{l.title}</T>
                <T w="bold" size={14} color={t.accentText} style={{ marginVertical: 2 }}>{peso(l.price)}</T>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                  <T size={11} muted numberOfLines={1} style={{ flex: 1 }}>{l.by === me.id ? 'You' : l.byName}</T><Pill>{l.condition}</Pill>
                </View>
              </Pressable>
            ))}
          </View>
        ) : <Rows rows={[]} empty={q ? 'No listings match your search.' : 'No listings yet. Sell something with the button above.'} />}
      </Body>
      <BottomNav />
    </Screen>
  )
}
