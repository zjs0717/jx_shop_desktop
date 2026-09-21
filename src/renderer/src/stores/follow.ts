import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const FOLLOW_KEY = 'jj_followed_user_ids'

function readIds(): number[] {
  try {
    const raw = localStorage.getItem(FOLLOW_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(Number).filter((n) => Number.isFinite(n) && n > 0)
  } catch {
    return []
  }
}

export const useFollowStore = defineStore('follow', () => {
  const ids = ref<number[]>(readIds())

  const idSet = computed(() => new Set(ids.value))

  function persist(): void {
    localStorage.setItem(FOLLOW_KEY, JSON.stringify([...new Set(ids.value)]))
  }

  function isFollowing(userId: number): boolean {
    return idSet.value.has(userId)
  }

  function follow(userId: number): void {
    if (!userId || ids.value.includes(userId)) return
    ids.value = [...ids.value, userId]
    persist()
  }

  function unfollow(userId: number): void {
    ids.value = ids.value.filter((id) => id !== userId)
    persist()
  }

  function toggle(userId: number): boolean {
    if (isFollowing(userId)) {
      unfollow(userId)
      return false
    }
    follow(userId)
    return true
  }

  return { ids, isFollowing, follow, unfollow, toggle }
})
