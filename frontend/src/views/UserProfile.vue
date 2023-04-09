<script setup>
import Section from '@/components/Section.vue'
import AddressCard from '@/components/AddressCard.vue'
import ProfileImage from '@/assets/images/profile.jpg'
</script>

<script>
import http from '@/http'
import { store } from '@/store'

export default {
  data() {
    return {
      store,
      userInfo: {},
      address: [],
      loading: false,
      editPassword: {
        oldPassword: '',
        newPassword: '',
        newPasswordRe: '',
      }
    }
  },
  methods: {
    async userFetch() {
      this.loading = true

      if (this.$cookies.isKey('jwt-token')) {
        const result = await http.post('/api/get_user')
        .then(res => {
          if (res.error) {
            alert('โปรดลงชื่อเข้าใช้ใหม่')
            this.$router.push('/login')
          } else {
            this.userInfo = JSON.parse(JSON.stringify(res.data.data))
            this.address = JSON.parse(JSON.stringify(res.data.address))
          }
        }).catch((err) => {
          console.log(err)
          this.$router.push('/')
        })
      } else {
        alert('โปรดลงชื่อเข้าใช้ใหม่')
        this.$router.push('/login')
      }

      this.loading = false
    },
    async changePassword() {
      if (this.newPassword === this.newPasswordRe && confirm('แก้ไขรหัสผ่าน?')) {
        const result = await http.put('/api/user/change_password', {
          id: this.userInfo.id,
          oldPassword: this.editPassword.oldPassword,
          newPassword: this.editPassword.newPassword
        })
        .then(res => {
          alert('เปลี่ยนรหัสผ่านสำเร็จ')
          this.$router.go(0)
        }).catch(err => {
          console.log(err)
          if (err.response.status === 401) {
            alert('รหัสผ่านเก่าผิด')
          }
        })
      }
    }
  },
  mounted() {
    this.userInfo = {}
    this.address = []
    this.userFetch()
  }
}
</script>

<template>
  <main>
    <img src="../assets/images/food_profile.jpg" class="w-full h-[30vh] object-cover">
    <Section v-show="loading">
      <div class="flex items-center justify-center h-[45vh]">
        <div class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    </Section>

    <div v-show="loading">
      <div class="flex items-center justify-center h-[45vh]">
        <div class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    </div>

    <Section v-show="!loading" title="ข้อมูลผู้ใช้">
      <br>
      <div class="flex">
        <div class="w-1/5">
          <img :src="ProfileImage" class="aspect-square object-cover w-48 rounded-full">
        </div>
        <div class="w-4/5">
          <span v-show="userInfo.is_admin" class="text-lg bg-red-500 text-white px-3 py-1 rounded-full">ADMIN</span>
          <h1 class="text-5xl font-bold">{{ userInfo.username }}
          </h1>
          <p class="text-black/50 font-mono">id: {{ userInfo.id }}</p><br>
          <hr class="border-2 border-black/30 rounded-full"><br>
          <p v-for="(value, key) in userInfo">{{ key }}: {{ value }}</p>
        </div>
      </div>
    </Section>
    <Section v-show="!loading" title="ที่อยู่">
      <div class="grid grid-cols-2 gap-4">
        <AddressCard v-for="addr in address" :main="addr.main_addr">
          {{ addr.address }}
        </AddressCard>
      </div>
    </Section>

    <Section v-show="!loading" title="ตั้งค่า">
      <div>
        <label>รหัสเก่า</label><br>
        <input type="text" v-model="editPassword.oldPassword" class="border-2 rounded-full mt-2 px-4">
      </div><br>
      <div>
        <label>รหัสใหม่</label><br>
        <input type="text" v-model="editPassword.newPassword" class="border-2 rounded-full mt-2 px-4">
      </div><br>
      <div>
        <label>รหัสใหม่อีกครั้ง</label><br>
        <input type="text" v-model="editPassword.newPasswordRe" class="border-2 rounded-full mt-2 px-4">
      </div><br>
      <button @click="changePassword()" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">แก้ไขรหัสผ่าน</button>
    </Section>

    <Section v-show="!loading && userInfo.is_admin" title="ผู้ดูแลระบบ">
      <p>ตั้งค่าระบบ และรายการต่างๆ ของร้าน</p>
      <br>
      <router-link to="/admin" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">แอดมิน</router-link>
    </Section>
  </main>
</template>
