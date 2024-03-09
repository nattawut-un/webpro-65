<script>
import { store } from '@/store'
import http from '@/http'
import useVuelidate from '@vuelidate/core'
import {
  required, helpers, minLength,
  minValue, numeric
} from '@vuelidate/validators'

export default {
  data() {
    return {
      v$: useVuelidate(),
      store,
      loading: false,
      productId: null,
      details: {
        title: null,
        price: null,
        description: null,
        category_id: null,
        category: { id: null },
        images: [{ path: null }],
      },
      categories: [],
      debug: false
    }
  },
  validations() {
    return {
      details: {
        title: {
          required: helpers.withMessage('ต้องกรอกชื่อเมนู', required),
          minLength: helpers.withMessage('ชื่อเมนูต้องยาวกว่า 5 ตัวอักษร', minLength(5)),
        },
        price: {
          required: helpers.withMessage('ต้องกรอกราคา', required),
          numeric: helpers.withMessage('ราคาต้องเป็นตัวเลข', numeric),
          minValue: helpers.withMessage('ราคาต้องมากกว่า 0', minValue(0)),
        },
        description: {},
        category_id: {},
        category: {
          id: {}
        }
      }
    }
  },
  methods: {
    async authorize() {
      this.loading = true
      const result = await http.get('/api/get_user')
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
          name: this.details.title,
          price: this.details.price,
          description: this.details.description,
          category_id: this.details.category_id
        })
        .then(response => {
          this.v$.$reset()
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
        if (confirm('คุณต้องการลบข้อมูลสินค้า "' + this.details.title + '" หรือไม่\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
          let res = await http.delete('/api/products/' + this.details.id + '/delete')
          .then(response => {
            this.v$.$reset()
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
  mounted() {
    this.productId = this.$route.params.id
    this.getProductDetail()
    this.getCategories()
  },
  beforeUnmount() {
    if (this.v$.$anyDirty) {
      if (!(confirm('คุณต้องการออกจากหน้านี้หรือไม่\nคุณมีการแก้ไขที่ยังไม่ได้ถูกบันทึก'))) {
        return false
      }
    }
  }
}
</script>

<script setup>
import SectionFull from '@/components/SectionFull.vue'
</script>

<template>
  <SectionFull :imageApi="`${details.images[0].path}`" backButton="true">
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
      <input type="text" v-model="v$.details.title.$model" class="text-[400%] font-pattaya w-full border-b-4 transition ease-out duration-100"
      :class="[ v$.details.title.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]">
      <span class="text-[200%]"><input type="number" v-model="v$.details.price.$model" class="border-b-2 transition ease-out duration-100 w-1/4"
      :class="[ v$.details.price.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]"> บาท</span>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <textarea v-model="v$.details.description.$model" rows="8" class="border-b-2 hover:border-gray-500 transition ease-out duration-100 w-full"
      :class="[ v$.details.description.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]"></textarea>
      <br><hr><br>
      <div>
        <label for="category">หมวดหมู่</label>
        <select name="category" id="category" v-model="v$.details.category.id.$model" class="bg-gray-100 rounded-full ml-2 px-2 py-1"
        :class="[ v$.details.category_id.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]">
          <option
            v-for="item in categories" :key="item.id" :value="item.id"
            :selected="item.id === details.category.id ? true : false"
          >
            {{ item.emoji }} {{ item.title }}
          </option>
        </select>
      </div><br>
      <div>
        <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold mr-2" @click="saveData()">บันทึกข้อมูล</button>
        <button class="bg-red-500 text-white rounded-full px-4 py-2 font-bold" @click="deleteProduct()">ลบข้อมูล</button>
      </div><br>
      <p class="text-red-500" v-for="err in v$.$errors">- {{ err.$message }}</p>
      <!-- <button class="bg-green-300 px-4 py-2 rounded-full" @click="debug = !debug">show data = {{ debug }}</button>
      <div v-show="debug" class="bg-gray-300 m-4 p-4 rounded-xl">
        {{ details }}
      </div> -->
    </div>
  </SectionFull>
</template>