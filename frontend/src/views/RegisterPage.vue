<script setup>
import SectionFull from '@/components/SectionFull.vue'
import RegisterImage from '@/assets/images/register.jpg'
</script>

<script>
import http from '@/http'
import { store } from '@/store'
import useVuelidate from '@vuelidate/core'
import {
  required, minLength, maxLength, email, helpers, alphaNum, sameAs
} from '@vuelidate/validators'

export default {
  data() {
    return {
      v$: useVuelidate(),
      store,
      username: '',
      first_name: '',
      last_name: '',
      mail: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      serverErr: ''
    }
  },
  validations() {
    return {
      username: {
        required: helpers.withMessage('จำเป็นต้องกรอกชื่อผู้ใช้', required),
        minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 5 ตัวอักษร', minLength(5)),
        maxLength: helpers.withMessage('ต้องกรอกไม่เกิน 30 ตัวอักษร', maxLength(30)),
        alphaNum: helpers.withMessage('ต้องมีแค่ตัวอักษรกับตัวเลข', alphaNum)
      },
      first_name: {
        required: helpers.withMessage('จำเป็นต้องกรอกชื่อจริง', required),
        minLength: helpers.withMessage('ต้องกรอกชื่อจริงอย่างน้อย 3 ตัวอักษร', minLength(3))
      },
      last_name: {
        required: helpers.withMessage('จำเป็นต้องกรอกนามสกุล', required),
        minLength: helpers.withMessage('ต้องกรอกนามสกุลอย่างน้อย 3 ตัวอักษร', minLength(3))
      },
      password: {
        required: helpers.withMessage('จำเป็นต้องกรอกรหัสผ่าน', required),
        minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 8 ตัวอักษร', minLength(8)),
        oneUpper: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวพิมพ์ใหญ่', helpers.regex(/[A-Z]/)),
        oneLower: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวพิมพ์เล็ก', helpers.regex(/[a-z]/)),
        oneNumber: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวเลข', helpers.regex(/[0-9]/)),
      },
      confirmPassword: {
        required: helpers.withMessage('จำเป็นต้องกรอกรหัสผ่านอีกครั้ง', required),
        sameAs: helpers.withMessage('รหัสผ่านไม่ตรงกัน', sameAs(this.password))
      },
      mail: {
        required: helpers.withMessage('จำเป็นต้องกรอกอีเมล', required),
        email: helpers.withMessage('อีเมลที่กรอกไม่ถูกต้อง', email),
      },
      phone: {
        required: helpers.withMessage('จำเป็นต้องกรอกเบอร์โทรศัพท์', required),
        isPhone: helpers.withMessage('ข้อมูลที่กรอกไม่ใช่เบอร์โทรศัพท์', helpers.regex(/^0[0-9]{9}$/))
      },
      address: {
        required: helpers.withMessage('จำเป็นต้องกรอกที่อยู่', required),
        minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 20 ตัวอักษร', minLength(20)),
      }
    }
  },
  methods: {
    async register() {
      this.v$.$touch()

      if (this.v$.$invalid) {
        return console.log('invalid is true')
      }

      await http.post('/api/register', {
        username: this.username,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name,
        phone: this.phone,
        email: this.mail,
        address: this.address
      }).then(response => {
        alert('การสมัครเสร็จสิ้น โปรดลงชื่อเข้าใช้')
        this.$router.push('/login')
      }).catch(err => {
        console.log(err)
        this.serverErr = err.response.data
      })
    },
  },
}
</script>

<template>
  <SectionFull title="สมัครสมาชิก" :image="RegisterImage">
    <div class="my-4">
      <div class="w-1/2">
        <label>ชื่อจริง</label><br>
        <div class="flex">
          <input type="text" v-model="v$.first_name.$model" @blur="v$.first_name.$touch" placeholder="ชื่อจริง" class="border-2 rounded-xl my-2 px-4 text-lg">&nbsp;
          <input type="text" v-model="v$.last_name.$model" @blur="v$.last_name.$touch" placeholder="นามสกุล" class="border-2 rounded-xl my-2 px-4 text-lg">
        </div>
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.first_name.$errors">{{ error.$message }}</p>
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.last_name.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>ชื่อผู้ใช้</label><br>
        <input type="text" v-model="v$.username.$model" @blur="v$.username.$touch" placeholder="ชื่อผู้ใช้" class="border-2 rounded-xl my-2 px-4 text-lg">
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.username.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>รหัสผ่าน</label><br>
        <input type="password" v-model="v$.password.$model" @blur="v$.password.$touch" placeholder="รหัสผ่าน" class="border-2 rounded-xl my-2 px-4 text-lg">
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.password.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>ยืนยันรหัสผ่าน</label><br>
        <input type="password" v-model="v$.confirmPassword.$model" @blur="v$.confirmPassword.$touch" placeholder="ยืนยันรหัสผ่าน" class="border-2 rounded-xl my-2 px-4 text-lg">
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.confirmPassword.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>อีเมล</label><br>
        <input type="text" v-model="v$.mail.$model" @blur="v$.mail.$touch" placeholder="อีเมล" class="border-2 rounded-xl my-2 px-4 text-lg">
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.mail.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>เบอร์มือถือ</label><br>
        <input type="text" v-model="v$.phone.$model" @blur="v$.phone.$touch" placeholder="เบอร์มือถือ" class="border-2 rounded-xl my-2 px-4 text-lg">
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.phone.$errors">{{ error.$message }}</p>
      </div>
    </div>

    <div class="my-4 flex">
      <div class="w-1/2">
        <label>ที่อยู่</label><br>
        <textarea cols="22" v-model="v$.address.$model" @blur="v$.address.$touch" placeholder="ที่อยู่" class="border-2 rounded-xl my-2 px-4 text-lg"></textarea>
      </div>
      <div class="w-1/2">
        <p class="ml-3 text-red-600 text-sm" v-for="(error, index) in v$.address.$errors">{{ error.$message }}</p>
      </div>
    </div>
    <br><hr><br><br>
    <button
      @click="register()"
      class="text-white font-bold px-6 py-2 rounded-full text-2xl bg-primary"
    >สมัครสมาชิก</button>
    <p class="mt-6 text-red-500 font-bold">{{ serverErr }}</p>
  </SectionFull>
</template>