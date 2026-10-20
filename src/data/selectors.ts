// Read-only helpers for looking things up in app state.
import { initials } from '../lib/format'
import type { AppState, Conversation, Group } from '../types'

export const dmId = (a: string, b: string) => 'dm_' + [a, b].sort().join('_')
export const groupConvId = (groupId: string) => 'c_' + groupId
export const isMember = (group: Group, uid: string) => group.memberIds.includes(uid)

export const hasUnread = (c: Conversation, uid: string): boolean => !!c.lastAt && c.lastFrom !== uid && c.lastAt > (c.readAt?.[uid] || 0)
export const sortedConversations = (state: AppState) => [...state.conversations].sort((a, b) => (b.lastAt || 0) - (a.lastAt || 0))
export const totalUnread = (state: AppState, uid: string) => state.conversations.filter((c) => hasUnread(c, uid)).length

// Title, avatar and subtitle for a chat row or header. Everything needed is stored on the conversation.
export interface ConversationMeta {
  title: string
  initials: string
  color: string
  subtitle: string
}

export function conversationMeta(conv: Conversation, meId: string): ConversationMeta {
  if (conv.type === 'dm') {
    const otherId = conv.memberIds.find((id) => id !== meId) ?? ''
    const name = conv.names?.[otherId] || 'Unknown'
    return { title: name, initials: initials(name), color: conv.colors?.[otherId] || '#888', subtitle: 'Direct message' }
  }
  const title = conv.title || 'Group'
  return {
    title,
    initials: conv.isCourse ? (conv.course || '').replace(/\s+/g, '').slice(0, 3) : initials(title),
    color: conv.color || '#888',
    subtitle: `${conv.memberIds.length} members${conv.isCourse ? ' · Course chat' : ''}`,
  }
}
