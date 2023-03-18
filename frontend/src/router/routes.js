import NotFound from '@/views/NotFound.vue'
import Home from '@/views/Home.vue'
import ProductList from '@/views/ProductList.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import UserProfile from '@/views/UserProfile.vue'
import Cart from '@/views/CartPage.vue'
import Login from '@/views/LoginPage.vue'
import Register from '@/views/RegisterPage.vue'

export default [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'register',
    path: '/register',
    component: Register
  },
  {
    name: 'product-list',
    path: '/products',
    component: ProductList
  },
  {
    name: 'product-details',
    path: '/products/:id',
    component: ProductDetails
  },
  {
    name: 'cart',
    path: '/cart',
    component: Cart
  },
  {
    name: 'user-profile',
    path: '/user',
    component: UserProfile
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: NotFound
  },
]