<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const cart = useCartStore()
const orderStore = useOrderStore()
const { items, count, total } = storeToRefs(cart)

async function back(): Promise<void> {
  await router.push('/home/shop')
}

async function checkout(): Promise<void> {
  const taken = cart.clearChecked()
  if (!taken.length) return
  orderStore.checkout(taken)
  await router.push('/home/shop/orders')
}
</script>

<template>
  <div class="cart">
    <header class="cart__head">
      <button type="button" class="back" @click="back">← 继续逛</button>
      <h1>购物车</h1>
      <p v-if="items.length">已选 {{ count }} 件，准备结算</p>
      <p v-else>还没有商品，去商城挑几件吧</p>
    </header>

    <div v-if="!items.length" class="empty">购物车是空的</div>

    <div v-else class="list">
      <article v-for="item in items" :key="item.id" class="row">
        <label class="check">
          <input :checked="item.checked" type="checkbox" @change="cart.toggleChecked(item.id)" />
        </label>
        <img :src="item.cover" :alt="item.title" />
        <div class="row__body">
          <h3>{{ item.title }}</h3>
          <div class="row__foot">
            <span class="price"><small>¥</small>{{ item.price }}</span>
            <div class="qty">
              <button type="button" :disabled="item.qty <= 1" @click="cart.setQty(item.id, item.qty - 1)">−</button>
              <span>{{ item.qty }}</span>
              <button type="button" @click="cart.setQty(item.id, item.qty + 1)">+</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <footer v-if="items.length" class="bar">
      <div>
        <span class="bar__label">合计</span>
        <strong class="bar__total"><small>¥</small>{{ total }}</strong>
      </div>
      <button type="button" class="bar__pay" :disabled="!count" @click="checkout">去结算 ({{ count }})</button>
    </footer>
  </div>
</template>

<style scoped>
.cart {
  padding-bottom: 72px;
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

.cart__head h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.cart__head p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: auto 88px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.row img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 12px;
}

.check input {
  width: 18px;
  height: 18px;
  accent-color: var(--brand);
}

.row__body h3 {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row__foot {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: var(--brand);
  font-family: var(--display);
  font-size: 20px;
  font-weight: 800;
}

.price small {
  font-size: 12px;
}

.qty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  border-radius: 999px;
  padding: 2px 6px;
}

.qty button {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  color: var(--ink);
}

.qty button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bar {
  position: sticky;
  bottom: calc(var(--tab-h) + var(--safe-b) + 8px);
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
}

.bar__label {
  display: block;
  font-size: 12px;
  color: var(--muted);
}

.bar__total {
  color: var(--brand);
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
}

.bar__total small {
  font-size: 14px;
}

.bar__pay {
  height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
  cursor: pointer;
}

.bar__pay:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty {
  margin-top: 40px;
  text-align: center;
  color: var(--muted);
}
</style>
