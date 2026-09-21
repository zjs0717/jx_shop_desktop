<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page">
    <div class="tabs">
      <button type="button" @click="router.push('/home/video')">推荐</button>
      <button type="button" @click="router.push('/home/video/follow')">关注</button>
      <button type="button" class="is-active">同城</button>
    </div>
    <div class="empty">
      <p class="empty__title">同城内容准备中</p>
      <p class="empty__desc">开启定位后，这里会出现附近的人在拍什么</p>
      <button type="button" class="empty__btn" @click="router.push('/home/video')">先看推荐</button>
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
