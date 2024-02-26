<script setup>
import Section from '@/components/Section.vue'
import ProfileImage from '@/assets/images/profile.jpg'
import UserProfileImage from '@/assets/images/food_profile.jpg'
</script>

<script>
import http from '@/http'
import { store } from '@/store'
import moment from 'moment'
import useVuelidate from '@vuelidate/core'
import {
  required, minLength, maxLength, email, helpers, alphaNum, sameAs
} from '@vuelidate/validators'

moment.locale('th')

export default {
  data() {
    return {
      v$: useVuelidate(),
      store,
      userInfo: {},
      userInfoEdit: {},
      address: [],
      loading: false,
      editPassword: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      newAddress: '',
      editMode: false,
      serverErr: ''
    }
  },
  validations() {
    return {
      userInfoEdit: {
        username: {
          required: helpers.withMessage('จำเป็นต้องกรอกชื่อผู้ใช้', required),
          minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 5 ตัวอักษร', minLength(5)),
          maxLength: helpers.withMessage('ต้องกรอกไม่เกิน 30 ตัวอักษร', maxLength(30)),
          alphaNum: helpers.withMessage('ต้องมีแค่ตัวอักษรกับตัวเลข', alphaNum)
        },
        firstName: {
          required: helpers.withMessage('จำเป็นต้องกรอกชื่อจริง', required),
          minLength: helpers.withMessage('ต้องกรอกชื่อจริงอย่างน้อย 3 ตัวอักษร', minLength(3))
        },
        lastName: {
          required: helpers.withMessage('จำเป็นต้องกรอกนามสกุล', required),
          minLength: helpers.withMessage('ต้องกรอกนามสกุลอย่างน้อย 3 ตัวอักษร', minLength(3))
        },
        email: {
          required: helpers.withMessage('จำเป็นต้องกรอกอีเมล', required),
          email: helpers.withMessage('อีเมลที่กรอกไม่ถูกต้อง', email),
        },
        phone: {
          required: helpers.withMessage('จำเป็นต้องกรอกเบอร์โทรศัพท์', required),
          isPhone: helpers.withMessage('ข้อมูลที่กรอกไม่ใช่เบอร์โทรศัพท์', helpers.regex(/^0[0-9]{9}$/))
        },
      },
      editPassword: {
        newPassword: {
          required: helpers.withMessage('จำเป็นต้องกรอกรหัสผ่าน', required),
          minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 8 ตัวอักษร', minLength(8)),
          oneUpper: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวพิมพ์ใหญ่', helpers.regex(/[A-Z]/)),
          oneLower: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวพิมพ์เล็ก', helpers.regex(/[a-z]/)),
          oneNumber: helpers.withMessage('ต้องมีอย่างน้อย 1 ตัวเลข', helpers.regex(/[0-9]/)),
        },
        confirmPassword: {
          required: helpers.withMessage('จำเป็นต้องกรอกรหัสผ่านอีกครั้ง', required),
          sameAs: helpers.withMessage('รหัสผ่านไม่ตรงกัน', sameAs(this.editPassword.newPassword))
        },
      },
      newAddress: {
        required: helpers.withMessage('จำเป็นต้องกรอกที่อยู่', required),
        minLength: helpers.withMessage('ต้องกรอกอย่างน้อย 20 ตัวอักษร', minLength(20)),
      }
    }
  },
  methods: {
    async userFetch() {
      this.loading = true

      const result = await http.get('/api/get_user')
      .then(res => {
        if (res.error) {
          alert('โปรดลงชื่อเข้าใช้ใหม่')
          this.$router.push('/login')
        } else {
          this.store.user = res.data
          this.userInfo = JSON.parse(JSON.stringify(res.data.data))
          this.userInfoEdit = JSON.parse(JSON.stringify(res.data.data))
          this.address = res.data.address
        }
      }).catch((err) => {
        console.log(err)
        this.$router.push('/')
      })

      this.loading = false
    },
    async changePassword() {
      this.v$.editPassword.$touch()

      if (this.v$.editPassword.$invalid) {
        return console.log('changePassword invalid is true')
      }

      if (this.newPassword === this.confirmPassword && confirm('แก้ไขรหัสผ่าน?')) {
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
    },
    async changeUserInfo() {
      this.v$.userInfoEdit.$touch()

      if (this.v$.userInfoEdit.$invalid) {
        return console.log('changeUserInfo invalid is true')
      }

      await http.put('/api/user/change_info', this.userInfoEdit)
      .then(res => {
        alert('แก้ไขข้อมูลเสร็จสิ้น')
        this.userFetch()
        this.editMode = false
        this.serverErr = ''
      }).catch(err => {
        console.log(err)
        this.serverErr = err.response.data.msg_th
      })
    },
    async addAddress() {
      this.v$.newAddress.$touch()

      if (this.v$.newAddress.$invalid) {
        return console.log('addAddress invalid is true')
      }

      await http.post('/api/user/address/add', {
        address: this.newAddress
      }).then(res => {
        alert('เพิ่มที่อยู่เสร็จสิ้น')
        this.userFetch()
      }).catch(err => {
        console.log(err)
      })
    },
    async deleteAddress(address) {
      await http.delete('/api/user/address/delete', {
        data: {
          address_id: address.id
        }
      }).then(res => {
        alert('ลบที่อยู่เสร็จสิ้น')
        this.userFetch()
      }).catch(err => {
        console.log(err)
      })
    },
    async setMainAddress(address) {
      await http.put('/api/user/address/set_main', {
        address_id: address.id
      }).then(res => {
        this.userFetch()
      }).catch(err => {
        console.log(err)
      })
    },
    switchEditMode() {
      if (this.editMode) {
        this.userInfoEdit = JSON.parse(JSON.stringify(this.userInfo))
      }
      this.editMode = !this.editMode
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
    <img :src="UserProfileImage" class="w-full h-[30vh] object-cover">
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
          <img :src="ProfileImage" class="aspect-square object-cover w-48 rounded-full shadow-lg">
        </div>
        <div class="w-4/5">
                <div v-if="userInfo.isAdmin" class="mb-2">
                <span class="text-lg bg-red-500 text-white px-3 py-1 rounded-full">Admin</span>
              </div>
              <span v-if="editMode" class="grid grid-cols-2 gap-4">
                          <input class="text-5xl font-bold px-2 rounded-lg" type="text" v-model="v$.userInfoEdit.firstName.$model">
                        <input class="text-5xl font-bold  px-2 rounded-lg" type="text" v-model="v$.userInfoEdit.lastName.$model">
                      </span>
                        <h1 v-else class="text-5xl font-bold">{{ userInfo.firstName }} {{ userInfo.lastName }}</h1>
              <p class="text-black/50 font-mono">id: {{ userInfo.id }}</p><br>
              <hr class="border-2 border-black/30 rounded-full"><br>
              <!-- edit mode -->
              <div v-if="editMode">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h1 class="font-bold text-xl">ชื่อผู้ใช้</h1>
                    <input type="text" v-model="v$.userInfoEdit.username.$model" class="px-2 rounded-full w-full">
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">อีเมล</h1>
                    <input type="text" v-model="v$.userInfoEdit.email.$model" class="px-2 rounded-full w-full">
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">เบอร์มือถือ</h1>
                    <input type="text" v-model="v$.userInfoEdit.phone.$model" class="px-2 rounded-full w-full">
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">วันที่เริ่มเป็นสมาชิก</h1>
                    <p>{{ moment(userInfo.register_time) }} ({{ moment(userInfo.register_time).fromNow() }})</p>
                  </div>
                </div>
              </div>
              <span v-if="editMode">
                <br>
                <p class="text-red-500" v-for="err in v$.userInfoEdit.$errors">- {{ err.$message }}</p>
                <p class="text-red-500" v-if="serverErr">- {{ serverErr }}</p>
              </span>
              <!-- read only mode -->
              <div v-else>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h1 class="font-bold text-xl">ชื่อผู้ใช้</h1>
                    <p>{{ userInfo.username }}</p>
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">อีเมล</h1>
                    <p>{{ userInfo.email }}</p>
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">เบอร์มือถือ</h1>
                    <p>{{ userInfo.phone }}</p>
                  </div>
                  <div>
                    <h1 class="font-bold text-xl">วันที่เริ่มเป็นสมาชิก</h1>
                    <p>{{ moment(userInfo.register_time) }} ({{ moment(userInfo.register_time).fromNow() }})</p>
                  </div>
                </div>
              </div>
              <br>
              <button @click="switchEditMode()" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">
                <span v-if="editMode">ยกเลิก</span>
                <span v-else>แก้ไขข้อมูล</span>
              </button>&nbsp;
              <button v-if="editMode" @click="changeUserInfo()" class="bg-green-400 font-bold px-6 py-2 rounded-full text-lg cursor-pointer">
                บันทึก
              </button>
              <p v-for="err in v$.errors">{{ err.$message }}</p>
            </div>
            <!-- read only mode -->
          </div>
        </Section>
        <Section v-show="!loading" title="ที่อยู่" id="address">
          <br>
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left">
              <thead class="text-sm uppercase bg-primary text-white">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    ที่อยู่หลัก
                  </th>
                  <th scope="col" class="px-6 py-3">
                    ที่อยู่
                  </th>
                  <th scope="col" class="px-6 py-3 max-w-[200px]">
                    {{ address.length }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="border-b" :class="[item.main_addr ? 'bg-secondary' : 'bg-gray-100']"
                  v-for="item in address" :key="item.id">
                  <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                    <span v-if="item.main_addr">✅</span>
                  </th>
                  <td class="px-6 py-4" :class="[item.main_addr ? 'font-bold' : '']">
                    {{ item.address }}
                  </td>
                  <td class="px-6 py-2">
                    <div class="flex">
                      <span v-if="!item.main_addr">
                        <button class="hover:bg-primary text-black hover:text-white font-bold px-4 py-2 rounded-full transition ease-out duration-100" :class="[item.main_addr ? 'bg-light' : 'bg-secondary']" @click="setMainAddress(item)">
                          ตั้งให้เป็นอันหลัก
                        </button>&nbsp;&nbsp;
                      </span>
                      <button class="bg-red-500 hover:bg-red-400 text-white font-bold px-4 py-2 rounded-full transition ease-out duration-100" @click="deleteAddress(item)">
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
                <tr class="bg-gray-100 border-b">
                  <th class="px-6 py-4 font-bold whitespace-nowrap">เพิ่มที่อยู่ใหม่</th>
                  <td class="px-6 py-2">
                    <input type="text" v-model="v$.newAddress.$model" class="px-2 py-1 rounded-full border-2 w-4/5">
                    <p class="text-xs text-red-500" v-for="err in v$.newAddress.$errors">- {{ err.$message }}</p>
                  </td>
                  <td class="px-6 py-2">
                    <button class="bg-secondary hover:bg-primary text-black hover:text-white font-bold px-4 py-2 rounded-full transition ease-out duration-100" @click="addAddress()">
                      ➕ เพิ่ม
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br>
        </Section>

        <Section v-show="!loading" title="ตั้งค่า">
          <div class="flex">
            <div class="w-1/3">
              <div>
                <label>รหัสเก่า</label><br>
                <input type="password" v-model="editPassword.oldPassword" class="border-2 rounded-full mt-2 px-4">
              </div><br>
              <div>
                <label>รหัสใหม่</label><br>
                <input type="password" v-model="v$.editPassword.newPassword.$model" class="border-2 rounded-full mt-2 px-4">
              </div><br>
              <div>
                <label>รหัสใหม่อีกครั้ง</label><br>
                <input type="password" v-model="v$.editPassword.confirmPassword.$model" class="border-2 rounded-full mt-2 px-4">
              </div><br>
              <button @click="changePassword()" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">แก้ไขรหัสผ่าน</button>
            </div>
            <div class="w-1/3 text-red-500">
              <p v-for="err in v$.editPassword.newPassword.$errors">- {{ err.$message }}</p><br>
              <p v-for="err in v$.editPassword.confirmPassword.$errors">- {{ err.$message }}</p>
            </div>
          </div>
        </Section>


        <Section v-show="!loading && userInfo.isAdmin" title="ผู้ดูแลระบบ">
      <p>ตั้งค่าระบบ และรายการต่างๆ ของร้าน</p>
      <br>
      <router-link to="/admin" class="bg-primary text-white font-bold px-6 py-2 rounded-full text-lg cursor-pointer">แอดมิน</router-link>
    </Section>
  </main>
</template>
