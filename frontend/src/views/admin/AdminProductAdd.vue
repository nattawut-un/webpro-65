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
      details: {
        name: null,
        price: null,
        description: null,
        category_id: null
      },
      categories: [],
      file: null,
      file_preview: null,
      uploadPercentage: 0,
      debug: false
    }
  },
  validations() {
    return {
      details: {
        name: {
          required: helpers.withMessage('ต้องกรอกชื่อเมนู', required),
          minLength: helpers.withMessage('ชื่อเมนูต้องยาวกว่า 5 ตัวอักษร', minLength(5)),
        },
        price: {
          required: helpers.withMessage('ต้องกรอกราคา', required),
          numeric: helpers.withMessage('ราคาต้องเป็นตัวเลข', numeric),
          minValue: helpers.withMessage('ราคาต้องมากกว่า 0', minValue(0)),
        },
        description: {},
        category_id: {}
      }
    }
  },
  methods: {
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
      this.v$.$touch()
      if (this.v$.$invalid) {
        return console.log('The form is invalid.')
      }

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
          },
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) )
          }.bind(this)
        })
        .then(response => {
          console.log('Data added.')
          alert('เพิ่มข้อมูลสำเร็จ')
          this.$router.push('/admin/products')
        }).catch(err => {
          console.log(err)
          this.uploadPercentage = 0
        })
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  },
  mounted() {
    this.getCategories()
  },
  beforeUnmount() {
    if (this.v$.$anyDirty && !this.loading) {
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
      <input type="text" placeholder="ชื่อสินค้า" v-model="v$.details.name.$model" class="text-[400%] font-pattaya w-full border-b-4 transition ease-out duration-100"
      :class="[ v$.details.name.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]">
      <span class="text-[200%]"><input type="number" placeholder="ราคา" v-model="v$.details.price.$model" class="border-b-2 transition ease-out duration-100 w-1/4"
      :class="[ v$.details.price.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]"> บาท</span>
      <br><hr><br>
      <h3 class="text-3xl font-pattaya">คำอธิบาย</h3>
      <textarea placeholder="คำอธิบาย" v-model="v$.details.description.$model" rows="8" class="border-b-2 transition ease-out duration-100 w-full"
      :class="[ v$.details.description.$dirty ? 'border-red-400 hover:border-red-600' : 'border-gray-200 hover:border-gray-500' ]"></textarea>
      <br><hr><br>
      <div>
        <label for="category">หมวดหมู่</label>
        <select name="category" id="category" v-model="v$.details.category_id.$model" class="bg-gray-100 rounded-full ml-2 px-2 py-1">
          <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div><br>
      <div>
        <input class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" type="file" ref="file" @change="handleFileUpload()">
      </div><br>
      <div>
        <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2 font-bold" @click="submitData()">บันทึกข้อมูล</button>
        <span class="ml-3" v-show="uploadPercentage">💾 กำลังบันทึก ({{ uploadPercentage }}%)</span>
      </div><br>
      <p class="text-red-500" v-for="err in v$.$errors">- {{ err.$message }}</p>
      <!-- <button class="bg-green-300 px-4 py-2 rounded-full" @click="debug = !debug">show data = {{ debug }}</button>
      <div v-show="debug" class="bg-gray-300 m-4 p-4 rounded-xl">
        {{ categories }}
        <br>
        {{ details }}
      </div> -->
    </div>
  </SectionFull>
</template>