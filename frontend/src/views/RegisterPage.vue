<script setup>
import SectionFull from '../components/SectionFull.vue'
</script>

<script>
import axios from 'axios'
import validator from 'validator'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordRe: '',
      serverErr: ''
    }
  },
  methods: {
    async register() {
      // alert(this.username + '\n' + this.password)
      await axios.post('http://localhost:3000/api/register', {
        username: this.username,
        password: this.password,
        email: this.email,
      }, {
        withCredentials: true
      }).then(response => {
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        this.serverErr = err.response.data
      })
    },
  },
  computed: {
    isUsernameRight() {
      return this.username.length >= 5
    },
    isEmailRight() {
      return validator.isEmail(this.email)
    },
    isPwReRight() {
      return this.password == this.passwordRe
    },
    isPwSafe() {
      let lv = 0

      // check if has upper
      if (this.password.match(/[A-Z]/)) { lv += 1 }
      // check if has lower
      if (this.password.match(/[a-z]/)) { lv += 1 }
      // check if has number
      if (this.password.match(/[0-9]/)) { lv += 1 }
      // check if longer than 5/12/20
      if (this.password.length >= 20) { lv += 3 }
      else if (this.password.length >= 12) { lv += 2 }
      else if (this.password.length >= 6) { lv += 1 }

      let msg
      switch (lv) {
        case 0: msg = 'ไม่มี'; break;
        case 1: msg = 'ไม่ปลอดภัย'; break;
        case 2: msg = 'ไม่ปลอดภัย'; break;
        case 3: msg = 'ปลอดภัยน้อย'; break;
        case 4: msg = 'ปลอดภัยปานกลาง'; break;
        case 5: msg = 'ปลอดภัยดี'; break;
        case 6: msg = 'ปลอดภัยดีมาก'; break;
        default: msg = 'ไม่มี'; break;
      }

      return {
        level: lv,
        message: msg,
      }
    },
    isPwValid() {
      return [
        this.password.match(/[A-Z]/), // one upper
        this.password.match(/[a-z]/), // one lower
        this.password.match(/[0-9]/), // one number
        this.password.length >= 6,
      ].every(e => e) // check if all true
    },
    validated() {
      return [
        this.isUsernameRight,
        this.isEmailRight,
        this.isPwValid,
        this.isPwReRight,
      ].every(e => e)
    }
  },
  mounted() {
    this.username = ''
    this.email = ''
    this.password = ''
    this.passwordRe = ''
    this.serverErr = ''
  }
}
</script>

<template>
  <SectionFull title="สมัครสมาชิก" image="register">
    <form>
      <div class="my-4">
        <label>ชื่อผู้ใช้:</label><br>
        <input type="text" v-model="username" placeholder="Username" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span v-show="!isUsernameRight" class="ml-3 text-red-600">ชื่อผู้ใช้ต้องมีความยาวไม่ต่ำกว่า 5 ตัวอักษร</span>
      </div>
      <div class="my-4">
        <label>อีเมล:</label><br>
        <input type="text" v-model="email" placeholder="Email" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span v-show="!isEmailRight" class="ml-3 text-red-600">อีเมลไม่ถูกต้อง</span>
      </div>
      <div class="my-4">
        <label>รหัสผ่าน:</label><br>
        <input type="password" v-model="password" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span class="ml-3" :class="[ isPwValid ? 'text-gray-500' : 'text-red-600' ]">ความปลอดภัย: {{ isPwSafe.message }}</span>
        <div class="h-1 w-[275px] mt-1 bg-neutral-200">
          <div
            class="h-1 bg-primary"
            :class="{
              'w-0'     : isPwSafe.level == 0,
              'w-[16%]' : isPwSafe.level == 1,
              'w-[33%]' : isPwSafe.level == 2,
              'w-[50%]' : isPwSafe.level == 3,
              'w-[66%]' : isPwSafe.level == 4,
              'w-[83%]' : isPwSafe.level == 5,
              'w-full'  : isPwSafe.level == 6,
            }"
          ></div>
        </div>
      </div>
      <div class="my-4">
        <label>รหัสผ่านอีกครั้ง:</label><br>
        <input type="password" v-model="passwordRe" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span v-show="!isPwReRight" class="ml-3 text-red-600">รหัสผ่านไม่ตรงกับที่กรอกด้านบน</span>
      </div>
    </form><br><hr><br><br>
    <button
      @click="validated ? register() : null"
      class="text-white font-bold px-6 py-2 rounded-full text-2xl"
      :class="[ validated ? 'bg-primary' : 'bg-secondary' ]"
    >สมัครสมาชิก</button>
    <p class="mt-6 text-red-500 font-bold">{{ serverErr }}</p>
  </SectionFull>
</template>