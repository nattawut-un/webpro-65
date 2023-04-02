<script setup>
import Section from '@/components/Section.vue'
import AddressCard from '@/components/AddressCard.vue'
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
        const result = await http.post(this.store.apiURL + '/api/get-user')
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
          alert('[catch] ' + err)
          this.$router.push('/')
        })
      } else {
        alert('โปรดลงชื่อเข้าใช้ใหม่')
        this.$router.push('/login')
      }
      this.loading = false
    },
    changePassword() {
      alert('deez nuts')
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
    <Section v-show="!loading" title="ข้อมูลผู้ใช้">
      <p v-for="(value, key) in userInfo">{{ key }}: {{ value }}</p>
    </Section>
    <Section title="ที่อยู่">
      <AddressCard v-for="addr in address" :main="addr.main_addr">
        {{ addr.address }}
      </AddressCard>
    </Section>
    <Section title="ตั้งค่า">
      <form @submit="changePassword">
        <div>
          <label>รหัสเก่า</label><br>
          <input type="text" v-bind="editPassword.oldPassword" class="border-2 rounded-full mt-2 px-4">
        </div><br>
        <div>
          <label>รหัสใหม่</label><br>
          <input type="text" v-bind="editPassword.newPassword" class="border-2 rounded-full mt-2 px-4">
        </div><br>
        <div>
          <label>รหัสใหม่อีกครั้ง</label><br>
          <input type="text" v-bind="editPassword.newPasswordRe" class="border-2 rounded-full mt-2 px-4">
        </div><br>
        <input type="submit" value="แก้ไขรหัสผ่าน" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">
      </form>
    </Section>
    <Section title="ผู้ดูแลระบบ" v-show="userInfo.is_admin">
      <br>
      <router-link to="/admin" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">แอดมิน</router-link>
    </Section>
  </main>
</template>
