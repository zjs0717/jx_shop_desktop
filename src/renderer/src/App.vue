<script setup lang="ts">
import { RouterView } from 'vue-router'
import TitleBar from '@/components/desktop/TitleBar.vue'
</script>

<template>
  <div class="desktop-root">
    <TitleBar />
    <div class="desktop-body">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.desktop-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface-dark);
}

.desktop-body {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
</style>
