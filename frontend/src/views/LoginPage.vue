<script setup>
import SectionFull from '@/components/SectionFull.vue'
import LoginImage from '@/assets/images/login.jpg'
</script>

<script>
import http from '@/http'
import { store } from '@/store'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

export default {
  data() {
    return {
      $v: useVuelidate(),
      store,
      username: '',
      password: '',
      serverErr: ''
    }
  },
  validations() {
    return {
      username: {
        required,
        minLength: minLength(5)
      },
      password: {
        required,
        minLength: minLength(6)
      },
    }
  },
  methods: {
    async login() {
      await http.post('/api/login', {
        username: this.username,
        password: this.password
      }).then(res => {
        localStorage.setItem('token', res.data.token)
        this.$emit('auth-change')
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
  },
}
</script>

<template>
  <SectionFull title="ลงชื่อเข้าใช้" :image="LoginImage">
    <form>
      <div class="my-4">
        <label>ชื่อผู้ใช้:</label><br>
        <input type="text" v-model="$v.username.$model" placeholder="Username" class="border-2 rounded-full mt-2 px-4 text-xl">
        <label class="text-red-500 ml-2" v-if="$v.username.minLength.$invalid">ต้องยาวกว่า 5 ตัว</label>
      </div>
      <div class="my-4">
        <label>รหัสผ่าน:</label><br>
        <input type="password" v-model="$v.password.$model" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
        <label class="text-red-500 ml-2" v-if="$v.password.minLength.$invalid">ต้องยาวกว่า 6 ตัว</label>
      </div>
    </form><br><hr><br><br>
    <button @click="login()" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-2xl">ลงชื่อเข้าใช้</button>
    <p class="mt-6 text-red-500 font-bold">{{ serverErr.msg }}</p>
  </SectionFull>
</template>