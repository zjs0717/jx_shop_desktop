import { computed, ref, type ComputedRef, type Ref } from 'vue'

/** 与 style.css / 壳层媒体查询保持一致 */
export const BP_PAD = 768
export const BP_PC = 1024

export type LayoutMode = 'mobile' | 'pad' | 'pc'

function readMode(width = typeof window !== 'undefined' ? window.innerWidth : BP_PC): LayoutMode {
  if (width >= BP_PC) return 'pc'
  if (width >= BP_PAD) return 'pad'
  return 'mobile'
}

function applyDataset(next: LayoutMode): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.layout = next
}

const mode: Ref<LayoutMode> = ref(readMode())
applyDataset(mode.value)

let started = false

function onResize(): void {
  mode.value = readMode()
  applyDataset(mode.value)
}

/** 应用启动时同步一次，避免首屏闪错布局 */
export function initLayoutMode(): void {
  if (typeof window === 'undefined' || started) return
  started = true
  onResize()
  window.addEventListener('resize', onResize, { passive: true })
}

export function useLayoutMode(): {
  mode: Ref<LayoutMode>
  isMobile: ComputedRef<boolean>
  isPad: ComputedRef<boolean>
  isPc: ComputedRef<boolean>
  isTouchLayout: ComputedRef<boolean>
} {
  const isMobile = computed(() => mode.value === 'mobile')
  const isPad = computed(() => mode.value === 'pad')
  const isPc = computed(() => mode.value === 'pc')
  /** 手机 + Pad：底部 Tab、触控优先 */
  const isTouchLayout = computed(() => mode.value !== 'pc')

  return { mode, isMobile, isPad, isPc, isTouchLayout }
}
