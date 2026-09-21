<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuItem } from '@/types/menu'
import MenuIcon from './MenuIcon.vue'

const props = withDefaults(
  defineProps<{
    item: MenuItem
    level?: number
    collapsed?: boolean
  }>(),
  { level: 1, collapsed: false },
)

const route = useRoute()
const router = useRouter()

const level = computed(() => props.level ?? 1)
const hasChildren = computed(() => Boolean(props.item.children?.length))

const isActive = computed(() => {
  if (props.item.path && route.path === props.item.path) return true
  if (!hasChildren.value) return false
  return containsPath(props.item, route.path)
})

const expanded = ref(false)

watch(
  isActive,
  (active) => {
    if (active && hasChildren.value) expanded.value = true
  },
  { immediate: true },
)

watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed) expanded.value = false
  },
)

function containsPath(item: MenuItem, path: string): boolean {
  if (item.path === path) return true
  return item.children?.some((child) => containsPath(child, path)) ?? false
}

function onClick(): void {
  if (props.collapsed && hasChildren.value) {
    const first = props.item.children?.find((child) => child.path)
    if (first?.path) void router.push(first.path)
    return
  }

  if (hasChildren.value) {
    expanded.value = !expanded.value
    return
  }

  if (props.item.path) {
    void router.push(props.item.path)
  }
}
</script>

<template>
  <li
    class="menu-item"
    :class="[
      `is-level-${level}`,
      {
        'is-active': isActive && !hasChildren,
        'is-open': expanded,
        'is-group-active': isActive && hasChildren,
        'is-collapsed': collapsed,
      },
    ]"
  >
    <button
      type="button"
      class="menu-item__btn"
      :class="{ 'has-children': hasChildren }"
      :title="collapsed ? item.title : undefined"
      @click="onClick"
    >
      <span class="menu-item__dot" aria-hidden="true">
        <MenuIcon :name="item.icon" />
      </span>
      <span v-show="!collapsed" class="menu-item__label">{{ item.title }}</span>
      <span v-if="hasChildren && !collapsed" class="menu-item__arrow" aria-hidden="true">›</span>
    </button>

    <ul v-if="hasChildren && expanded && !collapsed" class="menu-item__children">
      <MenuNode
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        :collapsed="false"
      />
    </ul>
  </li>
</template>

<style scoped>
.menu-item {
  list-style: none;
}

.menu-item__btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  color: var(--menu-text);
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 12px;
  transition: background 0.15s, color 0.15s;
}

.menu-item.is-collapsed > .menu-item__btn {
  justify-content: center;
  padding-inline: 8px;
}

.menu-item__btn:hover {
  background: var(--menu-hover);
  color: var(--menu-text-active);
}

.menu-item.is-active > .menu-item__btn,
.menu-item.is-group-active > .menu-item__btn {
  background: var(--menu-active-bg);
  color: var(--menu-active);
  font-weight: 560;
}

.menu-item__dot {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: #0f766e;
  background: rgba(13, 148, 136, 0.12);
}

.menu-item.is-active > .menu-item__btn .menu-item__dot,
.menu-item.is-group-active > .menu-item__btn .menu-item__dot {
  color: #fff;
  background: #0d9488;
}

.menu-item__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item__arrow {
  flex-shrink: 0;
  font-size: 16px;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
  opacity: 0.7;
}

.menu-item.is-open > .menu-item__btn .menu-item__arrow {
  transform: rotate(90deg);
}

.menu-item__children {
  margin: 4px 0 6px;
  padding: 0 0 0 10px;
  list-style: none;
  border-left: 1px solid var(--menu-border);
  margin-left: 22px;
}

.is-level-2 > .menu-item__btn {
  padding: 8px 10px;
  font-size: 13px;
}

.is-level-2 > .menu-item__btn .menu-item__dot {
  width: 22px;
  height: 22px;
  border-radius: 7px;
}

.is-level-2 > .menu-item__btn .menu-item__dot :deep(.menu-icon) {
  width: 13px;
  height: 13px;
}
</style>
