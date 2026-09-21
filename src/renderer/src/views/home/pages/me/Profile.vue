<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProfileApi, updateProfileApi, uploadAvatarApi } from '@/api/user'
import type { UserGender, UserProfile } from '@/types/user'

const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const message = ref('')
const error = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')

const form = reactive({
  nickname: '',
  gender: 'unknown' as UserGender,
  bio: '',
})

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    const profile: UserProfile = await fetchProfileApi()
    form.nickname = profile.nickname || profile.username
    form.gender = profile.gender || 'unknown'
    form.bio = profile.bio || ''
    avatarPreview.value = profile.avatarUrl || ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function onPickAvatar(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  message.value = ''
  error.value = ''
  try {
    const profile = await uploadAvatarApi(file)
    avatarPreview.value = profile.avatarUrl
    message.value = '头像已更新'
  } catch (err) {
    error.value = err instanceof Error ? err.message : '上传失败'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function save(): Promise<void> {
  saving.value = true
  message.value = ''
  error.value = ''
  try {
    await updateProfileApi({
      nickname: form.nickname.trim(),
      gender: form.gender,
      bio: form.bio.trim(),
    })
    message.value = '资料已保存'
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="router.push('/home/me')">← 我的</button>
    <h1>编辑资料</h1>
    <p class="sub">头像、昵称、性别与简介</p>

    <div v-if="loading" class="hint">加载中…</div>
    <form v-else class="form" @submit.prevent="save">
      <div class="avatar-block">
        <button type="button" class="avatar" :disabled="uploading" @click="fileInput?.click()">
          <img v-if="avatarPreview" :src="avatarPreview" alt="头像" />
          <span v-else>{{ form.nickname.slice(0, 1) || 'J' }}</span>
        </button>
        <div>
          <strong>个人头像</strong>
          <p>{{ uploading ? '上传中…' : '点击更换，支持 jpg / png' }}</p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="onPickAvatar"
        />
      </div>

      <label class="field">
        <span>昵称</span>
        <input v-model="form.nickname" maxlength="50" placeholder="怎么称呼你" required />
      </label>

      <fieldset class="gender">
        <legend>性别</legend>
        <label v-for="item in [
          { value: 'male', label: '男' },
          { value: 'female', label: '女' },
          { value: 'other', label: '其他' },
          { value: 'unknown', label: '保密' },
        ]" :key="item.value">
          <input v-model="form.gender" type="radio" :value="item.value" />
          <span>{{ item.label }}</span>
        </label>
      </fieldset>

      <label class="field">
        <span>个人简介</span>
        <textarea v-model="form.bio" maxlength="200" rows="4" placeholder="介绍一下自己" />
      </label>

      <p v-if="message" class="ok">{{ message }}</p>
      <p v-if="error" class="err">{{ error }}</p>

      <button type="submit" class="save" :disabled="saving">
        {{ saving ? '保存中…' : '保存资料' }}
      </button>
    </form>
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

h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.sub,
.hint {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.form {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.avatar-block {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  overflow: hidden;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 26px;
  font-weight: 800;
  font-family: var(--display);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-block strong {
  display: block;
  color: var(--ink);
  font-size: 15px;
}

.avatar-block p {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-soft);
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
  padding: 12px 14px;
  font: inherit;
  color: var(--ink);
  outline: none;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(255, 45, 122, 0.45);
  box-shadow: 0 0 0 3px rgba(255, 45, 122, 0.12);
}

.gender {
  margin: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.gender legend {
  padding: 0 6px;
  font-size: 13px;
  color: var(--ink-soft);
}

.gender label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  border-radius: 999px;
  background: var(--bg);
  font-size: 13px;
  cursor: pointer;
  color: var(--ink);
}

.gender input {
  accent-color: var(--brand);
}

.ok {
  color: var(--success);
  font-size: 13px;
}

.err {
  color: var(--brand);
  font-size: 13px;
}

.save {
  height: 46px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  background: var(--brand-gradient);
  box-shadow: var(--shadow-brand);
  cursor: pointer;
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

@media (max-width: 520px) {
  .gender {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
