<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

async function goFeed(): Promise<void> {
  await router.push('/home/video')
}
</script>

<template>
  <div class="page">
    <div class="tabs">
      <button type="button" @click="goFeed">推荐</button>
      <button type="button" class="is-active">关注</button>
      <button type="button" @click="router.push('/home/video/nearby')">同城</button>
    </div>
    <div class="empty">
      <p class="empty__title">还没有关注的创作者</p>
      <p class="empty__desc">去推荐页刷一刷，把喜欢的人留下来</p>
      <button type="button" class="empty__btn" @click="goFeed">去刷推荐</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100%;
  height: 100%;
  background: #050508;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.tabs {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  display: flex;
  gap: 18px;
}

.tabs button {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
}

.tabs button.is-active {
  color: #fff;
}

.empty {
  flex: 1;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 24px;
  gap: 8px;
}

.empty__title {
  font-size: 18px;
  font-weight: 650;
}

.empty__desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.empty__btn {
  margin: 10px auto 0;
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>
