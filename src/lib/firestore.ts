import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

// Firestore returns Timestamp objects. The UI works in plain millisecond numbers.
const isTs = (v: unknown): v is { toMillis: () => number } =>
  !!v && typeof (v as { toMillis?: unknown }).toMillis === 'function'

export function normalize(v: unknown): any {
  if (isTs(v)) return v.toMillis()
  if (Array.isArray(v)) return v
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(v)) out[k] = normalize((v as Record<string, unknown>)[k])
    return out
  }
  return v
}

// 'estimate' gives a usable time for writes the server hasn't confirmed yet.
// Turns a Firestore document into { id, ...fields } with Timestamps as numbers.
export const fromSnap = <T extends { id: string }>(d: QueryDocumentSnapshot<DocumentData>): T =>
  ({ id: d.id, ...normalize(d.data({ serverTimestamps: 'estimate' })) }) as T
