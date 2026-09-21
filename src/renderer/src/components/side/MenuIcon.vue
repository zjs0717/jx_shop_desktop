<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name?: string
}>()

const iconName = computed(() => props.name || 'default')
</script>

<template>
  <svg class="menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <!-- 首页 / 大屏 -->
    <template v-if="iconName === 'dashboard'">
      <path d="M4 4h7v7H4V4Zm9 0h7v5h-7V4ZM4 13h7v7H4v-7Zm9 3h7v4h-7v-4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 买东西 -->
    <template v-else-if="iconName === 'shop'">
      <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>

    <!-- 商城首页 -->
    <template v-else-if="iconName === 'shop-home'">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 分类 -->
    <template v-else-if="iconName === 'category'">
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 购物车 -->
    <template v-else-if="iconName === 'cart'">
      <path d="M3 4h2l2.2 11h10.6L21 7H7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="10" cy="19" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19" r="1.4" fill="currentColor" />
    </template>

    <!-- 订单 -->
    <template v-else-if="iconName === 'orders'">
      <path d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <path d="M9 8h6M9 12h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>

    <!-- 短视频 -->
    <template v-else-if="iconName === 'video'">
      <rect x="4" y="5" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
      <path d="M16 10l4-2.5v9L16 14" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 推荐 -->
    <template v-else-if="iconName === 'feed'">
      <path d="M12 3l2.2 4.6L19 8.5l-3.5 3.4.9 5.1L12 14.8 7.6 17l.9-5.1L5 8.5l4.8-.9L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 关注 -->
    <template v-else-if="iconName === 'follow'">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    </template>

    <!-- 同城 -->
    <template v-else-if="iconName === 'nearby'">
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" stroke-width="1.8" />
    </template>

    <!-- 直播 -->
    <template v-else-if="iconName === 'live'">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
      <path d="M7.2 7.2a6.8 6.8 0 0 0 0 9.6M16.8 7.2a6.8 6.8 0 0 1 0 9.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M4.5 4.5a10.5 10.5 0 0 0 0 15M19.5 4.5a10.5 10.5 0 0 1 0 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </template>

    <!-- 直播大厅 -->
    <template v-else-if="iconName === 'live-hall'">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8" />
      <path d="M10 10l5 2-5 2v-4Z" fill="currentColor" />
    </template>

    <!-- 预告 -->
    <template v-else-if="iconName === 'preview'">
      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
      <path d="M12 8v4.5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- 回放 -->
    <template v-else-if="iconName === 'replay'">
      <path d="M7 7H4v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M5 12a7 7 0 1 0 2-4.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M10 10l5 2-5 2v-4Z" fill="currentColor" />
    </template>

    <!-- 默认 -->
    <template v-else>
      <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.8" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    </template>
  </svg>
</template>

<style scoped>
.menu-icon {
  width: 16px;
  height: 16px;
  display: block;
}
</style>
