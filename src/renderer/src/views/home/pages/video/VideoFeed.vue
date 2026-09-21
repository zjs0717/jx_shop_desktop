<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { fetchVideoFeed, recordVideoPlayApi, toggleVideoLikeApi } from '@/api/video'
import { fetchProfileApi } from '@/api/user'
import type { VideoFeedData, VideoItem } from '@/types/video'
import ShortVideoPlayer from '@/components/video/ShortVideoPlayer.vue'
import { isFollowing, toggleFollow } from '@/utils/follow'

const router = useRouter()
const route = useRoute()
const data = ref<VideoFeedData | null>(null)
const loading = ref(true)
const error = ref('')
const index = ref(0)
const selfId = ref<number | null>(null)
const followMap = reactive<Record<number, boolean>>({})
const likeBusy = reactive<Record<string, boolean>>({})
const playedOnce = reactive<Record<string, boolean>>({})

type PlayerExpose = {
  togglePlay: () => Promise<void>
  tryPlay: () => Promise<void>
  pause: () => void
}

const viewportRef = ref<HTMLElement | null>(null)
const playerRef = ref<PlayerExpose | null>(null)
const startY = ref(0)
const deltaY = ref(0)
const swiping = ref(false)
const wheelLock = ref(false)

/** 手指抖动阈值：超过才算滑动，避免手机端点播放失效 */
const TAP_SLOP = 16

let wheelTimer: ReturnType<typeof setTimeout> | null = null

function bindPlayer(el: unknown): void {
  // v-for 内 ref 可能是数组，统一归一成单个实例
  const raw = el as PlayerExpose | PlayerExpose[] | null
  playerRef.value = Array.isArray(raw) ? (raw[0] ?? null) : raw
}

async function toggleActivePlayer(): Promise<void> {
  const player = playerRef.value
  if (player) await player.togglePlay()
}

const list = computed(() => data.value?.list ?? [])
const canPrev = computed(() => index.value > 0)
const canNext = computed(() => index.value < list.value.length - 1)
const empty = computed(() => !loading.value && !error.value && list.value.length === 0)

