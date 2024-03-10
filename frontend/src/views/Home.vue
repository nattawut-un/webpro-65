<script setup>
import Section from '@/components/Section.vue'
import ProductImage from '@/assets/images/food_list.jpg'
import HomeImage from '@/assets/images/homepage.jpg'
</script>

<script>
import { store } from '@/store'
import http from '@/http'

export default {
  data() {
    return {
      store,
      categories: [],
      colors: [
        '#f87171',
        '#fb923c',
        '#fbbf24',
        '#84cc16',
        '#22d3ee',
        '#a78bfa',
        '#f472b6',
      ]
    }
  },
  methods: {
    async getCategories() {
      this.loading = true
      await http.get('/api/categories')
      .then(response => (this.categories = response.data))
      .catch(err => console.log(err))
      this.loading = false
    },
  },
  mounted() {
    this.getCategories()
  }
}
</script>

<template>
  <main>
    <div>
      <img :src="HomeImage" class="w-full h-[50vh] object-cover">
    </div>
    <div class="flex">
      <div class="w-1/3 bg-primary p-8">
        <h1 class="font-chonburi font-bold text-secondary text-[60px]">
          WELCOME<br>TO<br><span class="text-white">{{ store.shopName }}</span><br>SHOP
        </h1>
      </div>
      <Section title="เริ่มสั่งซื้อได้เลย" class="w-2/3">
        <p class="indent-12 text-2xl pt-4">
          ยินดีต้อนรับสู่ร้านอาหาร {{ store.shopName }} ของเรา ท่านสามารถเลือกสั่งอาหารได้เลยในเว็บไซต์นี้ ท่านสามารถเลือกบันทึกอาหารที่ชื่นชอบ หรือตรวจสอบรายการอาหารที่กำลังทำอยู่ได้
        </p>
      </Section>
    </div>
    <div class="bg-white font-mali">
      <div class="container mx-auto py-8">
        <h1 class="text-2xl font-pattaya">หมวดหมู่</h1><br>
        <router-link to="/products" class="text-white p-6 mx-4 my-2 rounded-lg shadow-lg hover:shadow-xl flex hover:scale-105 transition duration-150 min-h-[230px] bg-[url('/src/assets/images/food_profile.jpg')] object-scale-down object-center">
          <div class="w-1/6">
            <span class="text-[120px]">🍴</span>
          </div>
          <div class="w-5/6 pt-8">
            <h2 class="text-8xl font-pattaya">ทั้งหมด</h2>
            <p>รายการอาหารทั้งหมด</p>
          </div>
        </router-link>
        <div class="grid grid-cols-2">
          <router-link
          v-for="(item, index) in categories" :to="'/products?cate_id=' + item.id"
          :style="{
            backgroundColor: '#f87171',
            // backgroundImage: `url('${store.apiURL + item.file_path}')`,
            // backgroundImage: 'url(' + store.apiURL + item.file_path + ')'
          }"
          class="text-white p-6 mx-4 my-2 rounded-lg shadow-lg hover:shadow-xl flex hover:scale-105 transition duration-150 min-h-[230px]"
          >
            <div class="w-1/3">
              <span class="text-[120px]">{{ item.emoji }}</span>
            </div>
            <div class="w-2/3 py-2">
              <h2 class="text-5xl font-pattaya py-2">{{ item.name }}</h2>
              <p>{{ item.description }}</p>
              <!-- <img :src="store.apiURL + item.file_path"> -->
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>
