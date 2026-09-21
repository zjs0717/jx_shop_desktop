<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const orderStore = useOrderStore()
const { latest: orders } = storeToRefs(orderStore)

async function back(): Promise<void> {
  await router.push('/home/shop')
}
</script>

<template>
  <div class="orders">
    <header class="orders__head">
      <button type="button" class="back" @click="back">← 商城</button>
      <h1>我的订单</h1>
      <p>跟踪包裹，复购更方便</p>
    </header>

    <div v-if="!orders.length" class="empty">还没有订单，去购物车结算吧</div>

    <div v-else class="list">
      <article v-for="o in orders" :key="o.id" class="order">
        <div class="order__top">
          <span>订单 {{ o.id.toUpperCase() }}</span>
          <strong>{{ o.status }}</strong>
        </div>
        <div class="order__body">
          <img :src="o.cover" :alt="o.title" />
          <div>
            <h3>{{ o.title }}</h3>
            <p class="price"><small>¥</small>{{ o.price }}</p>
          </div>
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

.orders__head h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.orders__head p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 14px;
}

.order__top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 12px;
}

.order__top strong {
  color: var(--brand);
  font-weight: 700;
}

.order__body {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  align-items: center;
}

.order__body img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
}

.order__body h3 {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.price {
  margin-top: 8px;
  color: var(--ink);
  font-family: var(--display);
  font-size: 18px;
  font-weight: 800;
}

.price small {
  font-size: 12px;
}

.empty {
  margin-top: 40px;
  text-align: center;
  color: var(--muted);
}
</style>
