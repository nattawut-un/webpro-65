<script>
import { store } from '@/store'
import http from '@/http'

export default {
  data() {
    return {
      store,
      loading: false,
      details: {
        name: null,
        price: null,
        description: null,
        category_id: null
      },
      categories: [],
      file: null,
      file_preview: null,
      debug: false
    }
  },
  methods: {
    async authorize() {
      const result = await http.post('/api/get_user')
      .then(res => {
        if (res.error) {
          alert(res.error)
          this.$router.back()
        } else if (res.data.data.is_admin != 1) {
          this.$router.push('/')
        } else {
          this.userInfo = res.data.data
          return true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async getCategories() {
      this.loading = true
      try {
        await http.get('/api/categories')
        .then(response => {
          this.categories = response.data
        }).catch(err => {
          console.log(err)
        })
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
      this.file_preview = URL.createObjectURL(this.file)
    },
    async submitData() {
      this.loading = true
      var formData = new FormData()
      formData.append("name", this.details.name)
      formData.append("price", this.details.price)
      formData.append("description", this.details.description)
      formData.append("category_id", this.details.category_id)
      formData.append("image", this.file)

      try {
        let res = await http.post('/api/products/add', formData, {
          Headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('Data added.')
          alert('เพิ่มข้อมูลสำเร็จ')
          this.$router.push('/admin/products')
        }).catch(err => console.log(err))
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  },
  mounted() {
    if (!this.$cookies.isKey('jwt-token')) {
      this.$router.push('/login')
    } else if (this.authorize()) {
      this.getCategories()
    } else {
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
      this.$router.back()
    }
  }
}
</script>

<script setup>
import SectionFull from '@/components/SectionFull.vue'
</script>

<template>
  <SectionFull backButton="true" :image="file_preview">
    <!-- loading -->
    <div v-show="loading" class="flex items-center justify-center space-x-2">
      <div
        class="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
    <!-- main page -->
    <div v-show="!loading">
      <p class="text-red-500">*** 📝 โหมดเพิ่มข้อมูล ***</p>
      <input type="text" v-model="details.name" class="text-[400%] font-pattaya w-full border-b-4 hover:border-gray-500 transition ease-out duration-100">
      <span class="text-[200%]"><input type="text" v-model="details.price" class="border-b-2 hover:border-gray-500 transition ease-out duration-100 w-1/4"> บาท</span>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <textarea v-model="details.description" rows="8" class="border-b-2 hover:border-gray-500 transition ease-out duration-100 w-full"></textarea>
      <br><hr><br>
      <div>
        <label for="category">หมวดหมู่</label>
        <select name="category" id="category" v-model="details.category_id">
          <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div><br>
      <div>
        <input class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" type="file" ref="file" @change="handleFileUpload()">
      </div><br>
      <div>
        <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="submitData()">บันทึกข้อมูล</button>
      </div><br>
      <button class="bg-green-300 px-4 py-2 rounded-full" @click="debug = !debug">show data = {{ debug }}</button>
      <div v-show="debug" class="bg-gray-300 m-4 p-4 rounded-xl">
        {{ categories }}
        <br>
        {{ details }}
      </div>
    </div>
  </SectionFull>
</template>