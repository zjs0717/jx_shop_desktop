<script setup lang="ts">
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadMyVideoApi } from '@/api/user'
import type { UserVideoStatus } from '@/types/user'

const router = useRouter()
const uploading = ref(false)
const error = ref('')
const successMsg = ref('')

const videoInput = ref<HTMLInputElement | null>(null)
const coverInput = ref<HTMLInputElement | null>(null)

const videoFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const videoPreview = ref('')
const coverPreview = ref('')

const form = reactive({
  title: '',
  description: '',
  tags: '',
  city: '',
  status: 'published' as UserVideoStatus,
  duration: 0,
  width: 0,
  height: 0,
})

function revoke(url: string): void {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url)
}

function onPickVideo(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  revoke(videoPreview.value)
  videoFile.value = file
  videoPreview.value = URL.createObjectURL(file)

  const probe = document.createElement('video')
  probe.preload = 'metadata'
  probe.src = videoPreview.value
  probe.onloadedmetadata = () => {
    form.duration = Number.isFinite(probe.duration) ? Math.round(probe.duration * 10) / 10 : 0
    form.width = probe.videoWidth || 0
    form.height = probe.videoHeight || 0
  }
}

function onPickCover(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  revoke(coverPreview.value)
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
}

async function submit(): Promise<void> {
  if (!videoFile.value) {
    error.value = '请先选择短视频文件'
    return
  }
  if (!form.title.trim()) {
    error.value = '请填写标题'
    return
  }

  uploading.value = true
  error.value = ''
  successMsg.value = ''
  try {
    const created = await uploadMyVideoApi({
      video: videoFile.value,
      cover: coverFile.value,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.trim(),
      city: form.city.trim(),
      status: form.status,
      duration: form.duration,
      width: form.width,
      height: form.height,
    })
    successMsg.value = form.status === 'published' ? '已发布到推荐流' : '已保存到视频库'
    setTimeout(() => {
      void router.push(created.status === 'published' ? '/home/video' : '/home/me/library')
    }, 600)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '上传失败'
  } finally {
    uploading.value = false
  }
}

onBeforeUnmount(() => {
  revoke(videoPreview.value)
  revoke(coverPreview.value)
})
</script>

<template>
  <div class="studio">
    <header class="studio__head">
      <button type="button" class="back" @click="router.push('/home/me')">← 返回我的</button>
      <div>
        <h1>发布作品</h1>
        <p>左侧预览 · 右侧填写 · 一键发布到推荐或存入视频库</p>
      </div>
    </header>

    <form class="studio__body" @submit.prevent="submit">
      <aside class="preview">
        <div class="phone">
          <div class="phone__screen">
            <video
              v-if="videoPreview"
              class="phone__video"
              :src="videoPreview"
              muted
              playsinline
              controls
            />
            <img
              v-else-if="coverPreview"
              class="phone__cover"
              :src="coverPreview"
              alt="封面预览"
            />
            <div v-else class="phone__empty">
              <strong>作品预览</strong>
              <span>上传后在这里预览竖屏效果</span>
            </div>
            <div v-if="form.title" class="phone__caption">
              <p>@你</p>
              <h3>{{ form.title }}</h3>
            </div>
          </div>
        </div>

        <div class="upload-row">
          <button type="button" class="upload-btn" @click="videoInput?.click()">
            {{ videoFile ? '更换视频' : '选择视频' }}
          </button>
          <button type="button" class="upload-btn upload-btn--ghost" @click="coverInput?.click()">
            {{ coverFile ? '更换封面' : '选择封面' }}
          </button>
        </div>
        <p class="hint">支持 mp4 / webm / mov，最大 120MB</p>
        <p v-if="videoFile" class="meta">
          <span>{{ videoFile.name }}</span>
          <span v-if="form.duration">{{ form.duration }}s</span>
          <span v-if="form.width && form.height">{{ form.width }}×{{ form.height }}</span>
        </p>
        <input ref="videoInput" type="file" accept="video/*" hidden @change="onPickVideo" />
        <input ref="coverInput" type="file" accept="image/*" hidden @change="onPickCover" />
      </aside>

      <section class="editor">
        <label class="field">
          <span>标题</span>
          <input v-model="form.title" maxlength="120" placeholder="给作品起个吸引人的标题" required />
        </label>

        <label class="field">
          <span>描述</span>
          <textarea v-model="form.description" maxlength="500" rows="4" placeholder="说说这条视频想表达什么" />
        </label>

        <div class="row2">
          <label class="field">
            <span>标签</span>
            <input v-model="form.tags" maxlength="100" placeholder="穿搭,日常" />
          </label>
          <label class="field">
            <span>同城</span>
            <input v-model="form.city" maxlength="50" placeholder="上海" />
          </label>
        </div>

        <div class="publish-mode">
          <p class="publish-mode__title">发布方式</p>
          <div class="seg">
            <button
              type="button"
              class="seg__item"
              :class="{ 'is-active': form.status === 'published' }"
              @click="form.status = 'published'"
            >
              发布到推荐
            </button>
            <button
              type="button"
              class="seg__item"
              :class="{ 'is-active': form.status === 'library' }"
              @click="form.status = 'library'"
            >
              先存视频库
            </button>
          </div>
        </div>

        <p v-if="error" class="err">{{ error }}</p>
        <p v-if="successMsg" class="ok">{{ successMsg }}</p>

        <div class="actions">
          <button type="button" class="ghost" @click="router.push('/home/me')">取消</button>
          <button type="submit" class="primary" :disabled="uploading">
            {{ uploading ? '上传中…' : form.status === 'published' ? '发布作品' : '保存到视频库' }}
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<style scoped>
.studio {
  width: min(1100px, 100%);
  margin: 0 auto;
  animation: fade 0.3s ease both;
}

