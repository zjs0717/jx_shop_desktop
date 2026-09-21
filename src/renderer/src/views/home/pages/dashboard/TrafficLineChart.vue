<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TrafficPoint, DashboardModule } from '@/types/dashboard'

const props = defineProps<{
  data: TrafficPoint[]
  focusModule?: DashboardModule | null
}>()

const emit = defineEmits<{
  selectModule: [module: DashboardModule | null]
}>()

const width = 640
const height = 220
const pad = { top: 16, right: 16, bottom: 28, left: 40 }
const hoverIndex = ref<number | null>(null)

const series = [
  { key: 'shop' as const, color: '#2dd4bf', label: '购物' },
  { key: 'video' as const, color: '#38bdf8', label: '短视频' },
  { key: 'live' as const, color: '#f59e0b', label: '直播' },
]

const chart = computed(() => {
  const points = props.data
  if (!points.length) {
    return {
      paths: [] as { key: string; color: string; d: string; area: string; active: boolean }[],
      ticks: [] as string[],
      yTicks: [] as number[],
      hover: null as null | { x: number; items: { label: string; color: string; value: number }[]; time: string },
    }
  }

  const values = points.flatMap((p) => [p.shop, p.video, p.live])
  const max = Math.max(...values, 1)
  const min = 0
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const xAt = (i: number) => pad.left + (i / Math.max(points.length - 1, 1)) * innerW
  const yAt = (v: number) => pad.top + innerH - ((v - min) / (max - min)) * innerH

  const paths = series.map((s) => {
    const active = !props.focusModule || props.focusModule === s.key
    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(p[s.key]).toFixed(1)}`)
      .join(' ')
    const area = `${line} L ${xAt(points.length - 1).toFixed(1)} ${(pad.top + innerH).toFixed(1)} L ${xAt(0).toFixed(1)} ${(pad.top + innerH).toFixed(1)} Z`
    return { key: s.key, color: s.color, d: line, area, active }
  })

  const tickIdx = [0, Math.floor((points.length - 1) / 2), points.length - 1]
  const ticks = tickIdx.map((i) => points[i]?.time ?? '')
  const yTicks = [max, Math.round(max / 2), 0]

  let hover = null as null | { x: number; items: { label: string; color: string; value: number }[]; time: string }
  if (hoverIndex.value != null && points[hoverIndex.value]) {
    const p = points[hoverIndex.value]
    hover = {
      x: xAt(hoverIndex.value),
      time: p.time,
      items: series.map((s) => ({ label: s.label, color: s.color, value: p[s.key] })),
    }
  }

  return { paths, ticks, yTicks, hover, xAt, pointCount: points.length }
})

function onMove(e: MouseEvent): void {
  const svg = e.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  const idx = Math.round(ratio * Math.max(props.data.length - 1, 0))
  hoverIndex.value = Math.max(0, Math.min(props.data.length - 1, idx))
}

function onLeave(): void {
  hoverIndex.value = null
}

function toggleSeries(key: DashboardModule): void {
  emit('selectModule', props.focusModule === key ? null : key)
}
</script>

<template>
  <div class="line-chart">
    <div class="line-chart__legend">
      <button
        v-for="s in series"
        :key="s.key"
        type="button"
        class="line-chart__legend-item"
        :class="{ 'is-dim': focusModule && focusModule !== s.key, 'is-on': focusModule === s.key }"
        @click="toggleSeries(s.key)"
      >
        <i :style="{ background: s.color }" />
        {{ s.label }}
      </button>
    </div>
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      class="line-chart__svg"
      role="img"
      aria-label="流量趋势"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <defs>
        <linearGradient v-for="s in series" :id="`fill-${s.key}`" :key="`g-${s.key}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="s.color" stop-opacity="0.28" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <line
        v-for="(_y, idx) in chart.yTicks"
        :key="`y-${idx}`"
        :x1="pad.left"
        :x2="width - pad.right"
        :y1="pad.top + ((height - pad.top - pad.bottom) * idx) / Math.max(chart.yTicks.length - 1, 1)"
        :y2="pad.top + ((height - pad.top - pad.bottom) * idx) / Math.max(chart.yTicks.length - 1, 1)"
        class="line-chart__grid"
      />
      <path
        v-for="p in chart.paths"
        :key="`a-${p.key}`"
        :d="p.area"
        :fill="`url(#fill-${p.key})`"
        :opacity="p.active ? 1 : 0.12"
      />
      <path
        v-for="p in chart.paths"
        :key="p.key"
        :d="p.d"
        fill="none"
        :stroke="p.color"
        :stroke-width="p.active && focusModule === p.key ? 3.2 : 2.4"
        :opacity="p.active ? 1 : 0.18"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <template v-if="chart.hover">
        <line
          :x1="chart.hover.x"
          :x2="chart.hover.x"
          :y1="pad.top"
          :y2="height - pad.bottom"
          class="line-chart__cross"
        />
        <foreignObject :x="Math.min(chart.hover.x + 8, width - 130)" y="18" width="120" height="78">
          <div class="line-chart__tip" xmlns="http://www.w3.org/1999/xhtml">
            <strong>{{ chart.hover.time }}</strong>
            <p v-for="item in chart.hover.items" :key="item.label">
              <i :style="{ background: item.color }" />
              {{ item.label }} {{ item.value }}
            </p>
          </div>
        </foreignObject>
      </template>
      <text
        v-for="(t, idx) in chart.ticks"
        :key="`x-${idx}`"
        :x="pad.left + ((width - pad.left - pad.right) * idx) / Math.max(chart.ticks.length - 1, 1)"
        :y="height - 8"
        class="line-chart__axis"
        text-anchor="middle"
      >
        {{ t }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.line-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.line-chart__legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.line-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  background: transparent;
  border: 1px solid transparent;
  padding: 4px 8px;
  cursor: pointer;
  font: inherit;
  transition: border-color 0.15s, color 0.15s, opacity 0.15s;
}

.line-chart__legend-item:hover,
.line-chart__legend-item.is-on {
  color: #e0f2fe;
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(14, 116, 144, 0.15);
}

.line-chart__legend-item.is-dim {
  opacity: 0.4;
}

.line-chart__legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.line-chart__svg {
  width: 100%;
  height: auto;
  flex: 1;
  min-height: 180px;
  cursor: crosshair;
}

.line-chart__grid {
  stroke: rgba(148, 163, 184, 0.16);
  stroke-width: 1;
}

.line-chart__cross {
  stroke: rgba(125, 211, 252, 0.55);
  stroke-width: 1;
  stroke-dasharray: 3 4;
}

.line-chart__axis {
  fill: #64748b;
  font-size: 11px;
}

.line-chart__tip {
  padding: 6px 8px;
  background: rgba(2, 12, 27, 0.92);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #e0f2fe;
  font-size: 11px;
  line-height: 1.45;
}

.line-chart__tip strong {
  display: block;
  margin-bottom: 4px;
  color: #7dd3fc;
}

.line-chart__tip p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.line-chart__tip i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  display: inline-block;
}
</style>
