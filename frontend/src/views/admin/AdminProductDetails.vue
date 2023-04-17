<script>
import { store } from '@/store'
import http from '@/http'

export default {
  data() {
    return {
      store,
      loading: false,
      productId: null,
      details: {},
      categories: [],
      debug: false
    }
  },
  methods: {
    async authorize() {
      this.loading = true
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
      this.loading = false
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
    async getProductDetail() {
      this.loading = true

      try {
        let res = await http.get('/api/products/' + this.productId)
        .then(response => (this.details = response.data))
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },
    async saveData() {
      this.loading = true

      try {
        let res = await http.put('/api/products/' + this.productId + '/update', {
          id: this.details.id,
          name: this.details.name,
          price: this.details.price,
          description: this.details.description,
          category_id: this.details.category_id
        })
        .then(response => {
          console.log('Data updated.')
          alert('แก้ไขข้อมูลสำเร็จ')
          this.$router.go(-1)
        }).catch(err => console.log(err))
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    },
    async deleteProduct() {
      this.loading = true

      try {
        if (confirm('คุณต้องการลบข้อมูลสินค้า "' + this.details.name + '" หรือไม่\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
          let res = await http.delete('/api/products/' + this.details.id + '/delete')
          .then(response => {
            alert('ลบข้อมูลสำเร็จแล้ว')
            this.$router.go(-1)
          })
          .catch(err => {
            alert(err.message)
            console.log(err)
          })
        }
      } catch (err) {
        console.log(err)
      }

      this.loading = false
    }
  },
  created() {
    if (!this.$cookies.isKey('jwt-token')) {
      this.$router.push('/login')
    } else if (this.authorize()) {
      this.productId = this.$route.params.id
      this.getProductDetail()
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
  <SectionFull :imageApi="`${details.file_path}`" backButton="true">
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
      <p class="text-red-500">*** 📝 โหมดแก้ไขข้อมูล ***</p>
      <input type="text" v-model="details.name" class="text-[400%] font-pattaya w-full border-b-4 hover:border-gray-500 transition ease-out duration-100">
      <span class="text-[200%]"><input type="text" v-model="details.price" class="border-b-2 hover:border-gray-500 transition ease-out duration-100 w-1/4"> บาท</span>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <textarea v-model="details.description" rows="8" class="border-b-2 hover:border-gray-500 transition ease-out duration-100 w-full"></textarea>
      <br><hr><br>
      <div>
        <label for="category">หมวดหมู่</label>
        <select name="category" id="category" v-model="details.category_id" class="bg-gray-100 rounded-full ml-2 px-2 py-1">
          <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div><br>
      <div>
        <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold mr-2" @click="saveData()">บันทึกข้อมูล</button>
        <button class="bg-red-500 text-white rounded-full px-4 py-2 font-bold" @click="deleteProduct()">ลบข้อมูล</button>
      </div><br>
      <button class="bg-green-300 px-4 py-2 rounded-full" @click="debug = !debug">show data = {{ debug }}</button>
      <div v-show="debug" class="bg-gray-300 m-4 p-4 rounded-xl">
        {{ details }}
      </div>
    </div>
  </SectionFull>
</template>