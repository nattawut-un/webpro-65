<template>
  <router-link :to="'/products/'+ link" class="bg-secondary hover:bg-primary rounded-[1.5rem] font-mali text-black hover:text-white transition ease-out duration-100 shadow-lg border-primary border-4">
    <img class="rounded-[1.3rem] aspect-square object-cover" :src="store.apiURL + '/images/products/' + link + '.jpg'" @error="setToDefaultImg">
    <div class="flex">
      <div class="p-6 w-4/5">
        <h1 class="text-2xl">{{ name }}</h1>
        <p>{{ price }} บาท</p>
      </div>
      <div class="py-6 w-1/5">
        <button @click="">
          <img src="@/svg/Heart.svg" class="w-11">
        </button>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { store } from '../store.js'

export default {
  props: ['name', 'price', 'link'],
  data() {
    return {
      store
    }
  },
  methods: {
    setToDefaultImg(e) {
      e.target.src = './src/assets/images/notfound.png'
    }
  }
}
</script>
