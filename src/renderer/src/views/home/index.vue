<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppSideNav from '@/components/nav/AppSideNav.vue'
import AppTabBar from '@/components/nav/AppTabBar.vue'
import AppTopBar from '@/components/nav/AppTopBar.vue'
import { useLayoutMode } from '@/composables/useLayoutMode'

const route = useRoute()
const { mode, isPc, isTouchLayout } = useLayoutMode()

const isVideo = computed(() => String(route.meta.module || '') === 'video')
const isDiscover = computed(() => route.name === 'discover' || route.path === '/home' || route.path === '/home/')
const isDashboard = computed(() => String(route.meta.module || '') === 'dashboard')
const isMe = computed(() => String(route.meta.module || '') === 'me')
const isUser = computed(() => String(route.meta.module || '') === 'user')
const isSearch = computed(() => String(route.meta.module || '') === 'search')
const hideTop = computed(
  () => isVideo.value || isDiscover.value || isDashboard.value || isMe.value || isUser.value || isSearch.value,
)
const darkChrome = computed(() => isVideo.value || isDiscover.value || isUser.value)
</script>

<template>
  <div
    class="app-shell"
    :class="[
      `is-${mode}`,
      {
        'is-video': isVideo,
        'is-discover': isDiscover,
        'is-dashboard': isDashboard,
        'is-user': isUser,
        'is-pc': isPc,
        'is-touch': isTouchLayout,
      },
    ]"
  >
    <AppSideNav v-if="isPc" :dark="darkChrome" />

    <div class="app-shell__body">
      <AppTopBar v-if="!hideTop" />

      <main class="app-shell__main">
        <RouterView />
      </main>

      <AppTabBar v-if="isTouchLayout" :dark="darkChrome" />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
  min-height: 100%;
  display: flex;
  background:
    radial-gradient(ellipse 70% 45% at 0% 0%, rgba(255, 45, 122, 0.1), transparent 55%),
    radial-gradient(ellipse 55% 40% at 100% 8%, rgba(123, 62, 255, 0.12), transparent 50%),
    linear-gradient(180deg, #f7f5fb 0%, #ebe8f4 48%, var(--bg) 100%);
}

.app-shell.is-video {
  background: #050508;
}

.app-shell.is-discover,
.app-shell.is-user {
  background: var(--surface-dark);
}

.app-shell.is-dashboard {
  background: #020617;
}

.app-shell__body {
  flex: 1;
  min-width: 0;
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: var(--side-w);
  overflow: hidden;
}

.app-shell__main {
  flex: 1;
  min-height: 0;
  overflow: auto;
  width: min(var(--content-max), 100%);
  margin: 0 auto;
  padding: 12px 16px calc(var(--tab-h) + var(--safe-b) + 12px);
  display: flex;
  flex-direction: column;
}

.app-shell.is-video .app-shell__main,
.app-shell.is-discover .app-shell__main,
.app-shell.is-dashboard .app-shell__main,
.app-shell.is-user .app-shell__main {
  width: 100%;
  max-width: none;
  padding: 0 0 calc(var(--tab-h) + var(--safe-b));
}

.app-shell__main > :deep(*) {
  flex: 1;
  min-height: 0;
}

/* Pad：触控壳层，内容区略宽松 */
@media (min-width: 768px) and (max-width: 1023px) {
  .app-shell__main {
    padding: 16px 24px calc(var(--tab-h) + var(--safe-b) + 16px);
  }

  .app-shell.is-video .app-shell__main,
  .app-shell.is-discover .app-shell__main,
  .app-shell.is-dashboard .app-shell__main,
  .app-shell.is-user .app-shell__main {
    padding: 0 0 calc(var(--tab-h) + var(--safe-b));
  }
}

/* PC：桌面壳层 */
@media (min-width: 1024px) {
  .app-shell__main {
    padding: 24px 32px 32px;
  }

  .app-shell.is-video .app-shell__main,
  .app-shell.is-discover .app-shell__main,
  .app-shell.is-dashboard .app-shell__main,
  .app-shell.is-user .app-shell__main {
    padding: 0;
  }

  .app-shell.is-discover .app-shell__main,
  .app-shell.is-user .app-shell__main {
    overflow: auto;
  }
}
</style>
