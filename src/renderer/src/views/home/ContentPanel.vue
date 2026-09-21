<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">{{ title }}</h2>
    <p v-if="description" class="panel__desc">{{ description }}</p>
    <div class="panel__body">
      <slot>
        <p class="panel__placeholder">内容区域，后续在此接入业务模块。</p>
      </slot>
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 18px;
  padding: 24px;
  min-height: 420px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.panel__title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 650;
  color: #0f172a;
}

.panel__desc {
  margin: 0 0 20px;
  font-size: 14px;
  color: #64748b;
}

.panel__placeholder {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
}
</style>
