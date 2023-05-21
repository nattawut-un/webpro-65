<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<script>
import { store } from '@/store'
import http from '@/http'

export default {
  data() {
    return {
      store
    }
  },
  mounted() {
    if (!localStorage.getItem('cart')) {
      console.log('Intialize cart')
      localStorage.setItem('cart', '[]')
    }

    this.onAuthChange()
  },
  beforeRouteEnter(to, from, next) {
    this.onAuthChange()
  },
  methods: {
    async onAuthChange() {
      const token = localStorage.getItem('token')
      if (token) {
        await this.getUser()
      }
    },
    async getUser() {
      await http.get('/api/get_user').then(res => {
        this.store.user = res.data
      })
    }
  },
}
</script>

<template>
  <main class="bg-main bg-fixed min-h-[100%]">
    <NavBar></NavBar>
    <router-view v-slot="{ Component }" @auth-change="onAuthChange">
      <transition name="page-opacity" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer></Footer>
  </main>
</template>

<style>
.page-opacity-enter-active,
.page-opacity-leave-active {
  transition: .15s ease all;
}

.page-opacity-enter-from,
.page-opacity-leave-to {
  opacity: 0;
  transform: translateY(-50px) scale(0.95);
}
</style>
