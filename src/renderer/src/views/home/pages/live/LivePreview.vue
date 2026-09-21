<script setup lang="ts">
import { useRouter } from 'vue-router'
import { livePreviews } from '@/data/live'

const router = useRouter()

async function back(): Promise<void> {
  await router.push('/home/live')
}
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="back">← 直播大厅</button>
    <h1>直播预告</h1>
    <p class="sub">预约开播，不错过秒杀</p>

    <div class="list">
      <article v-for="room in livePreviews" :key="room.id" class="card">
        <img :src="room.cover" :alt="room.title" />
        <div>
          <span class="time">{{ room.startAt }}</span>
          <h3>{{ room.title }}</h3>
          <p>@{{ room.host }}</p>
          <button type="button">预约提醒</button>
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

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  padding: 12px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.card img {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.time {
  display: inline-block;
  margin-bottom: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand-deep);
  font-size: 12px;
  font-weight: 600;
}

.card h3 {
  font-size: 15px;
  font-weight: 650;
}

.card p {
  margin: 4px 0 10px;
  font-size: 12px;
  color: var(--muted);
}

.card button {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 560px) {
  .card {
    grid-template-columns: 1fr;
  }

  .card img {
    width: 100%;
    height: 140px;
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 36px;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
