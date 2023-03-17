<script>
import { store } from '../store.js'
import axios from 'axios'

export default {
  data() {
    return {
      store,
      productId: null,
      details: {},
      quantity: 1,
      alreadyAdded: false,
      cartIndex: null
    }
  },
  methods: {
    async getProductDetail() {
      try {
        let url = 'http://localhost:3000/api/products/' + this.productId
        let res = await axios
          .get(url)
          .then(response => (this.details = response.data))
      } catch (err) {
        console.log(err)
      }
    },
    addToCart() {
      let product = JSON.parse(JSON.stringify(this.details))

      if (this.alreadyAdded) {
        this.store.cart[this.cartIndex].quantity = this.quantity
        localStorage.setItem('cart', JSON.stringify(this.store.cart))
        alert('เพิ่มสิงค้าลงตะกร้าแล้ว')
        this.$router.back()
        return
      }

      product.quantity = this.quantity
      this.store.cart.push(product)
      localStorage.setItem('cart', JSON.stringify(this.store.cart))
      alert('เพิ่มสิงค้าลงตะกร้าแล้ว')
      this.$router.back()
    },
  },
  computed: {
    totalPrice() {
      return this.details.price * this.quantity
    }
  },
  mounted() {
    this.productId = this.$route.params.id
    this.getProductDetail()
    this.store.cart = JSON.parse(localStorage.getItem('cart') || '[]')
    for (let i=0; i<this.store.cart.length; i++) {
      if (this.productId == this.store.cart[i].id) {
        this.alreadyAdded = true
        this.cartIndex = i
        this.quantity = this.store.cart[i].quantity
      }
    }
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <main class="backdrop-blur-lg min-h-[75vh] md:flex font-mali">
    <div class="md:w-1/2 bg-gray-300/80">
      <img :src="'../src/assets/images/products/' + productId + '.jpg'" class="w-full">
    </div>
    <div class="md:w-1/2 bg-white/80 p-12">
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button><br><br>
      <h1 class="text-[400%] font-pattaya">{{ details.name }}</h1>
      <h2 class="text-[200%]">{{ details.price }} บาท</h2>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <p>{{ details.description }}</p>
      <br><hr><br>
      <div>
        <label>จำนวน</label>
        <input type="number" v-model="quantity" min="1" class="bg-gray-200/50 hover:bg-gray-200 transition ease-in-out duration-200 mx-4 px-4 py-2 rounded-full w-20">
        <button v-if="alreadyAdded" class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="addToCart()">อัปเดทสินค้าในตะกร้า ({{ totalPrice }} บาท)</button>
        <button v-else class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="addToCart()">เพิ่มลงตะกร้า ({{ totalPrice }} บาท)</button>
      </div>
    </div>
  </main>
</template>