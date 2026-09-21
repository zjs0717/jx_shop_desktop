<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fetchDashboardOverview } from '@/api/dashboard'
import type { DashboardData, DashboardModule } from '@/types/dashboard'
import { formatMoney, formatNumber, formatUpdatedAt, moduleLabel } from './format'
import TrafficLineChart from './TrafficLineChart.vue'
import SourceDonut from './SourceDonut.vue'
import ChinaMap from './ChinaMap.vue'
import ScreenPanel from './ScreenPanel.vue'

const POLL_OPTIONS = [
  { label: '关闭', value: 0 },
  { label: '5 秒', value: 5000 },
  { label: '10 秒', value: 10000 },
  { label: '30 秒', value: 30000 },
] as const

const screenRef = ref<HTMLElement | null>(null)
const data = ref<DashboardData | null>(null)
const loading = ref(false)
const error = ref('')
const pollMs = ref(5000)
const ticking = ref(false)
const isFullscreen = ref(false)
const nowText = ref('')
const focusModule = ref<DashboardModule | null>(null)
const focusCity = ref<string | null>(null)
const focusSource = ref<string | null>(null)
const focusRank = ref<string | null>(null)
const focusEvent = ref<string | null>(null)
const focusKpi = ref<string | null>(null)

let timer: ReturnType<typeof setInterval> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null

async function load(): Promise<void> {
  if (ticking.value) return
  ticking.value = true
  loading.value = !data.value
  error.value = ''
  try {
    data.value = await fetchDashboardOverview()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '数据加载失败'
  } finally {
    loading.value = false
    ticking.value = false
  }
}

