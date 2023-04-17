// import NotFound from '@/views/NotFound.vue'
// import Home from '@/views/Home.vue'
// import ProductList from '@/views/ProductList.vue'
// import ProductDetails from '@/views/ProductDetails.vue'
// import UserProfile from '@/views/UserProfile.vue'
// import Cart from '@/views/CartPage.vue'
// import Checkout from '@/views/CheckoutPage.vue'
// import Login from '@/views/LoginPage.vue'
// import Register from '@/views/RegisterPage.vue'
// import OrderList from '@/views/OrderList.vue'
// import AdminHome from '@/views/admin/AdminHome.vue'
// import AdminProductList from '@/views/admin/AdminProductList.vue'
// import AdminProductDetails from '@/views/admin/AdminProductDetails.vue'
// import AdminProductAdd from '@/views/admin/AdminProductAdd.vue'
// import AdminCategoryList from '@/views/admin/AdminCategoryList.vue'
// import AdminCategoryAdd from '@/views/admin/AdminCategoryAdd.vue'
// import AdminOrderList from '@/views/admin/AdminOrderList.vue'

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
      title: 'ลงชื่อเข้าใช้'
    }
  }, {
    name: 'register',
    path: '/register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: 'สทัครสมาชิก'
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
      title: 'ยืนยันการสั่งซื้อ'
    }
  }, {
    name: 'user-profile',
    path: '/user',
    component: () => import('@/views/UserProfile.vue'),
    meta: {
      title: 'ข้อมูลผู้ใช้'
    }
  }, {
    name: 'order-list',
    path: '/orders',
    component: () => import('@/views/OrderList.vue'),
    meta: {
      title: 'ประวัติการสั่งซื้อ'
    }
  }, {
    name: 'admin-home',
    path: '/admin',
    component: () => import('@/views/admin/AdminHome.vue'),
    meta: {
      title: 'หน้าหลักแอดมิน'
    }
  }, {
    name: 'admin-products',
    path: '/admin/products',
    component: () => import('@/views/admin/AdminProductList.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า'
    }
  }, {
    name: 'admin-product-details',
    path: '/admin/products/:id',
    component: () => import('@/views/admin/AdminProductDetails.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า'
    }
  }, {
    name: 'admin-product-add',
    path: '/admin/products/add',
    component: () => import('@/views/admin/AdminProductAdd.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า'
    }
  }, {
    name: 'admin-category',
    path: '/admin/categories',
    component: () => import('@/views/admin/AdminCategoryList.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า'
    }
  }, {
  }, {
    name: 'admin-category-add',
    path: '/admin/categories/add',
    component: () => import('@/views/admin/AdminCategoryAdd.vue'),
    meta: {
      title: 'แก้ไขข้อมูลสินค้า'
    }
  }, {
  }, {
    name: 'admin-order',
    path: '/admin/orders',
    component: () => import('@/views/admin/AdminOrderList.vue'),
    meta: {
      title: 'รายการคำสั่งซื้อ'
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

router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

// router.afterEach((to, from) => {
//   const toDepth = to.path.split('/').length
//   const fromDepth = from.path.split('/').length

//   if (toDepth < fromDepth) {
//     to.meta.transition = 'slide-right'
//   } else if (toDepth < fromDepth) {
//     to.meta.transition = 'slide-left'
//   } else {
//     to.meta.transition = 'page-opacity'
//   }
// })

export default router
