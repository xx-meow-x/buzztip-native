import { Pressable, View } from 'react-native'
import { ICONS } from '../assets/icons'
import { Sheet } from '../components/Sheet'
import { Button, T } from '../components/ui'
import { useApp } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { go } from '../navigation/ref'
import { radii, useTheme } from '../theme'
import type { SheetName } from '../types'

type Option = [SheetName | 'wall', string, string, string, 'admin'?]
const OPTIONS: Option[] = [
  ['post', ICONS.post, 'New Post', 'Share something with the campus'],
  ['group', ICONS.groupChat, 'Group Chat', 'Start a group and invite classmates'],
  ['event', ICONS.events, 'Campus Event', 'Organize a campus event'],
  ['announcement', ICONS.announcements, 'Announcement', 'Post an official announcement', 'admin'],
  ['lostFound', ICONS.lostFound, 'Lost & Found', 'Report a lost or found item'],
  ['wall', ICONS.freedomWall, 'Freedom Wall', 'Post anonymously'],
  ['listing', ICONS.marketplace, 'Marketplace Listing', 'Sell or trade something'],
]

export default function CreateMenu() {
  const { openSheet, closeSheet } = useUI()
  const { isAdmin } = useApp()
  const { t } = useTheme()
  function pick(type: SheetName | 'wall') {
    if (type === 'wall') { closeSheet(); go('FreedomWall', { focus: true }) }
    else if (type === 'lostFound') openSheet('lostFound', { kind: 'lost' })
    else if (type === 'item') return
    else openSheet(type)
  }
  return (
    <Sheet title="What would you like to create?">
      {OPTIONS.filter((o) => o[4] !== 'admin' || isAdmin).map(([type, icon, title, sub]) => (
        <Pressable key={type} onPress={() => pick(type)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: radii.md, borderWidth: 1, borderColor: t.border, backgroundColor: t.bg, marginBottom: 8 }}>
          <T size={22}>{icon}</T>
          <View style={{ flex: 1 }}><T w="semi" size={14}>{title}</T><T size={12} muted>{sub}</T></View>
          <T size={18} muted>›</T>
        </Pressable>
      ))}
      <Button title="Cancel" variant="secondary" onPress={closeSheet} style={{ marginTop: 6, borderColor: t.border }} />
    </Sheet>
  )
}
