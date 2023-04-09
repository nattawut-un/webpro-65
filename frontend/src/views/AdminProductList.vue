<script setup>
import Section from '@/components/Section.vue'
</script>

<script>
import { store } from '@/store'
import http from '@/http'

export default {
  data() {
    return {
      store,
      loading: false,
      products: []
    }
  },
  methods: {
    async getProducts() {
      this.loading = true
      await http.get('/api/products')
      .then(response => (this.products = response.data))
      .catch(err => console.log(err))
      this.loading = false
    },
    async authorize() {
      const result = await http.post('/api/get_user')
      .then(res => {
        if (res.error) {
          alert(res.error)
          this.$router.back()
        } else if (res.data.data.is_admin != 1) {
          this.$router.push('/')
        } else {
          this.userInfo = res.data.data
          return true
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    if (!this.$cookies.isKey('jwt-token')) {
      this.$router.push('/login')
    } else if (this.authorize()) {
      this.getProducts()
    } else {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
      this.$router.back()
    }
  }
}
</script>

<template>
  <main>
    <Section title="Admin Product List">
      แก้ไขข้อมูลของสินค้านะจ๊ะ
      <br><br>
      <router-link class="bg-secondary hover:bg-primary px-4 py-2 rounded-full text-black hover:text-white font-bold hover:shadow-lg transition ease-out duration-100" to="/admin/products/add">เพิ่มสินค้า</router-link><br><br>
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="this.$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button>
    </Section>
    <div class="bg-white p-8">
      <!-- header -->
      <div class="font-mali m-8 px-8 rounded-lg flex">
        <div class="w-1/6">
          <p>รูปภาพ</p>
        </div>
        <div class="w-3/6">
          <h1 class="font-bold text-2xl">ชื่อ</h1>
        </div>
        <div class="w-1/6">
          <p>ราคา</p>
        </div>
        <div class="w-1/6">
          <p>เมนู</p>
        </div>
      </div>
      <!-- each item -->
      <div v-show="loading">
        <div class="flex items-center justify-center h-[45vh]">
          <div class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      </div>
      <router-link class="font-mali bg-gray-200 shadow-lg m-8 px-8 py-6 rounded-lg flex" v-for="item in products" :to="'/admin/products/' + item.id">
        <div class="w-1/6">
          <!-- <p>{{ item.id }}</p> -->
          <img :src="store.apiURL + item.file_path" class="aspect-square object-cover rounded-full h-24">
        </div>
        <div class="w-3/6">
          <h1 class="font-bold text-2xl">{{ item.name }}</h1>
        </div>
        <div class="w-1/6">
          <p class="font-bold text-xl">{{ item.price }}</p>
        </div>
        <div class="w-1/6">
          <p>(some menus)</p>
        </div>
      </router-link>
    </div>
  </main>
</template>