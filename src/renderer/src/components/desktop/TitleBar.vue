<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BrandMark from '@/components/brand/BrandMark.vue'

const route = useRoute()
const maximized = ref(false)
let stopListen: (() => void) | undefined

const title = computed(() => String(route.meta.title || '乐享'))

onMounted(async () => {
  if (!window.desktop) return
  maximized.value = await window.desktop.isMaximized()
  stopListen = window.desktop.onMaximizeChange((value) => {
    maximized.value = value
  })
})

onUnmounted(() => {
  stopListen?.()
})

function minimize(): void {
  window.desktop?.minimize()
}

function toggleMax(): void {
  window.desktop?.maximize()
}

function close(): void {
  window.desktop?.close()
}
</script>

<template>
  <header class="titlebar" @dblclick="toggleMax">
    <div class="titlebar__brand">
      <BrandMark :size="18" />
      <span class="titlebar__name">乐享</span>
      <span class="titlebar__sep">/</span>
      <span class="titlebar__page">{{ title }}</span>
    </div>

    <div class="titlebar__drag" />

    <div class="titlebar__actions">
      <button type="button" class="winbtn" aria-label="最小化" @click="minimize">
        <svg viewBox="0 0 12 12"><path d="M1 6h10" /></svg>
      </button>
      <button
        type="button"
        class="winbtn"
        :aria-label="maximized ? '还原' : '最大化'"
        @click="toggleMax"
      >
        <svg v-if="maximized" viewBox="0 0 12 12">
          <path d="M3.5 4.5h6v6h-6z" />
          <path d="M4.5 2.5h6v6" />
        </svg>
        <svg v-else viewBox="0 0 12 12">
          <rect x="2.5" y="2.5" width="7" height="7" rx="0.5" />
        </svg>
      </button>
      <button type="button" class="winbtn winbtn--close" aria-label="关闭" @click="close">
        <svg viewBox="0 0 12 12">
          <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  height: var(--titlebar-h);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 12px;
  background: #0b0e22;
  color: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  user-select: none;
  z-index: 100;
}

.titlebar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  pointer-events: none;
}

.titlebar__name {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
}

.titlebar__sep {
  opacity: 0.28;
}

.titlebar__page {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titlebar__drag {
  flex: 1;
  height: 100%;
  -webkit-app-region: drag;
}

.titlebar__actions {
  display: flex;
  height: 100%;
  -webkit-app-region: no-drag;
}

.winbtn {
  width: 46px;
  height: 100%;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.winbtn svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
}

.winbtn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.winbtn--close:hover {
  background: #e81123;
  color: #fff;
}
</style>
