import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clearToken, getToken } from '@/api/request'
import { loginApi, registerApi } from '@/api/auth'
import type { LoginPayload } from '@/types/login'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())

  const isLoggedIn = computed(() => Boolean(token.value))

  function syncToken(): void {
    token.value = getToken()
  }

  async function login(payload: LoginPayload): Promise<void> {
    await loginApi(payload)
    syncToken()
  }

  async function register(payload: LoginPayload): Promise<void> {
    await registerApi(payload)
    syncToken()
  }

  function logout(): void {
    clearToken()
    token.value = null
  }

  return { token, isLoggedIn, login, register, logout, syncToken }
})
