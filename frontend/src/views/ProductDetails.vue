<script>
import { store } from '@/store'
import http from '@/http'

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
        let url = '/api/products/' + this.productId
        let res = await http
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
    async addFav() {
      await http.post('/api/favs/add', {
        prod_id: this.details.id,
      }).then(res => {
        this.details.fav_id = 1
        // this.$emit('productRefresh')
      }).catch(err => {
        console.log(err)
      })
    },
    async deleteFav() {
      await http.delete('/api/favs/remove', {
        data: {
          prod_id: this.details.id,
        }
      }).then(res => {
        this.details.fav_id = 0
        // this.$emit('productRefresh')
      }).catch(err => {
        console.log(err)
      })
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
  <SectionFull :title="details.name" :imageApi="`${details.file_path}`" backButton="true">
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
      <div class="flex">
        <h2 class="text-[200%]">{{ details.price }} บาท</h2>
        <span v-if="store.user.data">
          <button v-if="details.fav_id" class="ml-2 px-4 py-3 rounded-full transition ease-out duration-100 bg-pink-200 hover:bg-pink-300 flex" @click="deleteFav()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mt-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
            <p class="ml-2">ชื่นชอบ</p>
          </button>
          <button v-else class="ml-2 px-4 py-3 rounded-full transition ease-out duration-100 bg-gray-100 hover:bg-gray-200 flex" @click="addFav()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mt-1" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
            </svg>
            <p class="ml-2">ชื่นชอบ</p>
          </button>
        </span>
      </div>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <p>{{ details.description }}</p>
      <br><hr><br>
      <div v-if="store.user.data">
        <label>จำนวน</label>
        <input type="number" v-model="quantity" min="1" class="bg-gray-200/50 hover:bg-gray-200 transition ease-in-out duration-200 mx-4 px-4 py-2 rounded-full w-20">
        <button v-if="alreadyAdded" class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="addToCart()">อัปเดทสินค้าในตะกร้า ({{ totalPrice }} บาท)</button>
        <button v-else class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="addToCart()">เพิ่มลงตะกร้า ({{ totalPrice }} บาท)</button>
      </div>
      <div v-else>
        <router-link to="/login">
          <h1 class="bg-secondary/50 px-4 py-2 rounded-full font-bold"><i>⚠️ โปรดลงชื่อเข้าใช้ก่อนเพิ่มลงตะกร้า</i></h1>
        </router-link>
      </div>
    </div>
  </SectionFull>
</template>