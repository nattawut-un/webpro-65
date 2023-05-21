<script setup>
import SectionFull from '../components/SectionFull.vue'
import CartImage from '@/assets/images/food_cart.jpg'
</script>

<script>
import { store } from '../store.js'

export default {
  data() {
    return {
      store
    }
  },
  methods: {
    removeFromCart(item) {
      if (confirm('คุณต้องการลบสินค้าออกจากตะกร้าหรือไม่')) {
        this.store.cart.splice(item, 1)
        localStorage.setItem('cart', JSON.stringify(this.store.cart))
      }
    },
    clearCart() {
      this.store.cart = []
      localStorage.setItem('cart', '[]')
      alert('ลบสินค้าทั้งหมดจากจะกร้าแล้ว')
    }
  },
  computed: {
    totalPrice() {
      return this.store.cart.reduce((total, currentValue) => {
        return total + (parseFloat(currentValue.price) * parseInt(currentValue.quantity))
      }, 0)
    }
  },
  mounted() {
    this.store.cart = JSON.parse(localStorage.getItem('cart') || '[]')
  }
}
</script>

<template>
  <SectionFull title="ตะกร้าสินค้า" :image="CartImage" backButton="true">
    <div v-show="store.cart.length == 0">
      <h1 class="text-2xl font-bold">ไม่มีอะไรในตะกร้า</h1>
    </div>
    <div class="flex my-4" v-for="item in store.cart">
      <div class="w-1/6 mr-8">
        <img :src="store.apiURL + item.file_path" class="w-full aspect-square rounded-full object-cover shadow-lg">
      </div>
      <div class="w-3/4 flex">
        <div class="w-5/6">
          <router-link :to="'/products/' + item.id">
            <h3 class="text-2xl font-bold">{{ item.name }}</h3>
          </router-link>
          <p>ราคา {{ item.price }} บาท</p>
          <p>จำนวน {{ item.quantity }} ที่</p>
        </div>
        <div class="w-1/3 text-end">
          <h1 class="text-6xl font-bold mb-2 font-chonburi">{{ item.price*item.quantity }}.-</h1>
          <button class="bg-red-500 text-white rounded-full px-4 py-2" @click="removeFromCart(this.store.cart.indexOf(item))" :disabled="store.cart.length == 0">
            ลบ
          </button>
        </div>
      </div>
    </div>
    <br><hr><br><br>
    <div class="mb-8">
      <h2 class="text-3xl font-bold">ราคารวม: {{ totalPrice }} บาท</h2>
    </div>
    <div class="flex">
      <button
        class="rounded-full px-4 py-2 transition ease-out duration-100 mr-2"
        :class="[store.cart.length == 0 ? 'bg-gray-200 text-black opacity-50' : 'bg-red-500 text-white']"
        @click="clearCart()"
        :disabled="store.cart.length == 0"
      >
        ลบทั้งหมด
      </button>
      <button v-show="!store.user || store.cart.length == 0" disabled class="rounded-full px-4 py-2 bg-gray-200 text-black opacity-50">โปรด login และเพิ่มสินค้าลงตะกร้าเพื่อสั่งซื้อ</button>
      <router-link v-show="store.user && store.cart.length" to="/checkout" class="rounded-full px-4 py-2 transition ease-out duration-100 bg-red-500 text-white">
        สั่งซื้อ
      </router-link>
    </div>
  </SectionFull>
</template>