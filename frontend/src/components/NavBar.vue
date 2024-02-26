<script lang="ts">
import { store } from '../store.js'
import http from '../http'

export default {
  data() {
    return {
      store,
      navList: [
        { title: 'รายการอาหารทั้งหมด', url: '/products' },
      ],
      accList: [
        { title: 'ประวัติการสั่งซื้อ', url: '/' },
        { title: 'แก้ไขข้อมูล', url: '/' },
        { title: 'ลงชื่อออก', url: '/' },
      ],
      guestMenu: [
        { title: '📥สมัครสมาชิก', url: '/register' },
        { title: '📲ลงชื่อเข้าใช้', url: '/login' },
      ],
      userMenu: [
        { title: '📃ประวัติ', url: '/user/orders' },
        { title: '🪪ข้อมูล', url: '/user' },
      ],
      categoryList: [
        { title: 'ข้าว', url: './products?category=rice' },
        { title: 'ก๋วยเตี๋ยว', url: '/products?category=noodle' },
        { title: 'เครื่องดื่ม', url: '/products?category=drinks' },
      ],
      adminMenu: [
        { title: 'สินค้า', url: '/admin/products' },
        { title: 'ออเดอร์', url: '/admin/orders' },
        { title: 'ผู้ใช้', url: '/admin/users' },
      ],
    }
  },
  methods: {
    logout() {
      if (confirm('คุณต้องการลงชื่อออกหรือไม่\nOK เพื่อ ตกลง\nCancel เพื่อ ยกเลิก')) {
        this.store.user = {}
        localStorage.removeItem('token')
        this.$router.push('/')
      }
    },
    getCart() {
      this.store.cart = JSON.parse(localStorage.getItem('cart') || '[]')
    }
  },
  mounted() {
    this.getCart()
  },
}
</script>

<template>
  <nav id="navbar" class="bg-primary/80 hover:bg-primary backdrop-blur-lg sticky top-0 w-full transition duration-300 ease-out font-chonburi z-[99999999999]">
    <div class="container mx-auto flex px-4">
      <div class="flex my-2 w-4/5">
        <router-link to="/">
            <h1 class="text-white font-bold text-xl mr-8">{{ store.shopName }}</h1>
        </router-link>
        <router-link class="text-secondary hover:text-white transition duration-300 ease-out text-xl mr-6" v-for="item in navList" :to="item.url">
          <h1> {{ item.title }} </h1>
        </router-link>
      </div>
      <div class="flex my-2 w-1/5 justify-end">
        <router-link class="text-white rounded-full px-3 flex cursor-pointer" to="/cart">
          <h1 class="font-bold text-lg">ตะกร้า<span v-show="store.cart.length"> ({{ store.cart.length }})</span></h1>&nbsp;<img class="h-7" src="../svg/Cart.svg">
        </router-link>
      </div>
    </div>
    <div class="bg-red-200/80 hover:bg-secondary transition duration-300 ease-out py-1 font-mali flex">
      <div class="container mx-auto flex">
        <div class="flex px-4 font-pattaya w-1/3">
          <div v-if="this.$route.path.includes('/admin')">
            <router-link to="/admin">เมนูแอดมิน&nbsp;&nbsp;&nbsp;&nbsp;::&nbsp;&nbsp;&nbsp;&nbsp;</router-link>
            <router-link v-for="item in adminMenu" :to="item.url" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4">
              {{ item.title }}
            </router-link>
          </div>
        </div>
        <div class="flex px-4 font-pattaya w-2/3 justify-end">
              <router-link v-if="store.user.data && store.user.data.isAdmin" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" to="/admin">
              ⚒️แอดมิน
            </router-link>
            <router-link v-if="store.user.data" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" v-for="item in userMenu" :to="item.url">
              {{ item.title }}
            </router-link>
            <router-link v-else class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" v-for="item in guestMenu" :to="item.url">
              {{ item.title }}
            </router-link>
            <button v-if="store.user.data" @click="logout()" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4">🚪ลงชื่อออก</button>
            <h1 class="bg-primary/40 px-2 rounded-full" v-if="store.user.data">
                <span v-if="store.user.data.isAdmin">🖥️</span>
            <span v-else>👤</span>
            {{ store.user.data.username }}
          </h1>
        </div>
      </div>
    </div>
  </nav>
</template>
