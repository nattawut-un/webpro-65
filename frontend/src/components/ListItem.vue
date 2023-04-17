<template>
  <div class="bg-secondary hover:bg-primary rounded-[1.5rem] font-mali text-black hover:text-white transition ease-out duration-100 shadow-lg border-primary border-4">
    <router-link :to="'/products/'+ product.id">
      <img class="rounded-[1.3rem] aspect-square object-cover w-full" :src="store.apiURL + product.file_path" @error="setToDefaultImg">
      <div class="flex">
        <div class="p-6">
          <h1 class="text-2xl">{{ product.name }}</h1>
          <p>{{ product.price }} บาท</p>
        </div>
      </div>
    </router-link>
    <div class="px-4 pb-4 grid grid-cols-2 gap-2">
      <button class="bg-white hover:bg-gray-300 rounded-full text-black py-2">ชื่นชอบ</button>
      <button class="bg-white hover:bg-gray-300 rounded-full text-black py-2">เพิ่มลงตะกร้า</button>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from '../store.js'
import NotFoundImage from '../assets/images/notfound.png'

export default {
  props: ['product'],
  data() {
    return {
      store
    }
  },
  methods: {
    setToDefaultImg(e) {
      e.target.src = NotFoundImage
    },
  }
}
</script>
