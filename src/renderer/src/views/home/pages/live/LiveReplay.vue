<script setup lang="ts">
import { useRouter } from 'vue-router'
import { liveReplays, formatViewers } from '@/data/live'

const router = useRouter()

async function back(): Promise<void> {
  await router.push('/home/live')
}
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="back">← 直播大厅</button>
    <h1>精彩回放</h1>
    <p class="sub">错过直播也能把好物捡回来</p>

    <div class="grid">
      <article v-for="room in liveReplays" :key="room.id" class="item">
        <img :src="room.cover" :alt="room.title" />
        <div class="item__body">
          <span>回放 · {{ formatViewers(room.viewers) }} 次观看</span>
          <h3>{{ room.title }}</h3>
          <p>@{{ room.host }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.back {
  border: 0;
  background: transparent;
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px;
}

h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.sub {
  margin: 4px 0 16px;
  color: var(--muted);
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.item {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--border);
}

.item img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.item__body {
  padding: 12px;
}

.item__body span {
  font-size: 12px;
  color: var(--muted);
}

.item__body h3 {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 650;
}

.item__body p {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 36px;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
}
</style>
