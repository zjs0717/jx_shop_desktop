<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchRelatedVideosApi, searchVideosApi } from '@/api/video'
import type { VideoItem } from '@/types/video'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const loading = ref(false)
const error = ref('')
const results = ref<VideoItem[]>([])
const related = ref<VideoItem[]>([])
const relatedKeywords = ref<string[]>([])

const hasQuery = computed(() => keyword.value.trim().length > 0)
const empty = computed(() => !loading.value && !error.value && hasQuery.value && results.value.length === 0)

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(n >= 100000 ? 1 : 2)}万`
  return n.toLocaleString('zh-CN')
}

function syncFromRoute(): void {
  keyword.value = String(route.query.q || '').trim()
}

async function runSearch(q: string): Promise<void> {
  const text = q.trim()
  if (!text) {
    results.value = []
    related.value = []
    relatedKeywords.value = []
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''
  try {
    const data = await searchVideosApi(text)
    results.value = data.list
    related.value = []
    relatedKeywords.value = []

    const seed = data.list[0]
    if (seed?.id) {
      try {
        const rel = await fetchRelatedVideosApi(seed.id, 8)
        related.value = rel.list.filter((item) => !data.list.some((r) => r.id === item.id))
        relatedKeywords.value = rel.keywords || []
      } catch {
        related.value = []
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '搜索失败'
    results.value = []
    related.value = []
  } finally {
    loading.value = false
  }
}

async function submit(): Promise<void> {
  const q = keyword.value.trim()
  if (!q) return
  if (String(route.query.q || '') !== q) {
    await router.replace({ path: '/home/search', query: { q } })
    return
  }
  await runSearch(q)
}

async function openVideo(item: VideoItem): Promise<void> {
  await router.push({ path: '/home/video', query: { v: String(item.id) } })
}

async function searchTag(tag: string): Promise<void> {
  keyword.value = tag
  await router.replace({ path: '/home/search', query: { q: tag } })
}

watch(
  () => route.query.q,
  async () => {
    syncFromRoute()
    await runSearch(keyword.value)
  },
)

onMounted(async () => {
  syncFromRoute()
  if (keyword.value) await runSearch(keyword.value)
})
</script>

<template>
  <section class="search">
    <header class="search__head">
      <button type="button" class="search__back" @click="router.back()">返回</button>
      <form class="search__box" @submit.prevent="submit">
        <span class="search__icon" aria-hidden="true">⌕</span>
        <input
          v-model="keyword"
          class="search__input"
          type="search"
          maxlength="80"
          placeholder="搜标题、标签、创作者"
          enterkeyhint="search"
          autofocus
        />
        <button type="submit" class="search__go">搜索</button>
      </form>
    </header>

    <p v-if="error" class="search__error">{{ error }}</p>

    <div v-if="!hasQuery" class="search__hint">
      <h1>搜相关短视频</h1>
      <p>输入标题、标签或创作者昵称，找到你想刷的内容</p>
    </div>

    <div v-else-if="loading" class="search__hint">正在搜索「{{ keyword }}」…</div>

    <div v-else-if="empty" class="search__hint">
      <h2>没有找到相关视频</h2>
      <p>换个关键词试试，或去推荐流随便刷刷</p>
      <button type="button" class="search__cta" @click="router.push('/home/video')">去刷推荐</button>
    </div>

    <template v-else>
      <div class="search__meta">
        找到 <strong>{{ results.length }}</strong> 条与「{{ keyword }}」相关的短视频
      </div>

      <div class="grid">
        <article
          v-for="item in results"
          :key="item.id"
          class="card"
          role="button"
          tabindex="0"
          @click="openVideo(item)"
          @keydown.enter="openVideo(item)"
        >
          <div class="card__cover">
            <img v-if="item.cover" :src="item.cover" :alt="item.title" loading="lazy" />
            <div v-else class="card__blank" />
            <span class="card__plays">{{ formatCount(item.playCount) }} 播</span>
          </div>
          <div class="card__body">
            <h3>{{ item.title }}</h3>
            <p>@{{ item.author }} · {{ formatCount(item.likeCount) }} 赞</p>
            <div v-if="item.tags?.length" class="card__tags">
              <button
                v-for="tag in item.tags.slice(0, 3)"
                :key="tag"
                type="button"
                @click.stop="searchTag(tag)"
              >
                #{{ tag }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <section v-if="related.length" class="related">
        <div class="related__head">
          <h2>相关推荐</h2>
          <p v-if="relatedKeywords.length">基于 {{ relatedKeywords.slice(0, 3).join(' · ') }}</p>
        </div>
        <div class="grid">
          <article
            v-for="item in related"
            :key="`rel-${item.id}`"
            class="card"
            role="button"
            tabindex="0"
            @click="openVideo(item)"
            @keydown.enter="openVideo(item)"
          >
            <div class="card__cover">
              <img v-if="item.cover" :src="item.cover" :alt="item.title" loading="lazy" />
              <div v-else class="card__blank" />
              <span class="card__plays">{{ formatCount(item.playCount) }} 播</span>
            </div>
            <div class="card__body">
              <h3>{{ item.title }}</h3>
              <p>@{{ item.author }} · {{ formatCount(item.likeCount) }} 赞</p>
            </div>
          </article>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.search {
  min-height: 100%;
  padding: 16px 16px 28px;
  background:
    radial-gradient(ellipse 60% 40% at 0% 0%, rgba(255, 45, 122, 0.08), transparent 55%),
    linear-gradient(180deg, #f7f5fb 0%, #ebe8f4 100%);
}

.search__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.search__back {
  flex-shrink: 0;
  height: 40px;
  padding: 0 12px;
  border: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.search__box {
  flex: 1;
  min-width: 0;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 14px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 4px 16px rgba(13, 16, 38, 0.06);
}

.search__icon {
  color: var(--muted);
  font-size: 16px;
}

.search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: var(--ink);
}

.search__go {
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: var(--brand-gradient);
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.search__error {
  margin: 0 0 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 45, 122, 0.12);
  color: var(--brand-deep);
  font-size: 13px;
}

.search__hint {
  padding: 48px 12px;
  text-align: center;
  color: var(--text);
}

.search__hint h1,
.search__hint h2 {
  margin: 0 0 8px;
  color: var(--ink);
  font-size: 22px;
}

.search__hint p {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.search__cta {
  margin-top: 16px;
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.search__meta {
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--text);
}

.search__meta strong {
  color: var(--brand);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card {
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.card__cover {
  position: relative;
  aspect-ratio: 3 / 4;
  background: #111;
}

.card__cover img,
.card__blank {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card__blank {
  background: linear-gradient(145deg, #1a1f3d, #0d1026);
}

.card__plays {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
}

.card__body {
  padding: 10px 10px 12px;
}

.card__body h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  color: var(--ink);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__body p {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.card__tags button {
  appearance: none;
  border: 0;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand-deep);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.related {
  margin-top: 28px;
}

.related__head {
  margin-bottom: 12px;
}

.related__head h2 {
  margin: 0;
  font-size: 18px;
  color: var(--ink);
}

.related__head p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted);
}

@media (min-width: 768px) {
  .search {
    padding: 24px 28px 40px;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .search {
    max-width: 1100px;
    margin: 0 auto;
  }

  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
