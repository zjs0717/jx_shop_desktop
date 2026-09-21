<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { heroSlideImages } from '@/data/heroSlides'

const props = withDefaults(
  defineProps<{
    images?: string[]
    interval?: number
    showDots?: boolean
  }>(),
  {
    images: () => heroSlideImages,
    interval: 5200,
    showDots: true,
  },
)

const index = ref(0)
let timer = 0

const slides = computed(() => (props.images.length ? props.images : heroSlideImages))

function go(next: number): void {
  const len = slides.value.length
  if (len <= 0) return
  index.value = ((next % len) + len) % len
}

function tick(): void {
  go(index.value + 1)
}

function start(): void {
  stop()
  if (slides.value.length <= 1) return
  timer = window.setInterval(tick, props.interval)
}

function stop(): void {
  if (timer) {
    window.clearInterval(timer)
    timer = 0
  }
}

onMounted(start)
onBeforeUnmount(stop)

watch(
  () => [props.interval, slides.value.length] as const,
  () => {
    index.value = 0
    start()
  },
)
</script>

<template>
  <div class="slides" aria-hidden="true">
    <img
      v-for="(src, i) in slides"
      :key="src"
      class="slides__img"
      :class="{ 'is-active': i === index }"
      :src="src"
      alt=""
      decoding="async"
      :loading="i === 0 ? 'eager' : 'lazy'"
    />
  </div>
  <div v-if="showDots && slides.length > 1" class="slides__dots" aria-hidden="true">
    <button
      v-for="(_, i) in slides"
      :key="i"
      type="button"
      class="slides__dot"
      :class="{ 'is-active': i === index }"
      tabindex="-1"
      @click="go(i); start()"
    />
  </div>
</template>

<style scoped>
.slides {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--surface-dark);
}

.slides__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.06);
  filter: saturate(1.12) brightness(0.9) contrast(1.02);
  transition:
    opacity 1.1s ease,
    transform 6.5s ease;
  pointer-events: none;
}

.slides__img.is-active {
  opacity: 1;
  transform: scale(1.12);
  z-index: 1;
}

.slides__dots {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

.slides__dot {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition:
    background 0.25s ease,
    transform 0.25s ease,
    width 0.25s ease;
}

.slides__dot.is-active {
  width: 18px;
  background: rgba(255, 255, 255, 0.92);
}

@media (max-width: 900px) {
  .slides__dots {
    top: 14px;
    right: 14px;
  }
}
</style>
