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
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <main class="backdrop-blur-lg min-h-[75vh] flex font-mali">
    <div class="w-1/2 bg-gray-300/80">
      <img src="../assets/images/food_cart.jpg" class="w-[100%] h-[100%] object-cover">
    </div>
    <div class="w-1/2 bg-white/80 p-12">
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button><br><br>
      <h1 class="text-[400%] font-pattaya">ตะกร้าสินค้า</h1>
      <br><br>
      <div v-show="store.cart.length == 0">
        <h1 class="text-2xl font-bold">ไม่มีอะไรในตะกร้า</h1>
      </div>
      <div class="flex border-b-2 border-gray-200/50 pt-2 pb-8" v-for="item in store.cart">
        <div class="w-1/4 mr-8">
          <img :src="'../src/assets/images/products/' + item.id + '.jpg'" class="w-full aspect-square rounded-full object-cover shadow-lg">
        </div>
        <div class="w-3/4 flex">
          <div class="w-2/3">
            <h3 class="text-2xl font-bold">{{ item.name }}</h3>
            <p>ราคา {{ item.price }} บาท</p>
            <p>จำนวน {{ item.quantity }} ที่</p>
          </div>
          <div class="w-1/3 text-end">
            <h1 class="text-6xl font-bold mb-2">{{ item.price*item.quantity }}.-</h1>
            <button class="bg-red-500 text-white rounded-full px-4 py-2" @click="removeFromCart(this.store.cart.indexOf(item))" :disabled="store.cart.length == 0">
              ลบ
            </button>
          </div>
        </div>
      </div>
      <br><br><br>
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
        <router-link
          to="/checkout"
          class="rounded-full px-4 py-2 transition ease-out duration-100"
          :class="[!store.session || store.cart.length == 0 ? 'bg-gray-200 text-black opacity-50' : 'bg-red-500 text-white']"
          :disabled="!store.session || store.cart.length == 0"
          :event="!(!store.session || store.cart.length) ? 'click' : ''"
        >
          <span v-if="store.session">สั่งซื้อ</span>
          <span v-else>โปรด login เพื่อสั่งซื้อ</span>
        </router-link>
      </div>
    </div>
  </main>
</template>