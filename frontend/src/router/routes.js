import NotFound from '@/views/NotFound.vue'
import Home from '@/views/Home.vue'
import ProductList from '@/views/ProductList.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import UserProfile from '@/views/UserProfile.vue'
import Cart from '@/views/CartPage.vue'
import Checkout from '@/views/CheckoutPage.vue'
import Login from '@/views/LoginPage.vue'
import Register from '@/views/RegisterPage.vue'
import OrderList from '@/views/OrderList.vue'
import AdminHome from '@/views/AdminHome.vue'

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
    name: 'checkout',
    path: '/checkout',
    component: Checkout
  },
  {
    name: 'user-profile',
    path: '/user',
    component: UserProfile
  },
  {
    name: 'order-list',
    path: '/orders',
    component: OrderList
  },
  {
    name: 'admin-home',
    path: '/admin',
    component: AdminHome
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: NotFound
  },
]