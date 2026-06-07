import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'

const app = createApp(App)
app.use(router)

router.isReady().then(async () => {
  const redirect = sessionStorage.getItem('forja:redirect')
  if (redirect) {
    sessionStorage.removeItem('forja:redirect')
    if (router.currentRoute.value.fullPath !== redirect) {
      await router.replace(redirect)
    }
  }
  app.mount('#app')
})