function clearPoll(): void {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function setupPoll(): void {
  clearPoll()
  if (pollMs.value <= 0) return
  timer = setInterval(() => {
    void load()
  }, pollMs.value)
}

function onPollChange(): void {
  setupPoll()
  void load()
}

function tickClock(): void {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  nowText.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

async function toggleFullscreen(): Promise<void> {
  const el = screenRef.value
  if (!el) return
  try {
    if (!document.fullscreenElement) {
      await el.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  } catch {
    error.value = '当前浏览器不支持全屏，请手动按 F11'
  }
}

function onFullscreenChange(): void {
  isFullscreen.value = document.fullscreenElement === screenRef.value
}

const kpis = computed(() => {
  if (!data.value) return []
  const o = data.value.overview
  return [
    { key: 'online', label: '实时在线', value: formatNumber(o.onlineUsers), tip: 'ACTIVE', module: null as DashboardModule | null },
    { key: 'pv', label: '今日 PV', value: formatNumber(o.todayPV), tip: 'PAGE VIEW', module: null },
    { key: 'uv', label: '今日 UV', value: formatNumber(o.todayUV), tip: 'UNIQUE', module: null },
    { key: 'gmv', label: '今日 GMV', value: formatMoney(o.gmv), tip: 'GMV', module: 'shop' as DashboardModule },
  ]
})

const regions = computed(() => data.value?.regions ?? [])

const filteredRank = computed(() => {
  if (!data.value) return []
  if (!focusModule.value) return data.value.topRank
  return data.value.topRank.filter((item) => item.module === focusModule.value)
})

const filteredEvents = computed(() => {
  if (!data.value) return []
  if (!focusModule.value) return data.value.realtimeEvents
  return data.value.realtimeEvents.filter((item) => item.module === focusModule.value)
})

function toggleModule(mod: DashboardModule): void {
  focusModule.value = focusModule.value === mod ? null : mod
}

function onSelectCity(name: string | null): void {
  focusCity.value = name
}

function onSelectModule(mod: DashboardModule | null): void {
  focusModule.value = mod
}

function onSelectSource(name: string | null): void {
  focusSource.value = name
}

function onSelectKpi(key: string, mod: DashboardModule | null): void {
  focusKpi.value = focusKpi.value === key ? null : key
  if (mod) toggleModule(mod)
}

function onSelectRank(name: string, mod: DashboardModule): void {
  focusRank.value = focusRank.value === name ? null : name
  focusModule.value = focusRank.value ? mod : focusModule.value
}

function onSelectEvent(id: string, mod: DashboardModule): void {
  focusEvent.value = focusEvent.value === id ? null : id
  if (focusEvent.value) focusModule.value = mod
}

onMounted(() => {
  void load()
  setupPoll()
  tickClock()
  clockTimer = setInterval(tickClock, 1000)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  clearPoll()
  if (clockTimer) clearInterval(clockTimer)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (document.fullscreenElement === screenRef.value) {
    void document.exitFullscreen()
  }
})
</script>

<template>
  <section
    ref="screenRef"
    class="screen"
    :class="{ 'is-fullscreen': isFullscreen }"
  >
    <div class="screen__bg" aria-hidden="true">
      <div class="screen__grid" />
      <div class="screen__beam screen__beam--l" />
      <div class="screen__beam screen__beam--r" />
    </div>

    <header class="screen__header">
      <div class="screen__side screen__side--left">
        <span class="screen__clock">{{ nowText }}</span>
        <span class="screen__sync" v-if="data">同步 {{ formatUpdatedAt(data.updatedAt) }}</span>
      </div>
      <div class="screen__header-main">
        <div class="screen__title-wrap">
          <p class="screen__eyebrow">LEXIANG · REALTIME COMMAND</p>
          <h2 class="screen__title">运营可视化数据大屏</h2>
        </div>
      </div>
      <div class="screen__actions">
        <label class="screen__poll">
          <span>轮询</span>
          <select v-model.number="pollMs" @change="onPollChange">
            <option v-for="opt in POLL_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </label>
        <button type="button" class="screen__btn" :disabled="ticking" @click="load">刷新</button>
        <button type="button" class="screen__btn screen__btn--primary" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '最大化' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="screen__error">{{ error }}</p>
    <p v-else-if="loading" class="screen__loading">正在同步分析数据…</p>

    <template v-if="data">
      <div v-if="focusModule || focusCity || focusSource" class="screen__filter">
        <span>当前聚焦：</span>
        <strong v-if="focusModule">{{ moduleLabel[focusModule] }}</strong>
        <strong v-if="focusCity">{{ focusCity }}</strong>
        <strong v-if="focusSource">{{ focusSource }}</strong>
        <button
          type="button"
          class="screen__btn"
          @click="focusModule = null; focusCity = null; focusSource = null; focusRank = null; focusEvent = null; focusKpi = null"
        >
          清除筛选
        </button>
      </div>

      <div class="kpi-row">
        <article
          v-for="item in kpis"
          :key="item.key"
          class="kpi"
          :class="{ 'is-active': focusKpi === item.key }"
          @click="onSelectKpi(item.key, item.module)"
        >
          <span class="kpi__tip">{{ item.tip }}</span>
          <strong class="kpi__value">{{ item.value }}</strong>
          <span class="kpi__label">{{ item.label }}</span>
        </article>
      </div>

      <div class="screen__body">
        <div class="col col--left">
          <ScreenPanel title="业务模块看板">
            <div class="module-cards">
              <button
                type="button"
                class="module-card module-card--shop"
                :class="{ 'is-active': focusModule === 'shop', 'is-dim': focusModule && focusModule !== 'shop' }"
                @click="toggleModule('shop')"
              >
                <h4>购物</h4>
                <p><span>GMV</span><strong>{{ formatMoney(data.modules.shop.gmv) }}</strong></p>
                <p><span>订单</span><strong>{{ formatNumber(data.modules.shop.orders) }}</strong></p>
                <p><span>转化</span><strong>{{ data.modules.shop.conversionRate }}%</strong></p>
              </button>
              <button
                type="button"
                class="module-card module-card--video"
                :class="{ 'is-active': focusModule === 'video', 'is-dim': focusModule && focusModule !== 'video' }"
                @click="toggleModule('video')"
              >
                <h4>短视频</h4>
                <p><span>播放</span><strong>{{ formatNumber(data.modules.video.plays) }}</strong></p>
                <p><span>点赞</span><strong>{{ formatNumber(data.modules.video.likes) }}</strong></p>
                <p><span>人均</span><strong>{{ data.modules.video.avgWatchSec }}s</strong></p>
              </button>
              <button
                type="button"
                class="module-card module-card--live"
                :class="{ 'is-active': focusModule === 'live', 'is-dim': focusModule && focusModule !== 'live' }"
                @click="toggleModule('live')"
              >
                <h4>直播</h4>
                <p><span>观看</span><strong>{{ formatNumber(data.modules.live.viewers) }}</strong></p>
                <p><span>打赏</span><strong>{{ formatMoney(data.modules.live.gifts) }}</strong></p>
                <p><span>互动</span><strong>{{ data.modules.live.interactionRate }}%</strong></p>
              </button>
            </div>
          </ScreenPanel>

          <ScreenPanel title="流量趋势 · 购物 / 短视频 / 直播">
            <TrafficLineChart
              :data="data.trafficTrend"
              :focus-module="focusModule"
              @select-module="onSelectModule"
            />
          </ScreenPanel>
        </div>

        <div class="col col--center">
          <ScreenPanel title="全国流量热力地图">
            <template #extra>
              <span class="screen__sync">更新 {{ formatUpdatedAt(data.updatedAt) }}</span>
            </template>
            <ChinaMap
              :regions="regions"
              :focus-city="focusCity"
              :focus-module="focusModule"
              @select-city="onSelectCity"
              @select-module="onSelectModule"
            />
          </ScreenPanel>
        </div>

        <div class="col col--right">
          <ScreenPanel title="流量来源占比">
            <SourceDonut
              :data="data.sourceShare"
              :active-name="focusSource"
              @select="onSelectSource"
            />
          </ScreenPanel>

          <ScreenPanel title="热度排行">
            <ol class="rank screen-scroll">
              <li
                v-for="(item, index) in filteredRank"
                :key="`${item.module}-${item.name}`"
                :class="{ 'is-active': focusRank === item.name, 'is-dim': focusModule && item.module !== focusModule }"
                @click="onSelectRank(item.name, item.module)"
              >
                <span class="rank__idx">{{ index + 1 }}</span>
                <div class="rank__meta">
                  <strong>{{ item.name }}</strong>
                  <span>{{ moduleLabel[item.module] }}</span>
                </div>
                <em>{{ formatNumber(item.value) }}</em>
              </li>
            </ol>
          </ScreenPanel>

          <ScreenPanel title="实时动态">
            <ul class="events screen-scroll">
              <li
                v-for="event in filteredEvents"
                :key="event.id"
                :class="{ 'is-active': focusEvent === event.id }"
                @click="onSelectEvent(event.id, event.module)"
              >
                <span class="events__time">{{ event.time }}</span>
                <span class="events__tag" :class="`is-${event.module}`">{{ moduleLabel[event.module] }}</span>
                <span class="events__msg">{{ event.message }}</span>
              </li>
            </ul>
          </ScreenPanel>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.screen {
  --cyan: #22d3ee;
  --blue: #38bdf8;
  --panel: rgba(8, 24, 42, 0.72);
  --line: rgba(56, 189, 248, 0.22);
  --text: #e2e8f0;
  --muted: #7dd3fc;

  position: relative;
  isolation: isolate;
  min-height: 100%;
  height: 100%;
  padding: 14px 16px 16px;
  color: var(--text);
  overflow: hidden;
  background: #020b16;
  border: 1px solid rgba(56, 189, 248, 0.2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.screen.is-fullscreen {
  min-height: 100%;
  width: 100%;
  height: 100%;
  border: none;
  padding: 16px 20px 18px;
  gap: 14px;
}

.screen__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(14, 165, 233, 0.28), transparent 60%),
    radial-gradient(ellipse 40% 35% at 10% 80%, rgba(45, 212, 191, 0.12), transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 75%, rgba(56, 189, 248, 0.12), transparent 55%),
    linear-gradient(180deg, #031525 0%, #020b16 55%, #010913 100%);
}

.screen__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 35%, transparent 85%);
  opacity: 0.55;
}

.screen__beam {
  position: absolute;
  top: 64px;
  width: 28%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.75), transparent);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.55);
}

