import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { collection, limit, onSnapshot, orderBy, query, where, type DocumentData, type Query, type QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { fromSnap } from '../lib/firestore'
import { LIST_LIMIT } from '../config'
import { createApi, type Api } from '../data/api'
import type { AppState, Me, Message } from '../types'
import { useAuth } from './AuthContext'

// Live data for the signed-in user. Nothing is seeded: every list starts empty and fills from Firestore.
// For a big campus, move each subscription into the screen that needs it and page the results.
const EMPTY: AppState = { groups: [], conversations: [], posts: [], announcements: [], events: [], listings: [], lostFound: [], wall: [], reminders: [], wallMine: [] }
interface DataValue {
  state: AppState
  loading: boolean
  me: Me
  api: Api
  isAdmin: boolean
}
const Ctx = createContext<DataValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { status, user, profile, isAdmin } = useAuth()
  const uid = status === 'ready' && user ? user.uid : null
  const [data, setData] = useState<AppState>(EMPTY)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!uid) { setData(EMPTY); setLoaded({}); return }
    const unsubs: (() => void)[] = []
    const listen = (key: keyof AppState, q: Query<DocumentData>, map: (s: QueryDocumentSnapshot<DocumentData>) => unknown = (s) => fromSnap(s)) =>
      unsubs.push(
        onSnapshot(
          q,
          (snap) => {
            setData((d) => ({ ...d, [key]: snap.docs.map((s) => map(s)) }))
            setLoaded((l) => ({ ...l, [key]: true }))
          },
          (err) => {
            console.warn(`[data] ${key}:`, err.code)
            setLoaded((l) => ({ ...l, [key]: true }))
          }
        )
      )
    const col = (path: string) => collection(db, path)
    listen('groups', query(col('groups'), orderBy('createdAt', 'desc'), limit(200)))
    listen('conversations', query(col('conversations'), where('memberIds', 'array-contains', uid)))
    listen('posts', query(col('posts'), orderBy('at', 'desc'), limit(LIST_LIMIT)))
    listen('announcements', query(col('announcements'), orderBy('at', 'desc'), limit(LIST_LIMIT)))
    listen('events', query(col('events'), orderBy('at', 'desc'), limit(200)))
    listen('listings', query(col('listings'), orderBy('at', 'desc'), limit(LIST_LIMIT)))
    listen('lostFound', query(col('lostFound'), orderBy('at', 'desc'), limit(LIST_LIMIT)))
    listen('wall', query(col('wall'), orderBy('at', 'desc'), limit(LIST_LIMIT)))
    listen('reminders', query(col(`users/${uid}/reminders`), orderBy('at', 'asc')))
    listen('wallMine', col(`users/${uid}/wallMine`), (s) => s.id)
    return () => unsubs.forEach((u) => u())
  }, [uid])

  const me = useMemo<Me | null>(() => (uid && profile ? { ...profile, id: uid, email: user?.email ?? '' } : null), [uid, profile, user])
  const api = useMemo(() => (uid && me ? createApi(uid, me) : null), [uid, me])
  const loading = !Object.keys(EMPTY).every((k) => loaded[k])
  // Screens only render once status is 'ready', when me and api always exist. Before that they are never read.
  const value = useMemo(() => ({ state: data, loading, me, api, isAdmin }) as DataValue, [data, loading, me, api, isAdmin])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): DataValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside <DataProvider>')
  return v
}

// Messages for one open chat.
export function useMessages(convId: string): Message[] | null {
  const [messages, setMessages] = useState<Message[] | null>(null) // null = still loading
  useEffect(() => {
    setMessages(null)
    const q = query(collection(db, 'conversations', convId, 'messages'), orderBy('at', 'asc'), limit(300))
    return onSnapshot(q, (snap) => setMessages(snap.docs.map((s) => fromSnap<Message>(s))), (e) => { console.warn('[messages]', e.code); setMessages([]) })
  }, [convId])
  return messages
}
