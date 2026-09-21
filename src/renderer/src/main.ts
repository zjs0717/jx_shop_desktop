import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { initLayoutMode } from './composables/useLayoutMode'
import { useAuthStore } from './stores/auth'

initLayoutMode()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
useAuthStore().syncToken()
app.mount('#app')
