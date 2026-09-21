import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem } from '@/stores/cart'

export interface ShopOrder {
  id: string
  status: '待发货' | '配送中' | '已完成'
  title: string
  price: number
  cover: string
  qty: number
  createdAt: number
}

const ORDER_KEY = 'jj_shop_orders'

function readOrders(): ShopOrder[] {
  try {
    const raw = localStorage.getItem(ORDER_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ShopOrder[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<ShopOrder[]>(readOrders())

  const latest = computed(() => [...orders.value].sort((a, b) => b.createdAt - a.createdAt))

  function persist(): void {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders.value))
  }

  function checkout(items: CartItem[]): ShopOrder[] {
    const created = items.map((item, index) => ({
      id: `o${Date.now().toString(36)}${index}`,
      status: '待发货' as const,
      title: item.title,
      price: item.price * item.qty,
      cover: item.cover,
      qty: item.qty,
      createdAt: Date.now(),
    }))
    orders.value = [...created, ...orders.value]
    persist()
    return created
  }

  return { orders, latest, checkout }
})
