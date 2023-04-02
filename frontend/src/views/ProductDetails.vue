<script>
import { store } from '../store.js'
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
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
      this.loading = true
      try {
        let url = this.store.apiURL + '/api/products/' + this.productId
        let res = await axios
        .get(url)
        .then(response => (this.details = response.data))
      } catch (err) {
        console.log(err)
      }
      this.loading = false
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
  }
}
</script>

<script setup>
import SectionFull from '../components/SectionFull.vue'
</script>

<template>
  <SectionFull :title="details.name" :imageApi="`products/${productId}`" backButton="true">
    <div v-show="loading" class="flex items-center justify-center space-x-2">
      <div
        class="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
    <div v-show="!loading">
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
  </SectionFull>
</template>