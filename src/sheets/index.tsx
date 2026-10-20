// All bottom sheets, opened from anywhere with openSheet('<name>', props).
import { type ComponentType } from 'react'
import { useUI } from '../context/UIContext'
import type { SheetName } from '../types'
import AnnouncementForm from './AnnouncementForm'
import CreateMenu from './CreateMenu'
import EventForm from './EventForm'
import GroupForm from './GroupForm'
import ListingDetail from './ListingDetail'
import ListingForm from './ListingForm'
import LostFoundForm from './LostFoundForm'
import PostForm from './PostForm'
import ProfileForm from './ProfileForm'
import ReminderForm from './ReminderForm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SHEETS: Record<SheetName, ComponentType<any>> = {
  create: CreateMenu, post: PostForm, group: GroupForm, announcement: AnnouncementForm, event: EventForm,
  lostFound: LostFoundForm, reminder: ReminderForm, listing: ListingForm, item: ListingDetail, profile: ProfileForm,
}

export function SheetHost() {
  const { sheet } = useUI()
  if (!sheet) return null
  const C = SHEETS[sheet.type]
  return C ? <C key={sheet.type + JSON.stringify(sheet.props)} {...sheet.props} /> : null
}
