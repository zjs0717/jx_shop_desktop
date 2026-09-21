import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchProfileApi, updateProfileApi } from '@/api/user'
import type { ProfileUpdatePayload, UserProfile } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref('')

  const displayName = computed(
    () => profile.value?.nickname || profile.value?.username || '乐享用户',
  )

  async function fetchProfile(): Promise<UserProfile | null> {
    loading.value = true
    error.value = ''
    try {
      profile.value = await fetchProfileApi()
      return profile.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
      profile.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: ProfileUpdatePayload): Promise<UserProfile> {
    profile.value = await updateProfileApi(payload)
    return profile.value
  }

  function reset(): void {
    profile.value = null
    error.value = ''
    loading.value = false
  }

  return { profile, loading, error, displayName, fetchProfile, updateProfile, reset }
})
