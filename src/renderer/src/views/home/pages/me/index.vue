<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMyVideosApi } from '@/api/user'
import { genderLabel } from '@/utils/gender'
import SceneCanvas from '@/components/fx/SceneCanvas.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const auth = useAuthStore()
const user = useUserStore()
const profile = computed(() => user.profile)
const loading = computed(() => user.loading)
const error = computed(() => user.error)
const publishedCount = ref(0)
const libraryCount = ref(0)
const booting = ref(true)

const tiles = [
  { title: '编辑资料', desc: '头像昵称性别', path: '/home/me/profile', tone: 'a' },
  { title: '收货地址', desc: '常用收货信息', path: '/home/me/address', tone: 'b' },
  { title: '视频库', desc: '草稿与私密', path: '/home/me/library', tone: 'c' },
  { title: '已发布', desc: '对外作品', path: '/home/me/published', tone: 'a' },
  { title: '我的订单', desc: '物流与售后', path: '/home/shop/orders', tone: 'b' },
  { title: '去逛商城', desc: '发现好物', path: '/home/shop', tone: 'c' },
]

const displayName = computed(() => user.displayName)

async function load(): Promise<void> {
  booting.value = true
  try {
    await user.fetchProfile()
    const [published, library] = await Promise.all([
      fetchMyVideosApi('published').catch(() => ({ list: [], total: 0 })),
      fetchMyVideosApi('library').catch(() => ({ list: [], total: 0 })),
    ])
    publishedCount.value = published.total
    libraryCount.value = library.total
  } finally {
    booting.value = false
  }
}

async function go(path: string): Promise<void> {
  await router.push(path)
}

async function logout(): Promise<void> {
  auth.logout()
  user.reset()
  await router.push('/login')
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="me">
    <section class="banner">
      <SceneCanvas mode="soft" />
      <div class="banner__shade" />

      <div v-if="booting || loading" class="banner__state">加载中…</div>
      <div v-else-if="error" class="banner__state">
        <p>{{ error }}</p>
        <button type="button" @click="load">重试</button>
      </div>
      <div v-else-if="profile" class="banner__body">
        <button type="button" class="avatar" @click="go('/home/me/profile')">
          <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="displayName" />
          <span v-else>{{ displayName.slice(0, 1) }}</span>
        </button>
        <div class="who">
          <h1>{{ displayName }}</h1>
          <p>@{{ profile.username }} · {{ genderLabel(profile.gender) }}</p>
          <p class="bio">{{ profile.bio || '写一句简介，让别人记住你' }}</p>
        </div>
        <button type="button" class="publish" @click="go('/home/me/upload')">上传作品</button>
      </div>

      <div class="stats">
        <button type="button" class="stat" @click="go('/home/me/published')">
          <strong>{{ publishedCount }}</strong>
          <span>已发布</span>
        </button>
        <button type="button" class="stat" @click="go('/home/me/library')">
          <strong>{{ libraryCount }}</strong>
          <span>视频库</span>
        </button>
        <button type="button" class="stat" @click="go('/home/me/profile')">
          <strong>{{ genderLabel(profile?.gender).slice(0, 1) }}</strong>
          <span>资料</span>
        </button>
      </div>
    </section>

    <section class="grid">
      <button
        v-for="tile in tiles"
        :key="tile.path"
        type="button"
        class="tile"
        :class="`tile--${tile.tone}`"
        @click="go(tile.path)"
      >
        <strong>{{ tile.title }}</strong>
        <span>{{ tile.desc }}</span>
      </button>
    </section>

    <button type="button" class="logout" @click="logout">退出登录</button>
  </div>
</template>

<style scoped>
.me {
  width: min(1080px, 100%);
  margin: 0 auto;
  animation: fade 0.35s ease both;
}

.banner {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  min-height: 240px;
  background: #120e16;
  color: #fff;
  margin-bottom: 18px;
}

.banner__shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(10, 18, 18, 0.15), rgba(10, 18, 18, 0.78)),
    linear-gradient(90deg, rgba(10, 18, 18, 0.45), transparent 55%);
  pointer-events: none;
}

.banner__state,
.banner__body {
  position: relative;
  z-index: 2;
}

.banner__state {
  min-height: 220px;
  display: grid;
  place-content: center;
  gap: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.banner__state button {
  height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  cursor: pointer;
}

.banner__body {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 28px 28px 18px;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  padding: 0;
  background: var(--brand-gradient);
  color: #fff;
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(255, 45, 122, 0.35);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.who h1 {
  margin: 0;
  font-family: var(--display);
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.who p {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}

.bio {
  max-width: 36em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.publish {
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-brand);
}

.stats {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 0 20px 20px;
}

.stat {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 12px 10px;
  color: #fff;
  cursor: pointer;
  text-align: center;
}

.stat strong {
  display: block;
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
  white-space: nowrap;
}

.stat span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.tile {
  appearance: none;
  border: 0;
  text-align: left;
  border-radius: 18px;
  padding: 18px 16px;
  min-height: 108px;
  cursor: pointer;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  transition: transform 0.16s ease, filter 0.16s ease;
}

.tile:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
}

.tile--a {
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.22), transparent 40%),
    linear-gradient(145deg, var(--brand), var(--brand-deep));
}

.tile--b {
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.18), transparent 40%),
    linear-gradient(145deg, var(--accent-warm), #e53935);
}

.tile--c {
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.16), transparent 40%),
    linear-gradient(145deg, var(--brand-cyan), var(--brand-purple));
}

.tile strong {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.tile span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout {
  width: 100%;
  height: 46px;
  border: 1px solid rgba(255, 45, 122, 0.25);
  border-radius: 999px;
  background: #fff;
  color: var(--brand);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .banner__body {
    grid-template-columns: auto 1fr;
    padding: 24px 18px 14px;
  }

  .publish {
    grid-column: 1 / -1;
    width: 100%;
  }
}

@media (max-width: 560px) {
  .who h1 {
    white-space: normal;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
  }

  .tile {
    min-height: 96px;
  }
}
</style>