.screen__beam--l { left: 0; }
.screen__beam--r { right: 0; }

.screen__header {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 0 4px 8px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.18);
  background:
    linear-gradient(180deg, rgba(14, 116, 144, 0.12), transparent);
}

.screen__side {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.screen__side--left {
  align-items: flex-start;
}

.screen__header-main {
  text-align: center;
  position: relative;
  padding: 0 28px;
}

.screen__header-main::before,
.screen__header-main::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 56px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8));
}

.screen__header-main::before {
  left: 0;
  transform: translateY(-50%);
}

.screen__header-main::after {
  right: 0;
  transform: translateY(-50%) scaleX(-1);
}

.screen__title-wrap {
  padding: 6px 18px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  background: linear-gradient(180deg, rgba(8, 47, 73, 0.55), rgba(2, 12, 27, 0.35));
  box-shadow: 0 0 24px rgba(14, 165, 233, 0.12);
}

.screen__eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #67e8f9;
}

.screen__title {
  margin: 0;
  font-size: clamp(20px, 2.2vw, 30px);
  font-weight: 760;
  letter-spacing: 0.14em;
  color: #f0f9ff;
  text-shadow: 0 0 24px rgba(56, 189, 248, 0.35);
}

.screen__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.screen__clock {
  font-size: 13px;
  color: #7dd3fc;
  font-variant-numeric: tabular-nums;
}

