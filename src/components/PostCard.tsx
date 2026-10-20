import { Pressable, View } from 'react-native'
import { Icon } from './Icon'
import { Avatar, T, card } from './ui'
import { useApp } from '../context/DataContext'
import { timeAgo } from '../lib/format'
import { radii, useTheme } from '../theme'
import type { Post } from '../types'

export function PostCard({ post }: { post: Post }) {
  const { me, api } = useApp()
  const { t } = useTheme()
  const liked = post.likedBy.includes(me.id)
  return (
    <View style={card(t)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Avatar name={post.authorName} color={post.authorColor} size={34} />
        <View>
          <T w="semi" size={13}>{post.authorId === me.id ? `${post.authorName} (you)` : post.authorName}</T>
          <T size={11} muted>{timeAgo(post.at)} · {post.category}</T>
        </View>
      </View>
      <T size={14} style={{ lineHeight: 20 }}>{post.body}</T>
      <Pressable onPress={() => api.toggleLike(post)} accessibilityLabel="Like" accessibilityState={{ selected: liked }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10, height: 30, borderRadius: radii.sm, borderWidth: 1, borderColor: liked ? t.accent : t.border }}>
        <Icon name="heart" size={16} filled={liked} color={liked ? t.accent : t.muted} />
        <T size={12} muted={!liked}>{post.likedBy.length}</T>
      </Pressable>
    </View>
  )
}
