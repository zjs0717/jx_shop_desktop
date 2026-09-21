<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { shopCategories, shopProducts, formatSales, type ShopProduct } from '@/data/shop'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()
const active = ref('all')
const toast = ref('')

const list = computed(() =>
  active.value === 'all'
    ? shopProducts
    : shopProducts.filter((p) => p.category === active.value),
)

async function goCart(): Promise<void> {
  await router.push('/home/shop/cart')
}

async function goOrders(): Promise<void> {
  await router.push('/home/shop/orders')
}

async function goCategory(): Promise<void> {
  await router.push('/home/shop/category')
}

function addToCart(product: ShopProduct): void {
  cart.add(product)
  toast.value = `已加入购物车 · ${product.title}`
  window.setTimeout(() => {
    if (toast.value.startsWith('已加入')) toast.value = ''
  }, 1600)
}
</script>

<template>
  <div class="shop">
    <header class="shop__head">
      <div>
        <h1 class="shop__title">发现好物</h1>
        <p class="shop__sub">精选上新 · 直播同款 · 限时特惠</p>
      </div>
      <div class="shop__tools">
        <button type="button" class="chip" @click="goCategory">分类</button>
        <button type="button" class="chip" @click="goOrders">订单</button>
        <button type="button" class="chip chip--brand" @click="goCart">
          购物车{{ cart.size ? ` ${cart.size}` : '' }}
        </button>
      </div>
    </header>

    <div class="cats" role="tablist" aria-label="商品分类">
      <button
        v-for="c in shopCategories"
        :key="c.id"
        type="button"
        class="cats__item"
        :class="{ 'is-active': active === c.id }"
        role="tab"
        :aria-selected="active === c.id"
        @click="active = c.id"
      >
        {{ c.name }}
      </button>
    </div>

    <div class="grid">
      <article v-for="p in list" :key="p.id" class="item">
        <div class="item__media">
          <img :src="p.cover" :alt="p.title" loading="lazy" />
          <span v-if="p.tag" class="item__tag">{{ p.tag }}</span>
        </div>
        <div class="item__body">
          <h3 class="item__title">{{ p.title }}</h3>
          <div class="item__row">
            <span class="item__price"><small>¥</small>{{ p.price }}</span>
            <span v-if="p.originPrice" class="item__origin">¥{{ p.originPrice }}</span>
          </div>
          <p class="item__sales">已售 {{ formatSales(p.sales) }}</p>
          <button type="button" class="item__cart" @click="addToCart(p)">加入购物车</button>
        </div>
      </article>
    </div>
    <p v-if="toast" class="toast">{{ toast }}</p>
  </div>
</template>

<style scoped>
.shop {
  animation: fade 0.35s ease both;
}

.shop__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 16px;
}

.shop__title {
  font-family: var(--display);
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1.1;
}

.shop__sub {
  margin-top: 6px;
  font-size: 13px;
  color: var(--muted);
}

.shop__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.chip--brand {
  border-color: transparent;
  color: #fff;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
}

.cats {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 16px;
  scrollbar-width: none;
}

.cats::-webkit-scrollbar {
  display: none;
}

.cats__item {
  flex: 0 0 auto;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  border: 0;
  background: rgba(18, 24, 26, 0.05);
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cats__item.is-active {
  background: var(--ink);
  color: #fff;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.item {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 6px 18px rgba(18, 24, 26, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.item__media {
  position: relative;
  aspect-ratio: 1;
  background: #ece8ef;
}

.item__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item__tag {
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(18, 24, 26, 0.72);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.item__body {
  padding: 12px;
}

.item__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.item__row {
  margin-top: 8px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.item__price {
  color: var(--brand);
  font-family: var(--display);
  font-size: 20px;
  font-weight: 800;
}

.item__price small {
  font-size: 12px;
}

.item__origin {
  font-size: 12px;
  color: var(--muted);
  text-decoration: line-through;
}

.item__sales {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.item__cart {
  margin-top: 10px;
  width: 100%;
  height: 32px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  background: var(--brand-gradient);
  cursor: pointer;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  z-index: 80;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(13, 16, 38, 0.88);
  color: #fff;
  font-size: 13px;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .shop__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

/* Pad：三列商品 + 更宽间距 */
@media (min-width: 768px) and (max-width: 1023px) {
  .shop__title {
    font-size: 32px;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

/* PC：五列货架感 */
@media (min-width: 1024px) {
  .shop__head {
    margin-bottom: 22px;
  }

  .shop__title {
    font-size: 40px;
  }

  .shop__sub {
    font-size: 14px;
  }

  .cats {
    margin-bottom: 20px;
    gap: 10px;
  }

  .cats__item {
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
  }

  .grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 18px;
  }

  .item {
    border-radius: 18px;
  }

  .item__title {
    font-size: 14px;
  }

  .item__price {
    font-size: 22px;
  }
}

@media (min-width: 1400px) {
  .grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
