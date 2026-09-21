import { createRouter, createWebHashHistory } from 'vue-router'
import { routeList } from './routes'
import { getToken } from '@/api/request'

const router = createRouter({
  history: createWebHashHistory(),
  routes: routeList,
})

router.beforeEach((to) => {
  const guest = to.name === 'login' || to.name === 'register'
  const token = getToken()
  if (!guest && !token) return { name: 'login' }
  if (guest && token) return { path: '/home' }
  return true
})

export default router
