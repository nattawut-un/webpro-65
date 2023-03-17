<script setup>
import Section from '../components/Section.vue'
</script>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async login() {
      // console.log(this.username + '\n' + this.password)
      await axios.post('http://localhost:3000/api/login', {
        username: this.username,
        password: this.password
      }, {
        withCredentials: true
      }).then(response => {
        // console.log('Cookie:', document.cookie)
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
      })
      // if (this.$cookies.isKey('session_token')) {
      // }
    },
  },
  mounted() {
    window.scrollTo(0, 0)
    this.username = 'admin'
    this.password = 'password'
  }
}
</script>

<template>
  <div class="bg-white/80 font-mali">
    <img src="../assets/images/homepage.jpg" class="w-full h-[30vh] object-cover">
    <Section title="ลงชื่อเข้าใช้"></Section>
    <div class="containter mx-auto p-16 w-1/2 min-w-[500px] bg-white my-16 rounded-xl border-4 text-[200%]">
      <form>
        <label class="font-pattaya">Username:</label><br>
        <input type="text" v-model="username" placeholder="Username" class="border-2 rounded-full ml-4 px-4"><br>
        <label class="font-pattaya">Password:</label><br>
        <input type="text" v-model="password" placeholder="Password" class="border-2 rounded-full ml-4 px-4"><br><br><hr><br>
      </form>
      <div class="text-2xl">
        <p><b>username:</b> {{ username }}</p>
        <p><b>password:</b> {{ password }}</p>
      </div><br>
      <button @click="login()" class="bg-primary text-white font-bold px-6 py-1 rounded-full shadow-md text-2xl">Login</button>
    </div>
  </div>
</template>