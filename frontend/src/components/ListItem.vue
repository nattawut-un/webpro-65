<template>
  <div class="bg-secondary hover:bg-primary rounded-[1.5rem] font-mali text-black hover:text-white transition ease-out duration-100 shadow-lg border-primary border-4">
    <router-link :to="'/products/'+ product.id">
      <img class="rounded-[1.3rem] aspect-square object-cover w-full" :src="store.apiURL + product.images[0].path" @error="setToDefaultImg">
      <div class="flex">
        <div class="p-6">
          <h1 class="text-2xl">{{ product.title }}</h1>
          <p>{{ product.price }} บาท</p>
        </div>
      </div>
    </router-link>
    <div class="px-4 pb-4 grid grid-cols-2 gap-2" v-if="store.user.data">
      <button class="rounded-full text-black py-2 bg-pink-400 hover:bg-pink-300" v-if="product.userFavs.length > 0" @click="deleteFav(product)">
        <div class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mt-1 mr-2" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>
          ชื่นชอบ
        </div>
      </button>
      <button class="rounded-full text-black py-2 bg-white hover:bg-gray-300" v-else @click="addFav(product)">
        <div class="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart mt-1 mr-2" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>
          ชื่นชอบ
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from '@/store'
import http from '@/http'
import NotFoundImage from '@/assets/images/notfound.png'

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
    async addFav(product) {
      await http.post('/api/favs/add', {
        prod_id: product.id,
      }).then(res => {
        product.userFavs = [1]
      }).catch(err => {
        console.log(err)
      })
    },
    async deleteFav(product) {
      await http.delete('/api/favs/remove', {
        data: {
          prod_id: product.id,
        }
      }).then(res => {
        product.userFavs = []
        // this.$emit('productRefresh')
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>
