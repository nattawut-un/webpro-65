import { createApp } from 'vue/dist/vue.esm-bundler'
import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
import 'tw-elements'

import { store } from './store.js'

// tailwind
import './style.css'

// components
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

// setting router
import routes from './router/routes.js'
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savePosition) {
    return { top: 0 }
  }
})
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

const app = createApp({
  data() {
    return {
      store
    }
  },
  methods: {
    update() {
      if (this.$cookies.isKey('jwt-token')) { this.store.username = this.$cookies.get('username') }
      else { this.store.username = '' }
    }
  },
  created() {
    if (!localStorage.getItem('cart')) {
      console.log('Intialize cart')
      localStorage.setItem('cart', '[]')
    }
    this.update()
  },
  watch: {
    '$route' (to, from) {
      this.update()
    }
  }
})

app.component('navbar', NavBar)
app.component('foot', Footer)

// app.config.globalProperties.$shopName = 'ชื่อร้าน'

app.use(router)
app.use(VueCookies)

app.mount('#app')
