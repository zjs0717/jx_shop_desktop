<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number | string
  }>(),
  { size: 40 },
)

const uid = useId().replace(/:/g, '')
const gradId = computed(() => `lx-grad-${uid}`)
const box = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <span class="brand-mark" :style="{ width: box, height: box }" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="gradId" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF7A00" />
          <stop offset="0.5" stop-color="#FF2D7A" />
          <stop offset="1" stop-color="#7B3EFF" />
        </linearGradient>
      </defs>

      <!-- 地方：外方 -->
      <rect :fill="`url(#${gradId})`" x="4" y="4" width="56" height="56" rx="10" />

      <!-- 天圆：内圆 -->
      <circle cx="32" cy="32" r="18.5" fill="#fff" />

      <!-- 短视频：圆内播放 -->
      <path :fill="`url(#${gradId})`" d="M27.5 23.8v16.4L42.2 32 27.5 23.8Z" />
    </svg>
  </span>
</template>

<style scoped>
.brand-mark {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  line-height: 0;
  border-radius: 12px;
}

.brand-mark svg {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: inherit;
  box-shadow: 0 8px 20px rgba(255, 45, 122, 0.22);
}
</style>
