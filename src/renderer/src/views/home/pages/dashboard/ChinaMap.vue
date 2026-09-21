<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { DashboardModule, RegionPoint } from '@/types/dashboard'
import { formatNumber, moduleLabel } from './format'

const props = defineProps<{
  regions: RegionPoint[]
  focusCity?: string | null
  focusModule?: DashboardModule | null
}>()

const emit = defineEmits<{
  selectCity: [name: string | null]
  selectModule: [module: DashboardModule | null]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
const mapReady = ref(false)
const mapError = ref('')
const active = ref<string | null>(null)

let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const colors: Record<string, string> = {
  shop: '#2dd4bf',
  video: '#38bdf8',
  live: '#f59e0b',
}

const PROVINCE_NAME_MAP: Record<string, string> = {
  北京: '北京市',
  天津: '天津市',
  上海: '上海市',
  重庆: '重庆市',
  河北: '河北省',
  山西: '山西省',
  辽宁: '辽宁省',
  吉林: '吉林省',
  黑龙江: '黑龙江省',
  江苏: '江苏省',
  浙江: '浙江省',
  安徽: '安徽省',
  福建: '福建省',
  江西: '江西省',
  山东: '山东省',
  河南: '河南省',
  湖北: '湖北省',
  湖南: '湖南省',
  广东: '广东省',
  海南: '海南省',
  四川: '四川省',
  贵州: '贵州省',
  云南: '云南省',
  陕西: '陕西省',
  甘肃: '甘肃省',
  青海: '青海省',
  台湾: '台湾省',
  内蒙古: '内蒙古自治区',
  广西: '广西壮族自治区',
  西藏: '西藏自治区',
  宁夏: '宁夏回族自治区',
  新疆: '新疆维吾尔自治区',
  香港: '香港特别行政区',
  澳门: '澳门特别行政区',
}

function toMapProvinceName(name: string): string {
  return PROVINCE_NAME_MAP[name] || name
}

const filteredRegions = computed(() => {
  if (!props.focusModule) return props.regions
  return props.regions.filter((r) => r.module === props.focusModule)
})

const ranked = computed(() =>
  [...filteredRegions.value].sort((a, b) => b.value - a.value).slice(0, 8),
)

const selected = computed(() => {
  const name = props.focusCity || active.value
  return props.regions.find((r) => r.name === name) || null
})

function provinceHeatData() {
  const map = new Map<string, number>()
  for (const r of filteredRegions.value) {
    const key = toMapProvinceName(r.province || r.name)
    map.set(key, (map.get(key) || 0) + r.value)
  }
  return [...map.entries()].map(([name, value]) => ({ name, value }))
}

function scatterData() {
  return filteredRegions.value.map((r) => ({
    name: r.name,
    value: [r.lng, r.lat, r.value],
    module: r.module,
    province: r.province,
    itemStyle: {
      color: colors[r.module] || '#38bdf8',
      shadowBlur: props.focusCity === r.name ? 22 : 10,
      shadowColor: colors[r.module] || '#38bdf8',
    },
    symbolSize: props.focusCity === r.name ? 22 : 12 + Math.min(14, r.value / 1200),
  }))
}

function lineData() {
  const top = [...filteredRegions.value].sort((a, b) => b.value - a.value).slice(0, 5)
  if (top.length < 2) return []
  const hub = top[0]
  return top.slice(1).map((city) => ({
    coords: [
      [hub.lng, hub.lat],
      [city.lng, city.lat],
    ],
    lineStyle: { color: colors[city.module] || '#38bdf8' },
  }))
}

function buildOption(): echarts.EChartsOption {
  const heat = provinceHeatData()
  const max = Math.max(...heat.map((h) => h.value), 1)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(2,12,27,0.92)',
      borderColor: 'rgba(56,189,248,0.45)',
      textStyle: { color: '#e0f2fe', fontSize: 12 },
      formatter: (params: unknown) => {
        const p = params as {
          seriesType?: string
          name?: string
          value?: number | number[]
          data?: { module?: string; province?: string }
        }
        if (p.seriesType === 'effectScatter' || p.seriesType === 'scatter') {
          const val = Array.isArray(p.value) ? Number(p.value[2]) : Number(p.value)
          const mod = p.data?.module ? moduleLabel[p.data.module] : ''
          return `<strong>${p.name}</strong><br/>${mod}热度：${formatNumber(val)}`
        }
        if (p.seriesType === 'map') {
          return `<strong>${p.name}</strong><br/>区域热力：${formatNumber(Number(p.value) || 0)}`
        }
        return p.name || ''
      },
    },
    geo: {
      map: 'china',
      roam: true,
      scaleLimit: { min: 0.8, max: 8 },
      zoom: 1.15,
      center: [104.1, 35.5],
      itemStyle: {
        areaColor: '#0a2740',
        borderColor: '#38bdf8',
        borderWidth: 1,
        shadowColor: 'rgba(56,189,248,0.25)',
        shadowBlur: 12,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#12507a',
          borderColor: '#67e8f9',
          borderWidth: 1.5,
        },
        label: { show: true, color: '#e0f2fe', fontSize: 11 },
      },
      select: {
        itemStyle: {
          areaColor: '#0e7490',
        },
      },
      label: { show: false },
    },
    visualMap: {
      min: 0,
      max,
      right: 8,
      bottom: 12,
      calculable: true,
      text: ['高', '低'],
      textStyle: { color: '#7dd3fc', fontSize: 10 },
      inRange: {
        color: ['#082f49', '#0e7490', '#22d3ee', '#fbbf24'],
      },
      seriesIndex: 0,
    },
    series: [
      {
        name: '省份热力',
        type: 'map',
        map: 'china',
        geoIndex: 0,
        data: heat,
        selectedMode: false,
      },
      {
        name: '城市热力',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3.2,
          period: 3,
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#bae6fd',
          fontSize: 11,
          textBorderColor: 'rgba(2,12,27,0.8)',
          textBorderWidth: 2,
        },
        data: scatterData(),
      },
      {
        name: '流量飞线',
        type: 'lines',
        coordinateSystem: 'geo',
        zlevel: 1,
        effect: {
          show: true,
          period: 4,
          trailLength: 0.45,
          symbol: 'arrow',
          symbolSize: 5,
        },
        lineStyle: {
          width: 1.2,
          opacity: 0.55,
          curveness: 0.25,
        },
        data: lineData(),
      },
    ],
  }
}

