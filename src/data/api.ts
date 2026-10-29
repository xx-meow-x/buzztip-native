// Every change to app data. Each function is one Firestore write (or one atomic batch).
// firestore.rules decides what each signed-in user is actually allowed to do.
import {
  arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc, writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { uploadImage } from '../lib/images'
import { pickColor } from '../config'
import { dmId, groupConvId } from './selectors'
import type { Announcement, CampusEvent, Group, Listing, LostFoundItem, Me, Person, Post, Reminder, WallPost } from '../types'

const toggle = (list: string[], uid: string) => (list.includes(uid) ? arrayRemove(uid) : arrayUnion(uid))

export type Api = ReturnType<typeof createApi>

export function createApi(uid: string, me: Me) {
  const author = { authorId: uid, authorName: me.name, authorColor: me.color }
  const byMe = { by: uid, byName: me.name, byColor: me.color }

  async function sendMessage(convId: string, text: string): Promise<void> {
    const t = text.trim()
    if (!t) return
    const batch = writeBatch(db)
    batch.set(doc(collection(db, 'conversations', convId, 'messages')), { from: uid, fromName: me.name, text: t, at: serverTimestamp() })
    batch.update(doc(db, 'conversations', convId), {
      lastText: t, lastFrom: uid, lastFromName: me.name, lastAt: serverTimestamp(), [`readAt.${uid}`]: serverTimestamp(),
    })
    await batch.commit()
  }

  async function ensureDm(other: Person): Promise<string> {
    const id = dmId(uid, other.id)
    const ref = doc(db, 'conversations', id)
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, {
        type: 'dm', isCourse: false, memberIds: [uid, other.id],
        names: { [uid]: me.name, [other.id]: other.name }, colors: { [uid]: me.color, [other.id]: other.color },
        lastText: '', lastFrom: '', lastFromName: '', lastAt: null, readAt: {}, createdAt: serverTimestamp(),
      })
    }
    return id
  }

  return {
    /* ---------- Chats ---------- */
    sendMessage,
    ensureDm,
    async openDm(other: Person, firstText?: string): Promise<string> {
      const id = await ensureDm(other)
      if (firstText) await sendMessage(id, firstText)
      return id
    },
    markRead: (convId: string) => updateDoc(doc(db, 'conversations', convId), { [`readAt.${uid}`]: serverTimestamp() }),

    /* ---------- Groups ---------- */
    async toggleGroup(g: Group) {
      const op = g.memberIds.includes(uid) ? arrayRemove(uid) : arrayUnion(uid)
      const batch = writeBatch(db)
      batch.update(doc(db, 'groups', g.id), { memberIds: op })
      batch.update(doc(db, 'conversations', groupConvId(g.id)), { memberIds: op })
      await batch.commit()
    },
    async createGroup({ name, category, description, memberIds }: { name: string; category: string; description: string; memberIds: string[] }): Promise<string> {
      const gref = doc(collection(db, 'groups'))
      const convId = groupConvId(gref.id)
      const members = [...new Set([uid, ...memberIds])]
      const color = pickColor()
      const text = `${me.name} created this group.`
      const batch = writeBatch(db)
      batch.set(gref, { name, category, description, color, memberIds: members, isCourse: false, course: '', createdBy: uid, createdAt: serverTimestamp() })
      batch.set(doc(db, 'conversations', convId), {
        type: 'group', groupId: gref.id, title: name, color, isCourse: false, course: '', memberIds: members,
        lastText: text, lastFrom: '', lastFromName: '', lastAt: serverTimestamp(), readAt: { [uid]: serverTimestamp() }, createdAt: serverTimestamp(),
      })
      batch.set(doc(collection(db, 'conversations', convId, 'messages')), { from: uid, fromName: me.name, text, system: true, at: serverTimestamp() })
      await batch.commit()
      return convId
    },

    /* ---------- Feed posts ---------- */
    createPost: ({ body, category }: { body: string; category: string }) => setDoc(doc(collection(db, 'posts')), { ...author, body, category, likedBy: [], at: serverTimestamp() }),
    toggleLike: (p: Post) => updateDoc(doc(db, 'posts', p.id), { likedBy: toggle(p.likedBy, uid) }),

    /* ---------- Announcements (admins only, enforced by rules) ---------- */
    createAnnouncement: (a: { title: string; category: string; body: string; urgent: boolean; by: string }) => setDoc(doc(collection(db, 'announcements')), { ...a, authorId: uid, savedBy: [], at: serverTimestamp() }),
    toggleSaveAnnouncement: (a: Announcement) => updateDoc(doc(db, 'announcements', a.id), { savedBy: toggle(a.savedBy, uid) }),

    /* ---------- Events ---------- */
    createEvent: ({ at, ...e }: { title: string; at: number; venue: string; category: string; host: string }) =>
      setDoc(doc(collection(db, 'events')), { ...e, at: Timestamp.fromMillis(at), holiday: false, authorId: uid, goingIds: [uid], createdAt: serverTimestamp() }),
    toggleGoing: (e: CampusEvent) => updateDoc(doc(db, 'events', e.id), { goingIds: toggle(e.goingIds, uid) }),

    /* ---------- Lost & Found ---------- */
    createLostFound: (item: { kind: 'lost' | 'found'; title: string; category: string; where: string; body: string }) => setDoc(doc(collection(db, 'lostFound')), { ...item, ...byMe, resolved: false, at: serverTimestamp() }),
    resolveLostFound: (x: LostFoundItem) => updateDoc(doc(db, 'lostFound', x.id), { resolved: !x.resolved }),

    /* ---------- Reminders (private to you) ---------- */
    createReminder: ({ title, at }: { title: string; at: number }) => setDoc(doc(collection(db, 'users', uid, 'reminders')), { title, at: Timestamp.fromMillis(at), done: false }),
    toggleReminder: (r: Reminder) => updateDoc(doc(db, 'users', uid, 'reminders', r.id), { done: !r.done }),
    deleteReminder: (id: string) => deleteDoc(doc(db, 'users', uid, 'reminders', id)),

    /* ---------- Marketplace ---------- */
    async createListing({ imageUri, ...l }: { title: string; price: number; condition: string; body: string; imageUri?: string }) {
      const image = imageUri ? await uploadImage('listings', uid, imageUri) : ''
      await setDoc(doc(collection(db, 'listings')), { ...l, image, ...byMe, sold: false, at: serverTimestamp() })
    },
    toggleSold: (l: Listing) => updateDoc(doc(db, 'listings', l.id), { sold: !l.sold }),

    /* ---------- Freedom Wall ---------- */
    // The wall post has no author field, so nobody reading the database can tell who wrote it.
    // Only you can see which ones are yours (users/<you>/wallMine).
    async createWallPost(body: string) {
      const ref = doc(collection(db, 'wall'))
      const batch = writeBatch(db)
      batch.set(ref, { alias: 'Anonymous Bee', body, buzzedBy: [], at: serverTimestamp() })
      batch.set(doc(db, 'users', uid, 'wallMine', ref.id), { at: serverTimestamp() })
      await batch.commit()
    },
    toggleBuzz: (w: WallPost) => updateDoc(doc(db, 'wall', w.id), { buzzedBy: toggle(w.buzzedBy, uid) }),

    /* ---------- Profile ---------- */
    async updateProfile({ name, label, program, avatarUri, avatarPreset, removeAvatar }: { name: string; label: string; program: string; avatarUri?: string; avatarPreset?: string; removeAvatar?: boolean }) {
      const patch: Record<string, string> = { name, nameLower: name.toLowerCase(), label, program }
      if (avatarUri) patch.avatar = await uploadImage('avatars', uid, avatarUri)
      else if (avatarPreset) patch.avatar = avatarPreset
      else if (removeAvatar) patch.avatar = ''
      await updateDoc(doc(db, 'users', uid), patch)
    },
  }
}
