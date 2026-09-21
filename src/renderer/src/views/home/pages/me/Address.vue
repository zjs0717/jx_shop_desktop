<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  createAddressApi,
  deleteAddressApi,
  fetchAddressesApi,
  updateAddressApi,
} from '@/api/user'
import type { AddressItem, AddressPayload } from '@/types/user'

const router = useRouter()
const list = ref<AddressItem[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const editingId = ref<number | null>(null)
const showForm = ref(false)

const form = reactive<AddressPayload>({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

function resetForm(): void {
  editingId.value = null
  form.name = ''
  form.phone = ''
  form.province = ''
  form.city = ''
  form.district = ''
  form.detail = ''
  form.isDefault = false
}

function openCreate(): void {
  resetForm()
  showForm.value = true
}

function openEdit(item: AddressItem): void {
  editingId.value = item.id
  form.name = item.name
  form.phone = item.phone
  form.province = item.province
  form.city = item.city
  form.district = item.district
  form.detail = item.detail
  form.isDefault = item.isDefault
  showForm.value = true
}

async function load(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    list.value = await fetchAddressesApi()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function save(): Promise<void> {
  saving.value = true
  error.value = ''
  try {
    const payload: AddressPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      district: (form.district || '').trim(),
      detail: form.detail.trim(),
      isDefault: Boolean(form.isDefault),
    }
    if (editingId.value) {
      await updateAddressApi(editingId.value, payload)
    } else {
      await createAddressApi(payload)
    }
    showForm.value = false
    resetForm()
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败'
  } finally {
    saving.value = false
  }
}

async function remove(id: number): Promise<void> {
  if (!confirm('确定删除该地址？')) return
  try {
    await deleteAddressApi(id)
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败'
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="page">
    <button type="button" class="back" @click="router.push('/home/me')">← 我的</button>
    <div class="head">
      <div>
        <h1>收货地址</h1>
        <p>管理下单常用地址</p>
      </div>
      <button type="button" class="add" @click="openCreate">新增地址</button>
    </div>

    <p v-if="error" class="err">{{ error }}</p>
    <p v-if="loading" class="hint">加载中…</p>

    <div v-else-if="!list.length && !showForm" class="empty">
      <p>还没有地址</p>
      <button type="button" @click="openCreate">添加第一个地址</button>
    </div>

    <div v-else class="list">
      <article v-for="item in list" :key="item.id" class="card">
        <div class="card__top">
          <strong>{{ item.name }}</strong>
          <span>{{ item.phone }}</span>
          <em v-if="item.isDefault">默认</em>
        </div>
        <p>{{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}</p>
        <div class="card__actions">
          <button type="button" @click="openEdit(item)">编辑</button>
          <button type="button" class="danger" @click="remove(item.id)">删除</button>
        </div>
      </article>
    </div>

    <form v-if="showForm" class="form" @submit.prevent="save">
      <h2>{{ editingId ? '编辑地址' : '新增地址' }}</h2>
      <label><span>收货人</span><input v-model="form.name" required /></label>
      <label><span>手机号</span><input v-model="form.phone" required /></label>
      <div class="row">
        <label><span>省</span><input v-model="form.province" required /></label>
        <label><span>市</span><input v-model="form.city" required /></label>
      </div>
      <label><span>区/县</span><input v-model="form.district" /></label>
      <label><span>详细地址</span><input v-model="form.detail" required /></label>
      <label class="check">
        <input v-model="form.isDefault" type="checkbox" />
        <span>设为默认地址</span>
      </label>
      <div class="form__actions">
        <button type="button" class="ghost" @click="showForm = false">取消</button>
        <button type="submit" :disabled="saving">{{ saving ? '保存中…' : '保存' }}</button>
      </div>
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

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

h1 {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
}

.head p,
.hint {
  margin-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.add,
.empty button,
.form__actions button[type='submit'] {
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.err {
  color: var(--brand);
  font-size: 13px;
  margin-bottom: 10px;
}

.empty {
  padding: 40px 16px;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  border: 1px dashed var(--border);
  color: var(--muted);
}

.empty button {
  margin-top: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px;
}

.card__top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.card__top strong {
  color: var(--ink);
}

.card__top span {
  color: var(--muted);
  font-size: 13px;
}

.card__top em {
  margin-left: auto;
  font-style: normal;
  font-size: 11px;
  font-weight: 700;
  color: var(--brand);
  background: var(--brand-soft);
  padding: 2px 8px;
  border-radius: 999px;
}

.card p {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.5;
}

.card__actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.card__actions button,
.form__actions .ghost {
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.card__actions .danger {
  color: var(--brand);
  border-color: rgba(255, 45, 122, 0.25);
}

.form {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form h2 {
  font-size: 16px;
}

.form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.form input[type='text'],
.form input:not([type]) {
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0 12px;
  font: inherit;
  color: var(--ink);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.check {
  flex-direction: row !important;
  align-items: center;
  gap: 8px !important;
  color: var(--ink) !important;
}

.check input {
  accent-color: var(--brand);
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
</style>
