import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'

// The shape of everything stored in Firestore. Times are milliseconds (see lib/firestore.ts).
// Keep this in step with firestore.rules.

export interface Profile {
  id: string
  name: string
  nameLower: string
  label: string
  program: string
  avatar: string
  courses: string[]
  color: string
  createdAt: number
}

// The signed-in user: their profile plus the auth email. `id` is the Firebase uid.
export interface Me extends Profile {
  email: string
}

// Just enough to start a chat with someone.
export interface Person {
  id: string
  name: string
  color: string
}

export interface Group {
  id: string
  name: string
  category: string
  description: string
  color: string
  memberIds: string[]
  isCourse: boolean
  course: string
  createdBy: string
  createdAt: number
}

export interface Conversation {
  id: string
  type: 'dm' | 'group'
  isCourse: boolean
  course?: string
  groupId?: string
  title?: string
  color?: string
  memberIds: string[]
  names?: Record<string, string>
  colors?: Record<string, string>
  lastText: string
  lastFrom: string
  lastFromName: string
  lastAt: number | null
  readAt?: Record<string, number>
  createdAt: number
}

export interface Message {
  id: string
  from: string
  fromName: string
  text: string
  at: number
  system?: boolean
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  authorColor: string
  body: string
  category: string
  likedBy: string[]
  at: number
}

export interface Announcement {
  id: string
  title: string
  category: string
  body: string
  urgent: boolean
  by: string
  authorId: string
  savedBy: string[]
  at: number
}

export interface CampusEvent {
  id: string
  title: string
  at: number
  venue: string
  category: string
  host: string
  goingIds: string[]
  holiday: boolean
  authorId: string
  createdAt: number
}

export interface Reminder {
  id: string
  title: string
  at: number
  done: boolean
}

export interface Listing {
  id: string
  title: string
  price: number
  condition: string
  body: string
  image: string
  by: string
  byName: string
  byColor: string
  sold: boolean
  at: number
}

export interface LostFoundItem {
  id: string
  kind: 'lost' | 'found'
  title: string
  category: string
  where: string
  body: string
  by: string
  byName: string
  byColor: string
  resolved: boolean
  at: number
}

export interface WallPost {
  id: string
  alias: string
  body: string
  buzzedBy: string[]
  at: number
}

export interface AppState {
  groups: Group[]
  conversations: Conversation[]
  posts: Post[]
  announcements: Announcement[]
  events: CampusEvent[]
  listings: Listing[]
  lostFound: LostFoundItem[]
  wall: WallPost[]
  reminders: Reminder[]
  wallMine: string[]
}

// Bottom sheets and the props each one takes.
export interface SheetMap {
  create: Record<string, never>
  post: Record<string, never>
  group: Record<string, never>
  announcement: Record<string, never>
  event: Record<string, never>
  lostFound: { kind?: 'lost' | 'found' }
  reminder: Record<string, never>
  listing: Record<string, never>
  item: { id: string }
  profile: Record<string, never>
}
export type SheetName = keyof SheetMap

// Screens and their params. `undefined` means no params.
export type RootStackParamList = {
  Welcome: undefined
  Register: undefined
  Login: undefined
  VerifyEmail: undefined
  AccountError: undefined
  Home: undefined
  Chats: undefined
  Profile: undefined
  Conversation: { id: string }
  Groups: undefined
  Feed: undefined
  Announcements: { saved?: boolean } | undefined
  Events: undefined
  LostFound: undefined
  Reminders: undefined
  Marketplace: undefined
  FreedomWall: { focus?: boolean } | undefined
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Handy aliases for screens and hooks.
export type Nav = NativeStackNavigationProp<RootStackParamList>
export type ScreenProps<K extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, K>

// Screens that can be opened without any params.
export type NoParamScreen = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K] ? K : never
}[keyof RootStackParamList]
