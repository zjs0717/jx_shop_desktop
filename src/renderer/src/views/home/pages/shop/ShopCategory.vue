<script setup lang="ts">
import { useRouter } from 'vue-router'
import { shopCategories } from '@/data/shop'

const router = useRouter()
const cats = shopCategories.filter((c) => c.id !== 'all')

const covers: Record<string, string> = {
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  digital: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  food: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
  sport: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
}

async function back(): Promise<void> {
  await router.push('/home/shop')
}
</script>

<template>
  <div class="page">
    <header class="page__head">
      <button type="button" class="back" @click="back">← 商城</button>
      <h1>商品分类</h1>
      <p>按兴趣逛起来</p>
    </header>
    <div class="grid">
      <article v-for="c in cats" :key="c.id" class="cat" @click="back">
        <img :src="covers[c.id]" :alt="c.name" loading="lazy" />
        <span>{{ c.name }}</span>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page__head {
  margin-bottom: 18px;
}

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

.page__head h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.page__head p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.cat {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.cat img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.cat:hover img {
  transform: scale(1.06);
}

.cat span {
  position: absolute;
  left: 12px;
  bottom: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .page__head h1 {
    font-size: 36px;
  }
}
</style>