const trackStyle = computed(() => {
  const vh = viewportRef.value?.clientHeight || window.innerHeight || 800
  const dragPercent = swiping.value ? (deltaY.value / vh) * 100 : 0
  const offset = -index.value * 100 + dragPercent
  return {
    transform: `translate3d(0, ${offset}%, 0)`,
    transition: swiping.value ? 'none' : 'transform 0.32s cubic-bezier(0.22, 0.61, 0.36, 1)',
  }
})

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n >= 100000 ? 1 : 2)}万`
  return n.toLocaleString('zh-CN')
}

function authorKey(item: VideoItem): number {
  return Number(item.authorId) || 0
}

function syncFollowMap(items: VideoItem[]): void {
  for (const item of items) {
    const id = authorKey(item)
    if (id && followMap[id] === undefined) {
      followMap[id] = isFollowing(id)
    }
  }
}

function go(nextIndex: number): void {
  if (!list.value.length) return
  const next = Math.max(0, Math.min(list.value.length - 1, nextIndex))
  if (next === index.value) return
  index.value = next
}

function prev(): void {
  if (canPrev.value) go(index.value - 1)
}

function next(): void {
  if (canNext.value) go(index.value + 1)
}

function beginSwipe(clientY: number): void {
  if (!list.value.length) return
  startY.value = clientY
  deltaY.value = 0
  swiping.value = true
}

function moveSwipe(clientY: number): void {
  if (!swiping.value) return
  deltaY.value = clientY - startY.value
}

function endSwipe(allowTap = false): void {
  if (!swiping.value) return
  const threshold = Math.min(72, (viewportRef.value?.clientHeight || 600) * 0.12)
  const abs = Math.abs(deltaY.value)
  if (deltaY.value < -threshold) next()
  else if (deltaY.value > threshold) prev()
  else if (allowTap && abs <= TAP_SLOP) {
    void toggleActivePlayer()
  }
  swiping.value = false
  deltaY.value = 0
}

function onTouchStart(e: TouchEvent): void {
  beginSwipe(e.touches[0]?.clientY ?? 0)
}

function onTouchMove(e: TouchEvent): void {
  if (!swiping.value) return
  if (Math.abs((e.touches[0]?.clientY ?? 0) - startY.value) > 8) {
    e.preventDefault()
  }
  moveSwipe(e.touches[0]?.clientY ?? 0)
}

function onTouchEnd(): void {
  endSwipe(false)
}

function onMobileTouchEnd(): void {
  endSwipe(true)
}

function onPointerDown(e: PointerEvent): void {
  if (e.pointerType === 'touch') return
  if (e.button !== 0) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  beginSwipe(e.clientY)
}

function onPointerMove(e: PointerEvent): void {
  if (e.pointerType === 'touch') return
  if (!swiping.value) return
  moveSwipe(e.clientY)
}

function onPointerUp(e: PointerEvent): void {
  if (e.pointerType === 'touch') return
  endSwipe(false)
}

function onWheel(e: WheelEvent): void {
  if (!list.value.length || wheelLock.value) return
  if (Math.abs(e.deltaY) < 12) return
  wheelLock.value = true
  if (e.deltaY > 0) next()
  else prev()
  wheelTimer = setTimeout(() => {
    wheelLock.value = false
  }, 450)
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    prev()
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    next()
  }
}

function jumpToQueryVideo(): void {
  const vid = String(route.query.v || '')
  if (!vid || !list.value.length) return
  const i = list.value.findIndex((item) => String(item.id) === vid)
  if (i >= 0) index.value = i
}

async function openAuthor(item: VideoItem, e?: Event): Promise<void> {
  e?.stopPropagation()
  e?.preventDefault()
  const id = authorKey(item)
  if (!id) return
  if (selfId.value != null && selfId.value === id) {
    await router.push('/home/me')
    return
  }
  await router.push(`/home/user/${id}`)
}

function onFollowClick(item: VideoItem, e: Event): void {
  e.stopPropagation()
  e.preventDefault()
  const id = authorKey(item)
  if (!id) return
  if (selfId.value != null && selfId.value === id) {
    void router.push('/home/me')
    return
  }
  followMap[id] = toggleFollow(id)
}

function isSelfAuthor(item: VideoItem): boolean {
  const id = authorKey(item)
  return id > 0 && selfId.value != null && selfId.value === id
}

async function onLikeClick(item: VideoItem, e: Event): Promise<void> {
  e.stopPropagation()
  e.preventDefault()
  const id = String(item.id)
  if (!id || likeBusy[id]) return
  likeBusy[id] = true
  const prevLiked = Boolean(item.liked)
  const prevCount = item.likeCount
  item.liked = !prevLiked
  item.likeCount = Math.max(0, prevCount + (item.liked ? 1 : -1))
  try {
    const res = await toggleVideoLikeApi(id)
    item.liked = res.liked
    item.likeCount = res.likeCount
  } catch (err) {
    item.liked = prevLiked
    item.likeCount = prevCount
    error.value = err instanceof Error ? err.message : '点赞失败'
    window.setTimeout(() => {
      if (error.value.includes('点赞') || error.value.includes('登录')) error.value = ''
    }, 2200)
  } finally {
    likeBusy[id] = false
  }
}

async function onPlayerPlay(item: VideoItem): Promise<void> {
  const id = String(item.id)
  if (!id || playedOnce[id]) return
  playedOnce[id] = true
  item.playCount = (item.playCount || 0) + 1
  try {
    const res = await recordVideoPlayApi(id)
    item.playCount = res.playCount
  } catch {
    // 播放计数失败不影响观看
  }
}

async function searchByTag(tag: string, e?: Event): Promise<void> {
  e?.stopPropagation()
  e?.preventDefault()
  const q = tag.trim()
  if (!q) return
  await router.push({ path: '/home/search', query: { q } })
}

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const [feed, me] = await Promise.all([
      fetchVideoFeed(),
      fetchProfileApi().catch(() => null),
    ])
    data.value = feed
    selfId.value = me?.id ?? null
    syncFollowMap(feed.list)
    index.value = 0
    await nextTick()
    jumpToQueryVideo()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
    data.value = { total: 0, list: [] }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.v,
  () => {
    jumpToQueryVideo()
  },
)

onMounted(() => {
  void load()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (wheelTimer) clearTimeout(wheelTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section class="reels">
    <nav class="reels__tabs" aria-label="短视频频道">
      <RouterLink class="is-active" to="/home/video">推荐</RouterLink>
      <RouterLink to="/home/video/follow">关注</RouterLink>
      <RouterLink to="/home/video/nearby">同城</RouterLink>
    </nav>

    <div class="reels__tools">
      <button type="button" class="reels__search" @click="router.push('/home/search')">搜索</button>
      <button type="button" class="reels__upload" @click="router.push('/home/me/upload')">
        上传
      </button>
    </div>

    <p v-if="error" class="reels__error">{{ error }}</p>

    <div v-if="loading" class="reels__viewport reels__viewport--skeleton" aria-busy="true">
      <div class="skeleton">
        <div class="skeleton__glow" />
        <p>加载短视频…</p>
      </div>
    </div>

    <div v-else-if="empty" class="reels__viewport reels__viewport--empty">
      <div class="empty">
        <h2>还没有人发布短视频</h2>
        <p>上传你的第一条，成为推荐流里的第一位</p>
        <button type="button" @click="router.push('/home/me/upload')">去上传</button>
      </div>
    </div>

    <div v-else ref="viewportRef" class="reels__viewport">
      <div class="reels__track" :style="trackStyle">
        <article v-for="(item, i) in list" :key="item.id" class="reel">
          <div
            class="reel__swipe"
            aria-hidden="true"
            @touchstart.passive="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @wheel.prevent="onWheel"
          />

          <div class="reel__phone">
            <ShortVideoPlayer
              v-if="i === index && item.playUrl"
              :ref="bindPlayer"
              :src="item.playUrl"
              :cover="item.cover"
              :active="i === index"
              @play="onPlayerPlay(item)"
              @ended="next"
            />
            <img
              v-else-if="item.cover"
              class="reel__cover"
              :src="item.cover"
              :alt="item.title"
              loading="lazy"
            />
            <div v-else class="reel__cover reel__cover--blank" />

            <div
              class="reel__gesture-mobile"
              @touchstart.passive="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onMobileTouchEnd"
              @touchcancel="onMobileTouchEnd"
            />

            <div class="reel__mask" />

            <aside class="reel__actions">
              <div class="reel__avatar-wrap">
                <button
                  type="button"
                  class="reel__avatar"
                  :disabled="!item.authorId"
                  :aria-label="`查看 @${item.author} 的主页`"
                  @click="openAuthor(item, $event)"
                >
                  <img v-if="item.authorAvatar" :src="item.authorAvatar" :alt="item.author" />
                  <span v-else>{{ (item.author || 'U').slice(0, 1) }}</span>
                </button>
                <button
                  v-if="item.authorId && !isSelfAuthor(item)"
                  type="button"
                  class="reel__follow"
                  :class="{ 'is-on': followMap[authorKey(item)] }"
                  :aria-label="followMap[authorKey(item)] ? '取消关注' : '关注'"
                  @click="onFollowClick(item, $event)"
                >
                  {{ followMap[authorKey(item)] ? '✓' : '+' }}
                </button>
              </div>
              <button
                type="button"
                class="reel__stat reel__stat--btn"
                :class="{ 'is-liked': item.liked }"
                :aria-label="item.liked ? '取消点赞' : '点赞'"
                :disabled="likeBusy[String(item.id)]"
                @click="onLikeClick(item, $event)"
              >
                <span class="reel__heart" aria-hidden="true">{{ item.liked ? '♥' : '♡' }}</span>
                <strong>{{ formatCount(item.likeCount) }}</strong>
                <span>赞</span>
              </button>
              <div class="reel__stat">
                <strong>{{ formatCount(item.playCount) }}</strong>
                <span>播</span>
              </div>
            </aside>

            <div class="reel__info">
              <button
                type="button"
                class="reel__author"
                :disabled="!item.authorId"
                @click="openAuthor(item, $event)"
              >
                @{{ item.author }}
              </button>
              <h3 class="reel__name">{{ item.title }}</h3>
              <p v-if="item.description" class="reel__desc">{{ item.description }}</p>
              <div v-if="item.tags?.length" class="reel__tags">
                <button
                  v-for="tag in item.tags.slice(0, 4)"
                  :key="tag"
                  type="button"
                  class="reel__tag"
                  @click="searchByTag(tag, $event)"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>

            <div v-if="i === index" class="reel__hint">
              {{ canNext ? '上滑看下一条' : canPrev ? '下滑看上一条' : '' }}
            </div>
          </div>

          <div
            class="reel__swipe"
            aria-hidden="true"
            @touchstart.passive="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @wheel.prevent="onWheel"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reels {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  background: #050508;
  touch-action: pan-y;
}

.reels__tabs {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 20px;
  white-space: nowrap;
}

.reels__tabs a {
  color: rgba(255, 255, 255, 0.55);
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  white-space: nowrap;
}

.reels__tabs a.is-active {
  color: #fff;
  position: relative;
}

.reels__tabs a.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 16px;
  height: 3px;
  border-radius: 999px;
  background: var(--brand);
  transform: translateX(-50%);
}

.reels__tools {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 10;
  display: flex;
  gap: 8px;
}

.reels__search,
.reels__upload {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.reels__search {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.reels__upload {
  background: var(--brand-gradient);
  color: #fff;
}

.reels__error {
  position: absolute;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 45, 122, 0.9);
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
}

.reels__viewport {
  position: relative;
  flex: 1;
  min-height: 100%;
  height: 100%;
  overflow: hidden;
  background: #050508;
  user-select: none;
}

.reels__viewport--skeleton,
.reels__viewport--empty {
  display: grid;
  place-items: center;
}

.empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  padding: 24px;
}

.empty h2 {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.empty p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.empty button {
  margin-top: 16px;
  height: 42px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.reels__track {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  will-change: transform;
}

.reel {
  flex: 0 0 100%;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr minmax(0, min(420px, 100%)) 1fr;
  align-items: stretch;
}

.reel__swipe {
  min-width: 0;
  height: 100%;
  z-index: 7;
  touch-action: none;
  cursor: grab;
}

.reel__phone {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

.reel__cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #111;
}

.reel__cover--blank {
  background: var(--surface-dark-elevated);
}

.reel__gesture-mobile {
  display: none;
}

.reel__mask {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.28), transparent 22%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.72), transparent 38%);
}

.reel__actions {
  position: absolute;
  right: 12px;
  bottom: 120px;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  pointer-events: none;
}

.reel__avatar-wrap {
  position: relative;
  width: 48px;
  height: 54px;
  pointer-events: auto;
}

.reel__avatar {
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  border: 2px solid #fff;
  cursor: pointer;
}

.reel__avatar:disabled {
  cursor: default;
  opacity: 0.9;
}

.reel__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reel__follow {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.reel__follow.is-on {
  background: rgba(255, 255, 255, 0.92);
  color: var(--brand);
  font-size: 11px;
}

.reel__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #f8fafc;
}

.reel__stat--btn {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  font: inherit;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.15s ease;
}

.reel__stat--btn:active:not(:disabled) {
  transform: scale(0.92);
}

.reel__stat--btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.reel__stat--btn.is-liked {
  color: #ff6b9d;
}

.reel__stat--btn.is-liked span:last-child {
  color: #ffb3cb;
}

.reel__heart {
  font-size: 22px;
  line-height: 1;
  margin-bottom: 2px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.reel__stat strong {
  font-size: 13px;
  white-space: nowrap;
}

.reel__stat span {
  font-size: 11px;
  color: #cbd5e1;
}

.reel__info {
  position: absolute;
  left: 14px;
  right: 72px;
  bottom: 28px;
  z-index: 6;
  color: #f8fafc;
  pointer-events: none;
}

.reel__author {
  appearance: none;
  display: inline-block;
  margin: 0 0 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 650;
  font-family: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-align: left;
  cursor: pointer;
  pointer-events: auto;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
}

.reel__author:disabled {
  cursor: default;
}

.reel__author:not(:disabled):active {
  opacity: 0.85;
}

.reel__name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reel__desc {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reel__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
  pointer-events: auto;
}

.reel__tag {
  appearance: none;
  border: 0;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.reel__hint {
  position: absolute;
  left: 50%;
  top: 52px;
  transform: translateX(-50%);
  z-index: 6;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.45);
  color: rgba(226, 232, 240, 0.85);
  font-size: 11px;
  white-space: nowrap;
  pointer-events: none;
}

.skeleton {
  text-align: center;
  color: #94a3b8;
}

.skeleton__glow {
  width: min(360px, 78vw);
  height: min(72vh, 620px);
  margin: 0 auto 14px;
  border-radius: 18px;
  background: linear-gradient(90deg, #111113 25%, #1c1b22 37%, #111113 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

@media (max-width: 720px) {
  .reel {
    grid-template-columns: 0 minmax(0, 1fr) 0;
  }

  .reel__swipe {
    display: none;
  }

  .reel__gesture-mobile {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 72px; /* 右侧操作栏可点 */
    bottom: 88px; /* 底部进度/静音可点 */
    z-index: 5;
    touch-action: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .reel {
    grid-template-columns: 1fr minmax(0, min(460px, 100%)) 1fr;
  }

  .reel__phone {
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }
}

@media (min-width: 1024px) {
  .reels,
  .reels__viewport {
    min-height: 100%;
  }

  .reels__viewport {
    padding: 20px 0;
  }

  .reel {
    grid-template-columns: 1fr minmax(0, min(440px, 38vw)) 1fr;
    padding: 0 24px;
  }

  .reel__phone {
    border-radius: 22px;
    box-shadow:
      0 28px 72px rgba(0, 0, 0, 0.55),
      0 0 0 1px rgba(255, 255, 255, 0.06);
  }

  .reels__tools {
    right: 28px;
  }

  .reels__search,
  .reels__upload {
    height: 36px;
    padding: 0 16px;
    font-size: 13px;
  }
}
</style>
