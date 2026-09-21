import { useFollowStore } from '@/stores/follow'

export function isFollowing(userId: number): boolean {
  return useFollowStore().isFollowing(userId)
}

export function followUser(userId: number): void {
  useFollowStore().follow(userId)
}

export function unfollowUser(userId: number): void {
  useFollowStore().unfollow(userId)
}

export function toggleFollow(userId: number): boolean {
  return useFollowStore().toggle(userId)
}
