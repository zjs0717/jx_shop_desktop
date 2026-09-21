import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ShopProduct } from '@/data/shop'

export interface CartItem extends ShopProduct {
  qty: number
  checked: boolean
}

const CART_KEY = 'jj_shop_cart'

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item.id === 'string')
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(readCart())

  const count = computed(() => items.value.filter((i) => i.checked).reduce((sum, i) => sum + i.qty, 0))
  const total = computed(() =>
    items.value.filter((i) => i.checked).reduce((sum, i) => sum + i.price * i.qty, 0),
  )
  const size = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
  }

  function add(product: ShopProduct, qty = 1): void {
    const hit = items.value.find((i) => i.id === product.id)
    if (hit) {
      hit.qty += qty
    } else {
      items.value.push({ ...product, qty, checked: true })
    }
    persist()
  }

  function setQty(id: string, qty: number): void {
    const hit = items.value.find((i) => i.id === id)
    if (!hit) return
    hit.qty = Math.max(1, qty)
    persist()
  }

  function toggleChecked(id: string): void {
    const hit = items.value.find((i) => i.id === id)
    if (!hit) return
    hit.checked = !hit.checked
    persist()
  }

  function remove(id: string): void {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function clearChecked(): CartItem[] {
    const taken = items.value.filter((i) => i.checked)
    items.value = items.value.filter((i) => !i.checked)
    persist()
    return taken
  }

  return { items, count, total, size, add, setQty, toggleChecked, remove, clearChecked }
})
