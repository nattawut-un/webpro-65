import { createApp } from 'vue/dist/vue.esm-bundler'
import { createRouter, createWebHistory } from 'vue-router'

// tailwind
import './style.css'

// components
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import NotFound from './NotFound.vue'
import Home from './Home.vue'
import ProductList from './ProductList.vue'
import ProductDetails from './ProductDetails.vue'
import Cart from './CartPage.vue'
import Login from './LoginPage.vue'
import Register from './RegisterPage.vue'

// setting router
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetails },
  { path: '/cart', component: Cart },
  { path: '/:pathMatch(.*)*', name:'not-found', component: NotFound },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

const app = createApp({
  created() {
    if (!localStorage.getItem('cart')) {
      console.log('lol')
      localStorage.setItem('cart', '[]')
    }
  }
})

app.component('navbar', NavBar)
app.component('foot', Footer)

app.config.globalProperties.$shopName = 'ชื่อร้าน'

app.use(router)

app.mount('#app')
