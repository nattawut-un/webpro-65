import { createApp } from 'vue/dist/vue.esm-bundler'
import VueCookies from 'vue-cookies'
import App from '@/App.vue'

import './style.css'

import router from './router/routes.js'

const app = createApp(App)

app.use(router)
app.use(VueCookies)

app.mount('#app')