function renderChart(): void {
  if (!chart || !mapReady.value) return
  chart.setOption(buildOption(), { notMerge: true })
}

function onCityClick(name: string): void {
  const next = props.focusCity === name ? null : name
  active.value = next
  emit('selectCity', next)
  const city = props.regions.find((r) => r.name === name)
  if (city && next) {
    emit('selectModule', city.module)
  }
}

async function initMap(): Promise<void> {
  if (!chartRef.value) return
  try {
    const res = await fetch('/geo/china.json')
    if (!res.ok) throw new Error('地图数据加载失败')
    const geoJson = await res.json()
    echarts.registerMap('china', geoJson as Parameters<typeof echarts.registerMap>[1])
    chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
    mapReady.value = true
    renderChart()

    chart.on('click', (params) => {
      if (params.seriesType === 'effectScatter' || params.seriesType === 'scatter') {
        onCityClick(String(params.name))
        return
      }
      if (params.seriesType === 'map') {
        const province = String(params.name).replace(/(省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区)$/g, '')
        const city = props.regions.find((r) => r.province === province || r.name === province)
        if (city) onCityClick(city.name)
      }
    })

    resizeObserver = new ResizeObserver(() => chart?.resize())
    resizeObserver.observe(chartRef.value)
  } catch (err) {
    mapError.value = err instanceof Error ? err.message : '地图初始化失败'
  }
}

watch(
  () => [props.regions, props.focusCity, props.focusModule] as const,
  () => renderChart(),
  { deep: true },
)

