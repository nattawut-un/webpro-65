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
      products: [],
      showImage: true,
      searchKeyword: ''
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
      const result = await http.get('/api/get_user')
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
  computed: {
    searchedList() {
      if (!this.searchKeyword.length) { return this.products }
      return this.products.filter(item => item.name.includes(this.searchKeyword))
    }
  },
  mounted() {
    this.getProducts()
  }
}
</script>

<template>
  <main>
    <Section title="รายการสินค้าทั้งหมด">
      <div class="flex">
        <div class="w-1/2">
          แก้ไขข้อมูลของสินค้านะจ๊ะ
          <br><br>
          <div class="flex">
            <router-link to="/admin/products" class="bg-primary px-2 py-1 text-white rounded-lg mr-2">สินค้า</router-link>
            <router-link to="/admin/categories" class="bg-secondary px-2 py-1 text-black rounded-lg">หมวดหมู่</router-link>
          </div><br>
          <router-link class="bg-secondary hover:bg-primary px-4 py-2 rounded-full text-black hover:text-white font-bold transition ease-out duration-200" to="/admin/products/add">เพิ่มสินค้า</router-link><br><br>
          <router-link to="/admin" class="bg-secondary hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2">กลับไปหน้าหลัก</router-link>
        </div>
        <div class="w-1/2 bg-white p-4 rounded-xl">
          <h1 class="text-xl font-pattaya">ตั้งค่ามุมมอง</h1><hr class="mb-3">
          <label>ค้นหา <span class="text-xs">({{ searchedList.length }}/{{ products.length }})</span></label><br>
          <input type="text" v-model.trim="searchKeyword" class="bg-gray-100 rounded-full px-2"><br><br>
          <input type="checkbox" id="show_img" v-model="showImage">
          <label for="show_img" class="ml-2">แสดงรูปภาพ</label>
        </div>
      </div>
    </Section>
    <div class="bg-white p-8">
      <!-- each item -->
      <div v-show="loading">
        <div class="flex items-center justify-center h-[45vh]">
          <div class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      </div>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg font-mali">
        <table class="w-full text-left">
          <thead class="text-sm uppercase bg-gray-300 text-black">
            <tr>
              <th scope="col" class="px-6 py-3" v-show="showImage">
                รูป
              </th>
              <th scope="col" class="px-6 py-3">
                ไอดี
              </th>
              <th scope="col" class="px-6 py-3">
                ชื่อ
              </th>
              <th scope="col" class="px-6 py-3">
                ราคา
              </th>
              <th scope="col" class="px-6 py-3">
                ประเภท
              </th>
              <th scope="col" class="px-6 py-3">
                ยอดขายทั้งหมด
              </th>
              <th scope="col" class="px-6 py-3">
                ผู้ชื่นชอบ
              </th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">แก้ไข</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-gray-100 border-b hover:bg-gray-200 text-black transition ease-out duration-100"
              :class="[ this.showImage ? 'text-2xl' : 'text-md' ]"
              v-for="item in searchedList" :key="item.id">
              <td class="px-6 py-4" v-show="showImage">
                <img :src="store.apiURL + item.images[0].path" class="aspect-square object-cover rounded-full h-24">
              </td>
              <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                {{ item.id }}
              </th>
              <th class="px-6 py-4 font-bold whitespace-nowrap">
                {{ item.title }}
              </th>
              <td class="px-6 py-4">
                {{ item.price }}
              </td>
              <td class="px-6 py-4">
                {{ item.category.emoji }} {{ item.category.title }}
              </td>
              <td class="px-6 py-4">
                {{ item.purchase_amount }}
              </td>
              <td class="px-6 py-4">
                {{ item.total_user_favs }}
              </td>
              <td class="px-6 py-4 text-right">
                <router-link :to="'/admin/products/' + item.id"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline">✏️แก้ไข</router-link>
              </td>
            </tr>
            <tr class="bg-gray-300 text-black font-bold">
              <td></td>
              <td></td>
              <td>
                จำนวนทั้งหมด {{ products.length }} รายการ
              </td>
              <td class="py-2">
                <router-link to="/admin/products/add" class="hover:bg-gray-100 rounded-full px-3 py-1 transition ease-out duration-100">➕ เพิ่ม</router-link>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </main>
</template>