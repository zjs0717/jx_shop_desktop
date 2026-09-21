<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/brand/BrandMark.vue'

defineProps<{
  showSearch?: boolean
  placeholder?: string
}>()

const router = useRouter()
const route = useRoute()
const keyword = ref('')

watch(
  () => route.query.q,
  (q) => {
    if (route.path.startsWith('/home/search')) {
      keyword.value = String(q || '')
    }
  },
  { immediate: true },
)

async function goCart(): Promise<void> {
  await router.push('/home/shop/cart')
}

async function goMe(): Promise<void> {
  await router.push('/home/me')
}

async function onSearch(): Promise<void> {
  const q = keyword.value.trim()
  if (!q) {
    await router.push('/home/search')
    return
  }
  await router.push({ path: '/home/search', query: { q } })
}
</script>

<template>
  <header class="topbar">
    <RouterLink to="/home" class="topbar__brand" aria-label="乐享首页">
      <BrandMark :size="32" />
      <span class="topbar__name">乐享</span>
    </RouterLink>

    <form v-if="showSearch !== false" class="topbar__search" @submit.prevent="onSearch">
      <span class="topbar__search-icon" aria-hidden="true">⌕</span>
      <input
        v-model="keyword"
        class="topbar__input"
        type="search"
        :placeholder="placeholder || '搜短视频、标签、创作者'"
        enterkeyhint="search"
      />
    </form>

    <div class="topbar__actions">
      <button type="button" class="topbar__btn" title="购物车" @click="goCart">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 4h2l2.2 11h10.6L21 7H7"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="10" cy="19" r="1.4" fill="currentColor" />
          <circle cx="17" cy="19" r="1.4" fill="currentColor" />
        </svg>
      </button>
      <button type="button" class="topbar__btn topbar__btn--text" @click="goMe">我的</button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  height: var(--top-h);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: rgba(245, 244, 249, 0.86);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
}

.topbar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.topbar__name {
  font-family: var(--sans);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--ink);
}

.topbar__search {
  flex: 1;
  min-width: 0;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(18, 24, 26, 0.04);
}

.topbar__search-icon {
  color: var(--muted);
  font-size: 16px;
  line-height: 1;
}

.topbar__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--ink);
  font-size: 13px;
}

.topbar__input::placeholder {
  color: var(--muted);
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.topbar__btn {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--ink-soft);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.topbar__btn svg {
  width: 20px;
  height: 20px;
}

.topbar__btn:hover {
  background: rgba(18, 24, 26, 0.06);
  color: var(--brand);
}

.topbar__btn--text {
  width: auto;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 560px) {
  .topbar__name {
    display: none;
  }

  .topbar__btn--text {
    display: none;
  }
}

/* Pad */
@media (min-width: 768px) and (max-width: 1023px) {
  .topbar {
    padding: 0 24px;
  }

  .topbar__search {
    max-width: 420px;
    margin: 0 auto;
  }
}

/* PC：顶栏贴近桌面站 */
@media (min-width: 1024px) {
  .topbar {
    padding: 0 32px;
    height: var(--top-h);
    background: rgba(255, 255, 255, 0.82);
    border-bottom: 1px solid var(--border);
  }

  .topbar__brand {
    display: none;
  }

  .topbar__search {
    max-width: 560px;
    height: 40px;
    border-radius: 12px;
  }

  .topbar__input {
    font-size: 14px;
  }

  .topbar__btn {
    width: 40px;
    height: 40px;
  }

  .topbar__btn--text {
    height: 40px;
    padding: 0 14px;
    font-size: 14px;
  }
}
</style>
