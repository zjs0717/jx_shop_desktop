<script setup lang="ts">
import { computed } from 'vue'
import type { ShareItem } from '@/types/dashboard'

const props = defineProps<{
  data: ShareItem[]
  activeName?: string | null
}>()

const emit = defineEmits<{
  select: [name: string | null]
}>()

const colors = ['#2dd4bf', '#38bdf8', '#f59e0b', '#a78bfa']

const slices = computed(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0) || 1
  const r = 54
  const cx = 70
  const cy = 70
  let start = -Math.PI / 2

  return props.data.map((item, index) => {
    const angle = (item.value / total) * Math.PI * 2
    const end = start + angle
    const large = angle > Math.PI ? 1 : 0
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    start = end
    const active = !props.activeName || props.activeName === item.name
    return {
      ...item,
      d,
      color: colors[index % colors.length],
      percent: Math.round((item.value / total) * 100),
      active,
    }
  })
})

function onSelect(name: string): void {
  emit('select', props.activeName === name ? null : name)
}
</script>

<template>
  <div class="donut">
    <svg viewBox="0 0 140 140" class="donut__svg" role="img" aria-label="流量来源占比">
      <circle cx="70" cy="70" r="54" fill="rgba(148,163,184,0.08)" />
      <path
        v-for="s in slices"
        :key="s.name"
        :d="s.d"
        :fill="s.color"
        :opacity="s.active ? 0.95 : 0.22"
        class="donut__slice"
        @click="onSelect(s.name)"
      />
      <circle cx="70" cy="70" r="30" fill="#0b1220" />
      <text x="70" y="68" text-anchor="middle" class="donut__center-label">来源</text>
      <text x="70" y="86" text-anchor="middle" class="donut__center-value">占比</text>
    </svg>
    <ul class="donut__legend">
      <li
        v-for="s in slices"
        :key="s.name"
        :class="{ 'is-dim': activeName && activeName !== s.name, 'is-on': activeName === s.name }"
        @click="onSelect(s.name)"
      >
        <i :style="{ background: s.color }" />
        <span>{{ s.name }}</span>
        <strong>{{ s.percent }}%</strong>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: center;
  height: 100%;
}

.donut__svg {
  width: 140px;
  height: 140px;
}

.donut__slice {
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
  transform-origin: 70px 70px;
}

.donut__slice:hover {
  filter: brightness(1.15);
}

.donut__center-label {
  fill: #94a3b8;
  font-size: 11px;
}

.donut__center-value {
  fill: #e2e8f0;
  font-size: 13px;
  font-weight: 650;
}

.donut__legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.donut__legend li {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 6px;
  border: 1px solid transparent;
  transition: border-color 0.15s, background 0.15s, opacity 0.15s;
}

.donut__legend li:hover,
.donut__legend li.is-on {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(14, 116, 144, 0.15);
  color: #e0f2fe;
}

.donut__legend li.is-dim {
  opacity: 0.4;
}

.donut__legend i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.donut__legend strong {
  color: #e2e8f0;
  font-weight: 600;
}
</style>
