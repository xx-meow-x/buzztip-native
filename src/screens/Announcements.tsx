import { useState } from 'react'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { Body, Chips, Rows, Screen } from '../components/ui'
import { useApp } from '../context/DataContext'
import type { ScreenProps } from '../types'

export default function Announcements({ route }: ScreenProps<'Announcements'>) {
  const { state, me, loading } = useApp()
  const [cat, setCat] = useState(route.params?.saved ? 'Saved' : 'All')
  const cats = ['All', 'Urgent', 'Saved', ...new Set(state.announcements.map((a) => a.category))]
  const rows = state.announcements
    .filter((a) => cat === 'All' || (cat === 'Urgent' ? a.urgent : cat === 'Saved' ? a.savedBy.includes(me.id) : a.category === cat))
    .sort((a, b) => b.at - a.at)
  return (
    <Screen>
      <ScreenHeader title="Announcements" />
      <Body>
        <Chips options={cats} value={cat} onChange={setCat} />
        <Rows loading={loading} rows={rows}
          empty={cat === 'Saved' ? 'Nothing saved yet. Tap the bookmark on an announcement to keep it here.' : 'No announcements here yet.'}
          render={(a) => <AnnouncementCard key={a.id} a={a} />} />
      </Body>
      <BottomNav />
    </Screen>
  )
}
