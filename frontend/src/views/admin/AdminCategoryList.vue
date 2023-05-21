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
      categories: [],
      newCategory: {
        emoji: '',
        name: '',
        description: ''
      }
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
    async addCategory() {
      if (!this.newCategory.name.trim()) {
        alert('โปรดกรอกชื่อ')
        return
      }
      const result = await http.post('/api/categories/add', {
        name: this.newCategory.name,
        description: this.newCategory.description,
        emoji: this.newCategory.emoji,
      }).then(response => {
        alert('เพิ่มเสร็จสิ้น')
        this.getCategories()
      }).catch(err => {
        console.log(err)
      })
    },
    async deleteCategory(cate) {
      if (cate.prod_amount > 0) {
        alert('ไม่สามารถลบได้\nมีเมนูที่ใช้หมวดหมู่นี้อยู่ ' + cate.prod_amount + ' อัน')
      } else {
        if (confirm('คุณต้องการลบหมวดหมู่ "' + cate.name + '" หรือไม่\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
          await http.delete(`/api/categories/${cate.id}/delete`)
          .then(res => {
            alert('การลบเสร็จสิ้น')
            this.getCategories()
          }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  },
  mounted() {
    this.getCategories()
  }
}
</script>

<template>
  <main>
    <Section title="รายการหมวดหมู่ทั้งหมด">
      <div class="flex">
        <div class="w-1/2">
          แก้ไขข้อมูลของสินค้านะจ๊ะ
          <br><br>
          <div class="flex">
            <router-link to="/admin/products" class="bg-secondary px-2 py-1 text-black rounded-lg mr-2">สินค้า</router-link>
            <router-link to="/admin/categories" class="bg-primary px-2 py-1 text-white rounded-lg">หมวดหมู่</router-link>
          </div><br>
          <router-link to="/admin" class="bg-secondary hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2">กลับไปหน้าหลัก</router-link>
        </div>
        <div class="w-1/2 bg-white p-4 rounded-xl">
          <h1 class="text-xl font-pattaya">เพิ่มหมวดหมู่</h1><hr class="mb-3">
          <label>ชื่อ <span class="text-red-500">*</span></label><br>
          <input type="text" v-model.trim="newCategory.emoji" placeholder="อิโมจิ" class="bg-gray-100 rounded-full px-2 w-14">&nbsp;
          <input type="text" v-model.trim="newCategory.name" placeholder="ชื่อ" class="bg-gray-100 rounded-full px-2"><br>
          <label>คำอธิบาย </label><br>
          <textarea rows="2" cols="50" v-model.trim="newCategory.description" placeholder="คำอธิบาย" class="bg-gray-100 rounded-xl px-2"></textarea><br><br>
          <button class="bg-secondary hover:bg-primary hover:text-white px-3 py-1 rounded-full transition ease-in-out duration-200" @click="addCategory()">เพิ่ม</button>&nbsp;<span class="text-xs" v-show="!newCategory.name">โปรดกรอกชื่อ</span>
        </div>
      </div>
    </Section>
    <div class="bg-white p-8">
      <!-- header -->
      <div class="font-mali m-8 px-8 rounded-lg flex">
        <div class="w-1/6">
          <p>ไอดี</p>
        </div>
        <div class="w-3/6">
          <h1 class="font-bold text-2xl">ชื่อ</h1>
        </div>
        <div class="w-1/6">
          <p>จำนวน</p>
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
      <div class="font-mali bg-gray-200 shadow-lg m-8 px-8 py-6 rounded-lg flex" v-for="item in categories">
        <div class="w-1/6">
          <p class="text-2xl">{{ item.id }} {{ item.emoji }}</p>
        </div>
        <div class="w-3/6">
          <h1 class="font-bold text-2xl">{{ item.name }}</h1>
          <p>{{ item.description }}</p>
        </div>
        <div class="w-1/6">
          <p class="font-bold text-xl">{{ item.prod_amount }}</p>
        </div>
        <div class="w-1/6">
          <button class="bg-red-500 text-white px-4 py-2 rounded-full mr-2" @click="deleteCategory(item)">ลบ</button>
        </div>
      </div>
    </div>
  </main>
</template>
