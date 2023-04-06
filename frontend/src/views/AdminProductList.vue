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
      await http.get(this.store.apiURL + '/api/products')
      .then(response => (this.products = response.data))
      .catch(err => console.log(err))
      this.loading = false
    }
  },
  mounted() {
    this.getProducts()
  }
}
</script>

<template>
  <main>
    <Section title="Admin Product List">
      i sus
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
      <router-link class="font-mali bg-gray-200 shadow-lg m-8 px-8 py-6 rounded-lg flex" v-for="item in products" :to="'/admin/products/' + item.id">
        <div class="w-1/6">
          <p>{{ item.id }}</p>
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