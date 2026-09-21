<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'
import { ApiError } from '@/api/request'
import { useAuthStore } from '@/stores/auth'
import type { LoginForm, LoginPayload } from '@/types/login'
import SceneCanvas from '@/components/fx/SceneCanvas.vue'
import HeroSlideshow from '@/components/fx/HeroSlideshow.vue'
import BrandMark from '@/components/brand/BrandMark.vue'

const router: Router = useRouter()
const auth = useAuthStore()

const form = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false,
})

const loading = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const errorMessage = ref<string>('')

const isFormValid = (data: LoginForm): boolean => {
  return Boolean(data.username.trim().length >= 3 && data.password.length >= 6)
}

const buildPayload = (data: LoginForm): LoginPayload => ({
  username: data.username.trim(),
  password: data.password,
})

const togglePasswordVisibility = (): void => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async (): Promise<void> => {
  if (!isFormValid(form)) {
    errorMessage.value = '用户名至少 3 位，密码至少 6 位'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await auth.register(buildPayload(form))
    await router.push('/home')
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const goLogin = async (): Promise<void> => {
  await router.push('/login')
}
</script>

<template>
  <div class="auth">
    <section class="auth__hero" aria-hidden="true">
      <HeroSlideshow />
      <SceneCanvas mode="full" />
      <div class="auth__shade" />
      <div class="auth__hero-copy">
        <BrandMark :size="64" />
        <p class="auth__brand">乐享</p>
        <p class="auth__pinyin">LEXIANG</p>
        <p class="auth__tagline">分享美好 · 传播快乐</p>
        <div class="auth__chips">
          <span>商城</span>
          <span>短视频</span>
          <span>LIVE</span>
        </div>
      </div>
    </section>

    <section class="auth__panel">
      <div class="auth__panel-inner">
        <header class="auth__head">
          <BrandMark :size="44" />
          <h1>创建账户</h1>
          <p>注册后即可分享美好、发现快乐</p>
        </header>

        <form class="auth__form" @submit.prevent="handleSubmit">
          <label class="field">
            <span class="field__label">用户名</span>
            <input
              v-model="form.username"
              class="field__input"
              type="text"
              placeholder="至少 3 个字符"
              autocomplete="username"
              required
            />
          </label>

          <label class="field">
            <span class="field__label">密码</span>
            <div class="field__password">
              <input
                v-model="form.password"
                class="field__input"
                :type="showPassword ? 'text' : 'password'"
                placeholder="至少 6 个字符"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                class="field__toggle"
                :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                @click="togglePasswordVisibility"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path d="M3 3l18 18M10.5 10.5a3 3 0 0 0 4.24 4.24" />
                  <path d="M6.7 6.7C4.6 8.2 3 10.5 2 12c2.5 4 6.5 7 10 7 1.5 0 2.9-.4 4.2-1.1M9.9 5.1A9.7 9.7 0 0 1 12 5c3.5 0 7.5 3 10 7-.8 1.3-1.9 2.5-3.1 3.5" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </label>

          <div v-if="errorMessage" class="auth__error" role="alert">
            {{ errorMessage }}
          </div>

          <button class="auth__btn" type="submit" :disabled="loading">
            <span v-if="loading" class="auth__spinner" />
            {{ loading ? '注册中…' : '注册并开始逛' }}
          </button>
        </form>

        <footer class="auth__foot">
          <span>已有账户？</span>
          <a href="#" class="auth__link" @click.prevent="goLogin">返回登录</a>
        </footer>
      </div>
    </section>
  </div>
</template>

<style scoped>
.auth {
  min-height: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  background: var(--surface-dark);
}

.auth__hero {
  position: relative;
  min-height: 100%;
  overflow: hidden;
}

.auth__shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(13, 16, 38, 0.2) 0%, rgba(13, 16, 38, 0.55) 55%, rgba(13, 16, 38, 0.92) 100%),
    linear-gradient(90deg, transparent 40%, rgba(13, 16, 38, 0.55) 100%);
}

.auth__hero-copy {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 48px;
  z-index: 2;
  color: #fff;
  animation: rise 0.7s ease both;
}

.auth__hero-copy :deep(.brand-mark) {
  margin-bottom: 14px;
}

.auth__brand {
  margin: 0;
  font-family: var(--sans);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
  text-shadow: 0 12px 40px rgba(255, 45, 122, 0.35);
  white-space: nowrap;
}

.auth__pinyin {
  margin: 10px 0 0;
  font-family: var(--display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: rgba(255, 255, 255, 0.72);
}

.auth__tagline {
  margin: 12px 0 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
}

.auth__chips {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.auth__chips span {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  font-size: 12px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}

.auth__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 28px;
  background:
    radial-gradient(ellipse 80% 50% at 100% 0%, rgba(255, 122, 0, 0.16), transparent 55%),
    radial-gradient(ellipse 50% 40% at 0% 100%, rgba(123, 62, 255, 0.14), transparent 50%),
    linear-gradient(180deg, var(--surface-dark-elevated) 0%, var(--surface-dark) 100%);
  color: #f4f2f8;
}

.auth__panel-inner {
  width: min(400px, 100%);
  animation: rise 0.55s 0.08s ease both;
}

.auth__head {
  margin-bottom: 28px;
}

.auth__head :deep(.brand-mark) {
  margin-bottom: 18px;
}

.auth__head h1 {
  margin: 0 0 8px;
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
}

.auth__head p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field__label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
}

.field__input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 15px;
  font-family: inherit;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.field__input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.field__input:focus {
  border-color: rgba(255, 45, 122, 0.65);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(255, 45, 122, 0.18);
}

.field__password {
  position: relative;
}

.field__password .field__input {
  padding-right: 48px;
}

.field__toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  border-radius: 10px;
}

.field__toggle:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.field__toggle svg {
  width: 18px;
  height: 18px;
}

.auth__link {
  color: #ff7ab0;
  text-decoration: none;
  font-weight: 600;
}

.auth__link:hover {
  color: var(--brand);
}

.auth__error {
  padding: 10px 12px;
  font-size: 13px;
  color: #fff;
  background: rgba(255, 45, 122, 0.18);
  border: 1px solid rgba(255, 45, 122, 0.35);
  border-radius: 12px;
}

.auth__btn {
  height: 48px;
  margin-top: 4px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  color: #fff;
  background: var(--brand-gradient);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 12px 28px rgba(255, 45, 122, 0.35);
  transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
}

.auth__btn:hover:not(:disabled) {
  box-shadow: 0 14px 32px rgba(255, 45, 122, 0.45);
}

.auth__btn:active:not(:disabled) {
  transform: scale(0.98);
}

.auth__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.auth__foot {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.auth__foot .auth__link {
  margin-left: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .auth {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(34vh, 280px) 1fr;
  }

  .auth__hero-copy {
    left: 20px;
    right: 20px;
    bottom: 24px;
  }

  .auth__brand {
    font-size: clamp(40px, 12vw, 56px);
  }

  .auth__panel {
    padding: 28px 20px 40px;
    border-radius: 24px 24px 0 0;
    margin-top: -20px;
    position: relative;
    z-index: 2;
  }
}
</style>
