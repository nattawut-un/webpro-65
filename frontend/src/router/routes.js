import { store } from '@/store'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: 'หน้าหลัก'
    }
  }, {
    name: 'login',
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      title: 'ลงชื่อเข้าใช้',
      level: 'guest'
    }
  }, {
    name: 'register',
    path: '/register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: {
      title: 'สมัครสมาชิก',
      level: 'guest'
    }
  }, {
    name: 'product-list',
    path: '/products',
    component: () => import('@/views/ProductList.vue'),
    meta: {
      title: 'รายการทั้งหมด'
    }
  }, {
    name: 'product-details',
    path: '/products/:id',
    component: () => import('@/views/ProductDetails.vue'),
    meta: {
      title: 'รายละเอียด'
    }
  }, {
    name: 'cart',
    path: '/cart',
    component: () => import('@/views/CartPage.vue'),
    meta: {
      title: 'ตะกร้า'
    }
  }, {
    name: 'checkout',
    path: '/checkout',
    component: () => import('@/views/CheckoutPage.vue'),
    meta: {
      title: 'ยืนยันการสั่งซื้อ',
      level: 'user'
    }
  }, {
    name: 'user-profile',
    path: '/user',
    component: () => import('@/views/UserProfile.vue'),
    meta: {
      title: 'ข้อมูลผู้ใช้',
      level: 'user'
    }
  }, {
    name: 'order-list',
    path: '/user/orders',
    component: () => import('@/views/OrderList.vue'),
    meta: {
      title: 'ประวัติการสั่งซื้อ',
      level: 'user'
    }
  }, {
    name: 'admin-home',
    path: '/admin',
    component: () => import('@/views/admin/AdminHome.vue'),
    meta: {
      title: 'หน้าหลักแอดมิน',
      level: 'admin'
    }
  }, {
    name: 'admin-products',
    path: '/admin/products',
    component: () => import('@/views/admin/AdminProductList.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า',
      level: 'admin'
    }
  }, {
    name: 'admin-product-details',
    path: '/admin/products/:id',
    component: () => import('@/views/admin/AdminProductDetails.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า',
      level: 'admin'
    }
  }, {
    name: 'admin-product-add',
    path: '/admin/products/add',
    component: () => import('@/views/admin/AdminProductAdd.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า',
      level: 'admin'
    }
  }, {
    name: 'admin-category',
    path: '/admin/categories',
    component: () => import('@/views/admin/AdminCategoryList.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า',
      level: 'admin'
    }
  }, {
  }, {
    name: 'admin-order',
    path: '/admin/orders',
    component: () => import('@/views/admin/AdminOrderList.vue'),
    meta: {
      title: 'รายการคำสั่งซื้อ',
      level: 'admin'
    }
  }, {
  }, {
    name: 'admin-user-list',
    path: '/admin/users',
    component: () => import('@/views/admin/AdminUserList.vue'),
    meta: {
      title: 'ผู้ใช้ทั้งหมด',
      level: 'admin'
    }
  }, {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savePosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 150)
    })
  }
})

// handle 404
router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

import http from '@/http'

// navigation guard
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  var user = store.user
  if (token && Object.keys(store.user).length === 0) {
    console.log('Fetch user data...')
    await http.get('/api/get_user')
    .then(res => {
      user = res.data
      console.log(user)
    })
  }


  if (to.meta.level === 'guest' && token) {
    // pages don't need login but have user
    alert('You are already logged in.')
    return next({ name: 'home' })
  }

  if ((to.meta.level === 'user' || to.meta.level === 'admin') && !token) {
    // pages need login but no login
    alert('Please login first!')
    return next({ name: 'login' })
  }

  if (to.meta.level === 'admin' && token && user.data.isAdmin === 0) {
    // pages need admin but not admin
    alert('Unauthorized.')
    return next({ name: 'home' })
  }

  next()
})

export default router