onMounted(() => {
  void initMap()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div class="map">
    <div class="map__stage">
      <div ref="chartRef" class="map__chart" />
      <p v-if="mapError" class="map__error">{{ mapError }}</p>
      <div class="map__hint">滚轮缩放 · 拖拽平移 · 点击城市/省份</div>
      <div v-if="selected" class="map__tooltip">
        <strong>{{ selected.name }}</strong>
        <span>{{ selected.province }} · {{ moduleLabel[selected.module] }}</span>
        <em>{{ formatNumber(selected.value) }}</em>
        <button type="button" class="map__clear" @click="onCityClick(selected.name)">取消选中</button>
      </div>
    </div>

    <aside class="map__rank screen-scroll">
      <p class="map__rank-title">城市热力 TOP</p>
      <ol>
        <li
          v-for="(item, idx) in ranked"
          :key="item.name"
          :class="{ 'is-active': (focusCity || active) === item.name }"
          @click="onCityClick(item.name)"
        >
          <span class="idx">{{ idx + 1 }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="mod" :class="`is-${item.module}`">{{ moduleLabel[item.module] }}</span>
          <strong>{{ formatNumber(item.value) }}</strong>
        </li>
      </ol>
    </aside>
  </div>
</template>

<style scoped>
.map {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  gap: 12px;
  align-items: stretch;
}

.map__stage {
  position: relative;
  height: 100%;
  min-height: 0;
  border: 1px solid rgba(56, 189, 248, 0.12);
  background:
    radial-gradient(circle at 50% 45%, rgba(14, 165, 233, 0.1), transparent 55%),
    linear-gradient(180deg, rgba(8, 20, 36, 0.35), rgba(4, 12, 24, 0.65));
  overflow: hidden;
}

.map__chart {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.map__error {
  position: absolute;
  inset: 0;
  margin: 0;
  display: grid;
  place-items: center;
  color: #fca5a5;
  font-size: 13px;
  background: rgba(2, 12, 27, 0.7);
}

.map__hint {
  position: absolute;
  left: 12px;
  top: 10px;
  font-size: 11px;
  color: rgba(125, 211, 252, 0.75);
  pointer-events: none;
  letter-spacing: 0.04em;
}

.map__tooltip {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  background: rgba(2, 12, 27, 0.88);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #e0f2fe;
  font-size: 12px;
  min-width: 132px;
  animation: fadeIn 0.2s ease;
}

.map__tooltip strong {
  font-size: 14px;
}

.map__tooltip em {
  font-style: normal;
  color: #67e8f9;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.map__clear {
  margin-top: 6px;
  height: 26px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  background: rgba(8, 47, 73, 0.7);
  color: #bae6fd;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.map__rank {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 2px 4px 0;
  height: 100%;
  min-height: 0;
  overflow: auto;
  align-self: stretch;
}

.map__rank-title {
  margin: 0;
  flex-shrink: 0;
  font-size: 12px;
  color: #7dd3fc;
  letter-spacing: 0.06em;
}

.map__rank ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.map__rank li {
  display: grid;
  grid-template-columns: 18px 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 6px;
  row-gap: 2px;
  font-size: 12px;
  color: #cbd5e1;
  padding: 6px 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
}

.map__rank li:hover,
.map__rank li.is-active {
  background: rgba(14, 116, 144, 0.18);
  border-color: rgba(56, 189, 248, 0.35);
  transform: translateX(2px);
}

.map__rank .idx {
  grid-row: 1 / span 2;
  align-self: center;
  color: #67e8f9;
  font-weight: 700;
}

.map__rank .name {
  font-weight: 600;
  color: #f1f5f9;
}

.map__rank .mod {
  grid-column: 2;
  font-size: 10px;
  color: #64748b;
}

.map__rank .mod.is-shop { color: #5eead4; }
.map__rank .mod.is-video { color: #7dd3fc; }
.map__rank .mod.is-live { color: #fbbf24; }

.map__rank strong {
  grid-column: 3;
  grid-row: 1 / span 2;
  align-self: center;
  font-variant-numeric: tabular-nums;
  color: #e2e8f0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1100px) {
  .map {
    grid-template-columns: 1fr;
  }
}
</style>
