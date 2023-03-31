<script setup>
import SectionFull from '@/components/SectionFull.vue'
import LoginImage from '@/assets/images/login.jpg'
</script>

<script>
import http from '@/http'

export default {
  data() {
    return {
      username: '',
      password: '',
      serverErr: ''
    }
  },
  methods: {
    async login() {
      await http.post('http://localhost:3000/api/login', {
        username: this.username,
        password: this.password
      }).then(response => {
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        this.serverErr = err.response.data
      })
    },
  },
  mounted() {
    this.username = 'admin'
    this.password = 'password'
  }
}
</script>

<template>
  <SectionFull title="ลงชื่อเข้าใช้" :image="LoginImage">
    <form>
      <div class="my-4">
        <label>ชื่อผู้ใช้:</label><br>
        <input type="text" v-model="username" placeholder="Username" class="border-2 rounded-full mt-2 px-4 text-xl">
      </div>
      <div class="my-4">
        <label>รหัสผ่าน:</label><br>
        <input type="password" v-model="password" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
      </div>
    </form><br><hr><br><br>
    <button @click="login()" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-2xl">ลงชื่อเข้าใช้</button>
    <p class="mt-6 text-red-500 font-bold">{{ serverErr }}</p>
  </SectionFull>
</template>