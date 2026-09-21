<script setup lang="ts">
import { useRouter } from 'vue-router'
import { shopProducts, formatSales } from '@/data/shop'
import { liveRooms, formatViewers } from '@/data/live'
import SceneCanvas from '@/components/fx/SceneCanvas.vue'
import HeroSlideshow from '@/components/fx/HeroSlideshow.vue'
import BrandMark from '@/components/brand/BrandMark.vue'

const router = useRouter()
const hotProducts = shopProducts.slice(0, 4)
const liveNow = liveRooms.slice(0, 3)

async function go(path: string): Promise<void> {
  await router.push(path)
}
</script>

<template>
  <div class="discover">
    <section class="hero">
      <div class="hero__media" aria-hidden="true">
        <HeroSlideshow />
        <SceneCanvas mode="full" />
        <div class="hero__shade" />
      </div>

      <div class="hero__content">
        <BrandMark :size="56" />
        <p class="hero__brand">乐享</p>
        <p class="hero__pinyin">LEXIANG</p>
        <h1 class="hero__title">分享美好，传播快乐</h1>
        <p class="hero__sub">商城下单 · 竖屏刷剧 · 边看边买</p>
        <div class="hero__cta">
          <button type="button" class="btn btn--primary" @click="go('/home/shop')">去逛商城</button>
          <button type="button" class="btn btn--ghost" @click="go('/home/video')">刷短视频</button>
          <button type="button" class="btn btn--ghost" @click="go('/home/live')">看直播</button>
        </div>
        <div class="hero__chips" aria-hidden="true">
          <span>商城动效</span>
          <span>短视频浪</span>
          <span>LIVE 波</span>
        </div>
      </div>
    </section>

    <section class="section entries">
      <h2 class="section__title">现在出发</h2>
      <p class="section__desc">选一个你想沉浸的入口</p>
      <div class="entries__row">
        <button type="button" class="entry" @click="go('/home/shop')">
          <span class="entry__emoji" aria-hidden="true">袋</span>
          <strong>商城</strong>
          <span>精选好物</span>
        </button>
        <button type="button" class="entry" @click="go('/home/video')">
          <span class="entry__emoji" aria-hidden="true">播</span>
          <strong>短视频</strong>
          <span>上下滑刷</span>
        </button>
        <button type="button" class="entry" @click="go('/home/live')">
          <span class="entry__emoji entry__emoji--live" aria-hidden="true">LIVE</span>
          <strong>直播</strong>
          <span>边看边买</span>
        </button>
        <button type="button" class="entry" @click="go('/home/dashboard')">
          <span class="entry__emoji" aria-hidden="true">屏</span>
          <strong>数据屏</strong>
          <span>运营看板</span>
        </button>
      </div>
    </section>

    <section class="section">
      <div class="section__head">
        <div>
          <h2 class="section__title">正在热卖</h2>
          <p class="section__desc">为你挑好的今日好物</p>
        </div>
        <button type="button" class="section__more" @click="go('/home/shop')">全部</button>
      </div>
      <div class="product-rail">
        <article v-for="p in hotProducts" :key="p.id" class="product" @click="go('/home/shop')">
          <img class="product__cover" :src="p.cover" :alt="p.title" loading="lazy" />
          <div class="product__body">
            <h3 class="product__title">{{ p.title }}</h3>
            <div class="product__meta">
              <span class="product__price"><small>¥</small>{{ p.price }}</span>
              <span class="product__sales">已售 {{ formatSales(p.sales) }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section section--last">
      <div class="section__head">
        <div>
          <h2 class="section__title">直播进行中</h2>
          <p class="section__desc">主播正在讲解同款</p>
        </div>
        <button type="button" class="section__more" @click="go('/home/live')">进入大厅</button>
      </div>
      <div class="live-rail">
        <article v-for="room in liveNow" :key="room.id" class="live" @click="go('/home/live')">
          <img class="live__cover" :src="room.cover" :alt="room.title" loading="lazy" />
          <div class="live__overlay">
            <span class="live__badge">直播中</span>
            <span class="live__viewers">{{ formatViewers(room.viewers) }} 人看</span>
          </div>
          <div class="live__info">
            <h3>{{ room.title }}</h3>
            <p>@{{ room.host }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.discover {
  color: #f4f2f8;
  animation: rise 0.55s ease both;
}

.hero {
  position: relative;
  min-height: min(92vh, 760px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero__media {
  position: absolute;
  inset: 0;
}

.hero__shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(13, 16, 38, 0.28) 0%, rgba(13, 16, 38, 0.15) 35%, rgba(13, 16, 38, 0.88) 78%, var(--surface-dark) 100%),
    linear-gradient(90deg, rgba(13, 16, 38, 0.55), transparent 55%);
}

.hero__content {
  position: relative;
  z-index: 2;
  width: min(720px, 100%);
  padding: 48px 20px 36px;
}

.hero__content :deep(.brand-mark) {
  margin-bottom: 12px;
}

.hero__brand {
  margin: 0 0 6px;
  font-family: var(--sans);
  font-size: clamp(36px, 7vw, 58px);
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
  color: #fff;
  text-shadow: 0 10px 40px rgba(255, 45, 122, 0.35);
  animation: brand-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  white-space: nowrap;
}

.hero__pinyin {
  margin: 0 0 14px;
  font-family: var(--display);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: rgba(255, 255, 255, 0.7);
  animation: rise 0.7s 0.05s ease both;
}

.hero__title {
  margin: 0 0 10px;
  font-size: clamp(20px, 3.6vw, 32px);
  font-weight: 650;
  line-height: 1.3;
  color: #fff;
  max-width: min(18em, 100%);
  animation: rise 0.7s 0.08s ease both;
}

.hero__sub {
  margin: 0 0 22px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  animation: rise 0.7s 0.14s ease both;
  white-space: nowrap;
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  animation: rise 0.7s 0.2s ease both;
}

.hero__chips {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  animation: rise 0.7s 0.28s ease both;
}

.hero__chips span {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
}

.btn {
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  border: 0;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.btn:active {
  transform: scale(0.97);
}

.btn--primary {
  color: #fff;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
}

.btn--ghost {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(8px);
}

.section {
  padding: 28px 20px 8px;
  background: var(--surface-dark);
}

.section--last {
  padding-bottom: 28px;
}

.section__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section__title {
  font-size: 20px;
  color: #fff;
  margin-bottom: 4px;
}

.section__desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.section__more {
  border: 0;
  background: transparent;
  color: var(--brand);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.entries__row {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.entry {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border-radius: 16px;
  padding: 14px 10px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.entry:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 45, 122, 0.45);
  background: linear-gradient(180deg, rgba(255, 45, 122, 0.18), rgba(255, 255, 255, 0.04));
}

.entry__emoji {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--display);
  background: rgba(255, 255, 255, 0.1);
}

.entry__emoji--live {
  font-size: 10px;
  letter-spacing: 0.04em;
  background: rgba(255, 77, 106, 0.9);
}

.entry strong {
  font-size: 14px;
}

.entry span:last-child {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.product-rail,
.live-rail {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.product {
  cursor: pointer;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.18s ease;
}

.product:hover {
  transform: translateY(-3px);
}

.product__cover {
  aspect-ratio: 1;
  width: 100%;
  object-fit: cover;
}

.product__body {
  padding: 10px 12px 12px;
}

.product__title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.product__meta {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.product__price {
  color: var(--accent-warm);
  font-size: 18px;
  font-weight: 700;
  font-family: var(--display);
}

.product__price small {
  font-size: 12px;
  margin-right: 1px;
}

.product__sales {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.live {
  position: relative;
  cursor: pointer;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  transition: transform 0.18s ease;
}

.live:hover {
  transform: translateY(-3px);
}

.live__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live__overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.live__badge {
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--live);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.live__viewers {
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 11px;
}

.live__info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 12px 12px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.75), transparent);
}

.live__info h3 {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.live__info p {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes brand-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .product-rail,
  .live-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .entries__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero {
    min-height: 88vh;
  }

  .hero__content {
    padding: 36px 16px 28px;
  }

  .hero__brand {
    white-space: nowrap;
    font-size: clamp(36px, 14vw, 48px);
  }

  .hero__sub {
    white-space: normal;
  }
}

/* Pad */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero {
    min-height: min(78vh, 680px);
  }

  .hero__content {
    width: min(640px, 100%);
    padding: 56px 32px 40px;
  }

  .section {
    padding: 32px 32px 12px;
  }

  .section--last {
    padding-bottom: 36px;
  }

  .product-rail {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .live-rail {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* PC 桌面首页 */
@media (min-width: 1024px) {
  .hero {
    min-height: min(72vh, 640px);
    align-items: center;
  }

  .hero__content {
    width: min(720px, 100%);
    padding: 64px 48px 64px;
    margin-left: 0;
  }

  .hero__brand {
    font-size: clamp(56px, 6vw, 88px);
  }

  .hero__title {
    font-size: clamp(28px, 2.4vw, 38px);
    max-width: 14em;
  }

  .hero__sub {
    font-size: 16px;
  }

  .btn {
    height: 48px;
    padding: 0 24px;
    font-size: 15px;
  }

  .section {
    padding: 40px clamp(32px, 4vw, 64px) 16px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .section--last {
    padding-bottom: 56px;
  }

  .section__title {
    font-size: 24px;
  }

  .entries__row {
    gap: 16px;
  }

  .entry {
    padding: 20px 16px;
    border-radius: 18px;
  }

  .entry strong {
    font-size: 16px;
  }

  .product-rail {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .live-rail {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }
}
</style>
