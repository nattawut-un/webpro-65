<script lang="ts">
export default {
  data() {
    return {
      cart: [],
      navList: [
        { title: 'หน้าหลัก', url: '/', icon: null },
        { title: 'รายการ', url: '/products', icon: null },
      ],
      accList: [
        { title: 'ประวัติการสั่งซื้อ', url: '/', icon: null },
        { title: 'แก้ไขข้อมูล', url: '/', icon: null },
        { title: 'ลงชื่อออก', url: '/', icon: null },
      ],
      mainList: [
        { title: 'สมัครสมาชิก', url: '/register' },
        { title: 'ลงชื่อเข้าใช้', url: '/login' },
      ],
      categoryList: [
        { title: 'ข้าว', url: './products?category=rice' },
        { title: 'ก๋วยเตี๋ยว', url: '/products?category=noodle' },
        { title: 'เครื่องดื่ม', url: '/products?category=drinks' },
      ],
    }
  },
  mounted() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
  },
}
</script>

<template>
  <nav id="navbar" class="bg-primary/80 hover:bg-primary backdrop-blur-lg sticky top-0 w-full transition duration-300 ease-out font-mali z-50">
    <div class="container mx-auto flex px-4">
      <div class="flex my-2 w-4/5">
        <h1 class="text-white font-bold text-xl mr-8">{{ this.$shopName }}</h1>
        <router-link class="text-secondary hover:text-white transition duration-300 ease-out text-xl mr-6" v-for="item in navList" :to="item.url">
          <h1> {{ item.title }} </h1>
        </router-link>
      </div>
      <div class="flex my-2 w-1/5 justify-end">
        <!-- <div class="bg-primary text-white rounded-full px-3 flex cursor-pointer" @click="profileDropdown = !profileDropdown">
          <h1 class="font-bold text-lg">{{ profileDropdown }}</h1>&nbsp;<img class="h-7" src="./icons/User.svg">
        </div> -->
        <router-link class="text-white rounded-full px-3 flex cursor-pointer" to="/cart">
          <h1 class="font-bold text-lg">ตะกร้า ({{ cart.length }})</h1>&nbsp;<img class="h-7" src="../svg/Cart.svg">
        </router-link>
      </div>
    </div>
    <div class="bg-red-200/80 hover:bg-secondary transition duration-300 ease-out py-1 font-mali">
      <div class="container flex justify-end mx-auto px-4">
        <!-- <p>⭐⭐⭐ Work In Progress ⭐⭐⭐</p> -->
        <router-link class="text-gray-500 hover:text-black transition duration-300 ease-out mr-4" v-for="item in mainList" :to="item.url">
          {{ item.title }}
        </router-link>
      </div>
    </div>
    <!-- <div class="absolute right-2 top-12 shadow-xl" v-show="profileDropdown">
      <div class="bg-red-300 px-4 py-2 rounded-t-lg">
        <h1 class="font-bold text-2xl">Username</h1>
      </div>
      <div class="bg-white px-4 py-2 rounded-b-lg">
        <div v-for="item in accList">
          <router-link :to="item.url">{{ item.title }}</router-link><br>
        </div>
      </div>
    </div> -->
  </nav>
</template>
