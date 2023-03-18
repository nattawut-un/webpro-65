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
    register() {
      console.log(this.username + '\n' + this.password)
      // await axios.post('http://localhost:3000/api/login', {
      //   username: this.username,
      //   password: this.password
      // }, {
      //   withCredentials: true
      // }).then(response => {
      //   this.$router.push('/')
      // }).catch(err => {
      //   console.log(err)
      // })
    },
  },
  computed: {
    isUsernameRight() {
      return this.username.length > 5 ? '' : 'ชื่อผู้ใช้ต้องมีความยาวไม่ต่ำกว่า 6 ตัวอักษร'
    },
    isEmailRight() {
      return validator.isEmail(this.email) ? '' : 'อีเมลไม่ถูกต้อง'
    },
    isPwReRight() {
      return this.password == this.passwordRe ? '' : 'รหัสผ่านไม่ตรงกับที่กรอกด้านบน'
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

      // 16 33 50 66 83 100

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
    validated() { return this.isUsernameRight && this.isPwReRight && this.password.length >= 6 }
  },
  mounted() {
    this.username = ''
    this.email = ''
    this.password = ''
    this.passwordRe = ''
  }
}
</script>

<template>
  <SectionFull title="สมัครสมาชิก" image="register">
    <form>
      <div class="my-4">
        <label>ชื่อผู้ใช้:</label><br>
        <input type="text" v-model="username" placeholder="Username" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span class="ml-3 text-red-600">{{ isUsernameRight }}</span>
      </div>
      <div class="my-4">
        <label>อีเมล:</label><br>
        <input type="text" v-model="email" placeholder="Email" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span class="ml-3 text-red-600">{{ isEmailRight }}</span>
      </div>
      <div class="my-4">
        <label>รหัสผ่าน:</label><br>
        <input type="text" v-model="password" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span class="ml-3 text-gray-500">ความปลอดภัย: {{ isPwSafe.message }}</span>
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
        <input type="text" v-model="passwordRe" placeholder="Password" class="border-2 rounded-full mt-2 px-4 text-xl">
        <span class="ml-3 text-red-600">{{ isPwReRight }}</span>
      </div>
    </form><br><hr><br><br>
    <button @click="validated ? register() : null" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-2xl">สมัครสมาชิก</button>
    <p class="mt-6 text-red-500">{{ serverErr }}</p>
  </SectionFull>
</template>