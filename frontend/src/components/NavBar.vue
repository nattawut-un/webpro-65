<script lang="ts">
import { store } from '../store.js'

export default {
  data() {
    return {
      store,
      username: '',
      loggedIn: false,
      navList: [
        { title: 'หน้าหลัก', url: '/', icon: null },
        { title: 'รายการ', url: '/products', icon: null },
      ],
      accList: [
        { title: 'ประวัติการสั่งซื้อ', url: '/', icon: null },
        { title: 'แก้ไขข้อมูล', url: '/', icon: null },
        { title: 'ลงชื่อออก', url: '/', icon: null },
      ],
      guestMenu: [
        { title: '📥สมัครสมาชิก', url: '/register' },
        { title: '📲ลงชื่อเข้าใช้', url: '/login' },
      ],
      userMenu: [
        { title: '📃ประวัติ', url: '/orders' },
        { title: '🪪ข้อมูล', url: '/user' },
      ],
      categoryList: [
        { title: 'ข้าว', url: './products?category=rice' },
        { title: 'ก๋วยเตี๋ยว', url: '/products?category=noodle' },
        { title: 'เครื่องดื่ม', url: '/products?category=drinks' },
      ],
    }
  },
  methods: {
    logout() {
      if (confirm('คุณต้องการลงชื่อออกหรือไม่\nOK เพื่อ ตกลง\nCancel เพื่อ ยกเลิก')) {
        this.$cookies.remove('username')
        this.$cookies.remove('jwt-token')
        window.location.href = '/';
      }
    },
    getCart() {
      this.store.cart = JSON.parse(localStorage.getItem('cart') || '[]')
    }
  },
  mounted() {
    this.getCart()
  },
  watch: {
    '$route' (to, from) {
      this.getCart()
    }
  }
}
</script>

<template>
  <nav id="navbar" class="bg-primary/80 hover:bg-primary backdrop-blur-lg sticky top-0 w-full transition duration-300 ease-out font-chonburi z-50">
    <div class="container mx-auto flex px-4">
      <div class="flex my-2 w-4/5">
        <h1 class="text-white font-bold text-xl mr-8">{{ store.shopName }}</h1>
        <router-link class="text-secondary hover:text-white transition duration-300 ease-out text-xl mr-6" v-for="item in navList" :to="item.url">
          <h1> {{ item.title }} </h1>
        </router-link>
      </div>
      <div class="flex my-2 w-1/5 justify-end">
        <router-link class="text-white rounded-full px-3 flex cursor-pointer" to="/cart">
          <h1 class="font-bold text-lg">ตะกร้า<span v-show="store.cart.length && store.username"> ({{ store.cart.length }})</span></h1>&nbsp;<img class="h-7" src="../svg/Cart.svg">
        </router-link>
      </div>
    </div>
    <div class="bg-red-200/80 hover:bg-secondary transition duration-300 ease-out py-1 font-mali">
      <div class="container flex justify-end mx-auto px-4">
        <router-link v-if="store.username" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" v-for="item in userMenu" :to="item.url">
          {{ item.title }}
        </router-link>
        <router-link v-else class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" v-for="item in guestMenu" :to="item.url">
          {{ item.title }}
        </router-link>
        <button v-if="store.username" @click="logout()" class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4">🚪ลงชื่อออก</button>
        <h1 v-show="store.username" class="bg-primary px-2 rounded-full font-bold">👤{{ store.username }}</h1>
      </div>
    </div>
  </nav>
</template>
