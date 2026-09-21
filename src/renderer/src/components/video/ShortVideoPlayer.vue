<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    cover?: string
    active?: boolean
  }>(),
  {
    cover: '',
    active: false,
  },
)

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  error: [message: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const ready = ref(false)
const playing = ref(false)
const muted = ref(true)
const progress = ref(0)
const duration = ref(0)
const showControls = ref(true)
const errorText = ref('')

let hideTimer: ReturnType<typeof setTimeout> | null = null

const progressStyle = computed(() => ({ width: `${Math.min(100, Math.max(0, progress.value))}%` }))

async function tryPlay(): Promise<void> {
  const el = videoRef.value
  if (!el || !props.src) return
  try {
    // 移动端自动播放要求静音 + playsinline
    el.muted = muted.value
    el.playsInline = true
    el.setAttribute('playsinline', '')
    el.setAttribute('webkit-playsinline', '')
    const p = el.play()
    if (p !== undefined) await p
    playing.value = true
    errorText.value = ''
    emit('play')
    bumpControls()
  } catch {
    // 浏览器可能拦截自动播放：保持封面态，等待用户点击
    playing.value = false
  }
}

function pause(): void {
  const el = videoRef.value
  if (!el) return
  el.pause()
  playing.value = false
  emit('pause')
  showControls.value = true
}

async function togglePlay(): Promise<void> {
  if (playing.value) pause()
  else await tryPlay()
}

defineExpose({
  togglePlay,
  tryPlay,
  pause,
})

async function toggleMute(): Promise<void> {
  muted.value = !muted.value
  if (videoRef.value) {
    videoRef.value.muted = muted.value
  }
  // 取消静音时尽量继续播
  if (!muted.value && !playing.value) {
    await tryPlay()
  }
  bumpControls()
}

function bumpControls(): void {
  showControls.value = true
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (playing.value) showControls.value = false
  }, 1600)
}

function onTimeUpdate(): void {
  const el = videoRef.value
  if (!el || !el.duration) return
  duration.value = el.duration
  progress.value = (el.currentTime / el.duration) * 100
}

function onLoaded(): void {
  ready.value = true
  errorText.value = ''
  if (props.active) void tryPlay()
}

function onEnded(): void {
  playing.value = false
  progress.value = 100
  showControls.value = true
  emit('ended')
}

function onError(): void {
  const el = videoRef.value
  const code = el?.error?.code
  errorText.value = code === 4 ? '视频地址无效或无法访问' : '视频加载失败'
  playing.value = false
  ready.value = false
  emit('error', errorText.value)
}

function seek(e: MouseEvent): void {
  const el = videoRef.value
  const bar = e.currentTarget as HTMLElement
  if (!el || !el.duration) return
  const rect = bar.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  el.currentTime = ratio * el.duration
  progress.value = ratio * 100
  bumpControls()
}

watch(
  () => [props.active, props.src] as const,
  async ([active]) => {
    await nextTick()
    if (active) {
      void tryPlay()
    } else {
      pause()
      if (videoRef.value) videoRef.value.currentTime = 0
      progress.value = 0
    }
  },
)

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
  pause()
})
</script>

<template>
  <div class="svp" @click="togglePlay">
    <video
      ref="videoRef"
      class="svp__video"
      :src="src"
      :poster="cover || undefined"
      playsinline
      webkit-playsinline
      x5-playsinline
      x5-video-player-type="h5"
      x5-video-player-fullscreen="false"
      preload="metadata"
      loop
      :muted="muted"
      @loadeddata="onLoaded"
      @canplay="onLoaded"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="onError"
      @waiting="ready = false"
      @playing="ready = true"
    />

    <div v-if="!ready && !errorText" class="svp__loading">加载中…</div>
    <div v-if="errorText" class="svp__error">{{ errorText }}</div>

    <div class="svp__ui" :class="{ 'is-show': showControls || !playing }">
      <button
        type="button"
        class="svp__center"
        :aria-label="playing ? '暂停' : '播放'"
        @click.stop="togglePlay"
      >
        {{ playing ? '❚❚' : '▶' }}
      </button>

      <div class="svp__bottom" @click.stop>
        <div class="svp__bar" @click="seek">
          <i :style="progressStyle" />
        </div>
        <button type="button" class="svp__mute" @click="toggleMute">
          {{ muted ? '取消静音' : '静音' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svp {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #000;
  overflow: hidden;
}

.svp__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
}

.svp__loading,
.svp__error {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  z-index: 3;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.55);
  color: #e2e8f0;
  font-size: 13px;
  pointer-events: none;
}

.svp__error {
  color: #fecaca;
}

.svp__ui {
  position: absolute;
  inset: 0;
  z-index: 6;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.svp__ui.is-show {
  opacity: 1;
}

.svp__ui.is-show .svp__center,
.svp__ui.is-show .svp__bottom {
  pointer-events: auto;
}

.svp__center {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.55);
  color: #f8fafc;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}

.svp__bottom {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.svp__bar {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  overflow: hidden;
  cursor: pointer;
}

.svp__bar i {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #2dd4bf, #38bdf8);
}

.svp__mute {
  height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.55);
  color: #e2e8f0;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
