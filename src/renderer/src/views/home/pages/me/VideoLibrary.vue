<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteMyVideoApi, fetchMyVideosApi, updateMyVideoApi } from '@/api/user'
import type { UserVideoItem } from '@/types/user'

const router = useRouter()
const list = ref<UserVideoItem[]>([])
const loading = ref(true)
const error = ref('')
const actingId = ref<number | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchMyVideosApi('library')
    list.value = data.list
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function publish(item: UserVideoItem): Promise<void> {
  actingId.value = item.id
  try {
    await updateMyVideoApi(item.id, { status: 'published' })
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '发布失败'
  } finally {
    actingId.value = null
  }
}

async function remove(item: UserVideoItem): Promise<void> {
  if (!confirm(`删除「${item.title}」？`)) return
  actingId.value = item.id
  try {
    await deleteMyVideoApi(item.id)
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  } finally {
    actingId.value = null
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="router.push('/home/me')">← 我的</button>
    <header class="head">
      <div>
        <h1>个人视频库</h1>
        <p>草稿、素材与未公开内容</p>
      </div>
      <div class="head__actions">
        <button type="button" class="link" @click="router.push('/home/me/upload')">上传</button>
        <button type="button" class="link" @click="router.push('/home/me/published')">看已发布</button>
      </div>
    </header>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-if="loading" class="hint">加载中…</p>

    <div v-else-if="!list.length" class="empty">
      <p>视频库还是空的</p>
      <button type="button" @click="router.push('/home/me/upload')">去上传</button>
    </div>

    <div v-else class="grid">
      <article v-for="item in list" :key="item.id" class="card">
        <div class="card__media">
          <img v-if="item.cover" :src="item.cover" :alt="item.title" />
          <video v-else :src="item.playUrl" muted playsinline />
          <span class="badge">私密库</span>
        </div>
        <div class="card__body">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description || '暂无描述' }}</p>
          <div class="card__actions">
            <button
              type="button"
              :disabled="actingId === item.id"
              @click="publish(item)"
            >
              发布
            </button>
            <button
              type="button"
              class="danger"
              :disabled="actingId === item.id"
              @click="remove(item)"
            >
              删除
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.page {
  animation: fade 0.3s ease both;
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

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  font-family: var(--display);
  font-size: clamp(24px, 4vw, 28px);
  font-weight: 800;
  white-space: nowrap;
}

.head p,
.hint {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.head__actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.link {
  border: 0;
  background: transparent;
  color: var(--brand);
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
}

.err {
  color: var(--brand);
  margin-bottom: 10px;
  font-size: 13px;
}

.empty {
  padding: 48px 16px;
  text-align: center;
  color: var(--muted);
  background: #fff;
  border-radius: 16px;
  border: 1px dashed var(--border);
}

.empty button {
  margin-top: 12px;
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.card__media {
  position: relative;
  aspect-ratio: 3 / 4;
  background: var(--surface-dark-elevated);
}

.card__media img,
.card__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.card__body {
  padding: 12px;
}

.card__body h3 {
  font-size: 14px;
  font-weight: 650;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__body p {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.card__actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.card__actions button {
  flex: 1;
  height: 32px;
  border-radius: 999px;
  border: 0;
  background: var(--ink);
  color: #fff;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.card__actions .danger {
  background: #fff;
  color: var(--brand);
  border: 1px solid rgba(255, 45, 122, 0.25);
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

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