.screen__poll {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.screen__poll select {
  height: 32px;
  border: 1px solid var(--line);
  background: rgba(2, 12, 27, 0.85);
  color: #e2e8f0;
  padding: 0 8px;
  font: inherit;
}

.screen__btn {
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--line);
  background: rgba(8, 28, 48, 0.9);
  color: #bae6fd;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.screen__btn:hover {
  border-color: rgba(34, 211, 238, 0.55);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.2);
}

.screen__btn--primary {
  border-color: rgba(34, 211, 238, 0.55);
  background: linear-gradient(180deg, rgba(14, 116, 144, 0.55), rgba(8, 47, 73, 0.85));
  color: #ecfeff;
}

.screen__btn:disabled {
  opacity: 0.55;
  cursor: wait;
}

.screen__sync {
  font-size: 11px;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.screen__error,
.screen__loading {
  margin: 0;
  font-size: 13px;
}

.screen__error { color: #fca5a5; }
.screen__loading { color: #94a3b8; }

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.screen__filter {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #94a3b8;
  padding: 6px 10px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  background: rgba(8, 47, 73, 0.35);
}

.screen__filter strong {
  color: #67e8f9;
  font-weight: 650;
}

.kpi {
  position: relative;
  padding: 12px 14px 14px;
  background: linear-gradient(180deg, rgba(12, 40, 64, 0.8), rgba(6, 20, 36, 0.7));
  border: 1px solid rgba(56, 189, 248, 0.22);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.kpi:hover,
.kpi.is-active {
  border-color: rgba(34, 211, 238, 0.55);
  box-shadow: 0 0 18px rgba(34, 211, 238, 0.18);
  transform: translateY(-1px);
}

.kpi::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 3px;
  background: linear-gradient(180deg, #22d3ee, #0284c7);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.6);
}

.kpi__tip {
  font-size: 10px;
  letter-spacing: 0.14em;
  color: #38bdf8;
}

.kpi__value {
  display: block;
  margin: 4px 0 2px;
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 760;
  letter-spacing: -0.3px;
  color: #f8fafc;
  text-shadow: 0 0 18px rgba(125, 211, 252, 0.25);
  font-variant-numeric: tabular-nums;
}

.kpi__label {
  font-size: 12px;
  color: #94a3b8;
}

.screen__body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.35fr) minmax(260px, 0.9fr);
  gap: 12px;
  align-items: stretch;
}

.col {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.col--center {
  min-height: 0;
}

.col--left :deep(.frame:first-child) {
  flex: 0 0 auto;
}

.col--left :deep(.frame:last-child),
.col--center :deep(.frame) {
  flex: 1;
  min-height: 0;
}

.col--right :deep(.frame) {
  flex: 1;
  min-height: 0;
}

.col--right :deep(.frame:first-child) {
  flex: 0.9;
}

.col--right :deep(.frame:nth-child(2)),
.col--right :deep(.frame:last-child) {
  flex: 1.1;
}

.module-cards {
  display: grid;
  gap: 8px;
}

.module-card {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(2, 12, 27, 0.35);
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, opacity 0.15s, transform 0.15s;
}

.module-card:hover,
.module-card.is-active {
  border-color: rgba(56, 189, 248, 0.45);
  background: rgba(14, 116, 144, 0.18);
  transform: translateX(2px);
}

.module-card.is-dim {
  opacity: 0.4;
}

.module-card h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #e2e8f0;
}

.module-card p {
  margin: 0 0 4px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.module-card strong {
  color: #f1f5f9;
  font-variant-numeric: tabular-nums;
}

.module-card--shop { border-left: 2px solid #2dd4bf; }
.module-card--video { border-left: 2px solid #38bdf8; }
.module-card--live { border-left: 2px solid #f59e0b; }

.rank,
.events {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
  overflow: auto;
}

.rank {
  max-height: none;
}

.events {
  max-height: none;
}

.rank li {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 4px 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}

.rank li:hover,
.rank li.is-active {
  background: rgba(14, 116, 144, 0.16);
  border-color: rgba(56, 189, 248, 0.3);
}

.rank li.is-dim {
  opacity: 0.35;
}

.rank__idx {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #67e8f9;
  background: rgba(34, 211, 238, 0.12);
}

.rank__meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.rank__meta strong {
  font-size: 12px;
  color: #f1f5f9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank__meta span {
  font-size: 10px;
  color: #64748b;
}

.rank em {
  font-style: normal;
  font-size: 12px;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.events li {
  display: grid;
  grid-template-columns: 58px auto 1fr;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  padding: 4px 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.events li:hover,
.events li.is-active {
  background: rgba(14, 116, 144, 0.16);
  border-color: rgba(56, 189, 248, 0.3);
}

.events__time {
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.events__tag {
  min-width: 42px;
  text-align: center;
  padding: 1px 6px;
  font-size: 10px;
  background: rgba(148, 163, 184, 0.12);
}

.events__tag.is-shop { color: #5eead4; background: rgba(45, 212, 191, 0.12); }
.events__tag.is-video { color: #7dd3fc; background: rgba(56, 189, 248, 0.12); }
.events__tag.is-live { color: #fbbf24; background: rgba(245, 158, 11, 0.12); }

.events__msg {
  color: #cbd5e1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .screen__header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .screen__side--left,
  .screen__actions {
    align-items: center;
    justify-content: center;
  }

  .screen__header-main::before,
  .screen__header-main::after {
    display: none;
  }

  .screen__body,
  .kpi-row {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 大屏科技风滚动条（非 scoped，确保列表生效） */
.screen-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(34, 211, 238, 0.55) rgba(8, 24, 42, 0.75);
}

.screen-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.screen-scroll::-webkit-scrollbar-track {
  background: rgba(8, 24, 42, 0.75);
  border-radius: 999px;
}

.screen-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.75), rgba(14, 116, 144, 0.85));
  border-radius: 999px;
  border: 1px solid rgba(125, 211, 252, 0.25);
}

.screen-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(103, 232, 249, 0.9), rgba(34, 211, 238, 0.85));
}

.screen-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