.studio__head {
  margin-bottom: 18px;
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

.studio__head h1 {
  font-family: var(--display);
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.03em;
  white-space: nowrap;
}

.studio__head p {
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}

.studio__body {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.preview {
  position: sticky;
  top: 24px;
}

.phone {
  border-radius: 28px;
  padding: 12px;
  background: linear-gradient(160deg, #243033, var(--surface-dark-elevated));
  box-shadow: 0 24px 50px rgba(18, 24, 26, 0.18);
}

.phone__screen {
  position: relative;
  aspect-ratio: 9 / 16;
  border-radius: 20px;
  overflow: hidden;
  background: #050508;
}

.phone__video,
.phone__cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.phone__empty {
  height: 100%;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  padding: 20px;
}

.phone__empty strong {
  color: #fff;
  font-size: 16px;
}

.phone__empty span {
  font-size: 12px;
}

.phone__caption {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 16px;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.phone__caption p {
  font-size: 12px;
  margin-bottom: 4px;
}

.phone__caption h3 {
  font-size: 14px;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.upload-row {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.upload-btn {
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.upload-btn--ghost {
  background: #fff;
  color: var(--ink);
  border: 1px solid var(--border);
}

.hint,
.meta {
  margin-top: 10px;
  font-size: 12px;
  color: var(--muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.editor {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 30px rgba(18, 24, 26, 0.04);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-soft);
  min-width: 0;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #faf8fb;
  padding: 12px 14px;
  font: inherit;
  color: var(--ink);
  outline: none;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(255, 45, 122, 0.45);
  box-shadow: 0 0 0 3px rgba(255, 45, 122, 0.12);
  background: #fff;
}

.row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.publish-mode__title {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--ink-soft);
}

.seg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 6px;
  border-radius: 16px;
  background: var(--bg);
}

.seg__item {
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--muted);
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}

.seg__item.is-active {
  background: #fff;
  color: var(--brand);
  box-shadow: 0 4px 14px rgba(18, 24, 26, 0.08);
}

.err {
  color: var(--brand);
  font-size: 13px;
}

.ok {
  color: var(--success);
  font-size: 13px;
}

.actions {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ghost,
.primary {
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.ghost {
  border: 1px solid var(--border);
  background: #fff;
  color: var(--ink-soft);
}

.primary {
  border: 0;
  color: #fff;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
}

.primary:disabled {
  opacity: 0.7;
  cursor: wait;
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

@media (max-width: 900px) {
  .studio__body {
    grid-template-columns: 1fr;
  }

  .preview {
    position: static;
  }

  .phone {
    max-width: 320px;
    margin: 0 auto;
  }

  .row2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .studio__head h1 {
    white-space: normal;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .ghost,
  .primary {
    width: 100%;
  }
}
</style>
