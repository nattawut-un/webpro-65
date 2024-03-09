<script setup>
import Section from '../components/Section.vue'
import ListItem from '../components/ListItem.vue'
import ProductImage from '@/assets/images/food_list.jpg'
</script>

<script>
import http from '@/http'
import { store } from '@/store'

export default {
  data() {
    return {
      store,
      products: [],
      categories: [],
      selectedCategories: [],
      searchKeyword: '',
      loading: false,
      showFavorites: false,
    }
  },
  methods: {
    async getProducts() {
      this.loading = true
      try {
        let res = await http
        .get('/api/products')
        .then(response => (this.products = response.data))
      } catch (err) {
        console.log(err);
      }
      this.loading = false
    },
    async getCategories() {
      this.loading = true
      await http.get('/api/categories')
      .then(response => (this.categories = response.data))
      .catch(err => console.log(err))
      this.loading = false
    },
  },
  computed: {
    searchedList() {
      if (!this.searchKeyword && this.selectedCategories.length == 0) {
        return this.products
      } else if (this.searchKeyword && this.selectedCategories == 0) {
        return this.products.filter(item => {
          return item.title.includes(this.searchKeyword)
        })
      } else if (!this.searchKeyword && this.selectedCategories.length > 0) {
        return this.products.filter(item => {
          return this.selectedCategories.includes(item.category.id)
        })
      } else {
        return this.products.filter(item => {
          return item.title.includes(this.searchKeyword) && this.selectedCategories.includes(item.category.id)
      })
      }
    },
    favoriteList() {
      if (this.showFavorites) {
        return this.searchedList.filter(item => {
          return item.userFavs.length
        })
      }
      return this.searchedList
    }
  },
  mounted() {
    if (this.$route.query.cate_id) {
      this.selectedCategories = [parseInt(this.$route.query.cate_id)]
    }
    this.getProducts()
    this.getCategories()
  }
}
</script>

<template>
  <main>
    <img :src="ProductImage" class="w-full h-[30vh] object-cover">
    <Section title="รายการอาหารทั้งหมด">
      <p class="indent-12">
        <!-- เอ็กซ์โปแคชเชียร์ สเตริโอแก๊สโซฮอล์ออกแบบ แจมด็อกเตอร์เฮอร์ริเคนไงแฮปปี้ ปฏิสัมพันธ์พะเรอช็อปจูเนียร์ เอ๋อเอ็กซ์โป บรรพชน กลาสเจ๊าะแจ๊ะ ธรรมายากูซ่าบร็อคโคลีพาสปอร์ต ไมค์เจ๊าะแจ๊ะเซ็นเตอร์ฮวงจุ้ยทอล์ค ยาวีมอยส์เจอไรเซอร์ละอ่อนบัสธัมโม พริตตี้พุทธภูมิ ก่อนหน้าแมคเคอเรลมายองเนสไพลินโครนา แฟรี่ราชบัณฑิตยสถานศิรินทร์ศากยบุตร ตัวเองติวเตอร์ โปรโมเตอร์ เคอร์ฟิว -->
      </p>
    </Section>
    <div class="bg-white font-mali border-primary border-b-4">
      <div class="container mx-auto py-6 flex">
        <div class="w-1/4 border-r-2">
          <input type="text" v-model="searchKeyword" class="text-black bg-gray-200 rounded-xl px-2 mr-2 text-2xl" /><br>
          <span class="text-xs">ผลการค้นหาทั้งหมด {{ favoriteList.length }} รายการ</span>
          <br>
          <input type="checkbox" id="favs" v-model="showFavorites">&nbsp;
          <label for="favs">แสดงรายการที่ชื่นชอบ</label>
        </div>
        <div class="w-1/4 px-8">
          <h1 class="font-bold text-xl">หมวดหมู่</h1>
          <div v-for="item in categories">
            <input type="checkbox" :id="item.id" :value="item.id" :key="item.id" v-model="selectedCategories">&nbsp;
            <label :for="item.id">{{ item.emoji }} {{ item.title }}</label>
          </div>
        </div>
      </div>
    </div>
    <!-- if 0 result -->
    <div v-show="favoriteList.length == 0 && !loading" class="bg-white/80">
      <div class="container mx-auto pt-16">
        <h1 class="text-[600%] font-pattaya">ไม่พบสิ่งที่ท่านค้นหา</h1>
        <p class="text-[200%] font-mali">โปรดกรอกคำค้นหาใหม่</p>
      </div>
    </div>
    <!-- loading -->
    <div v-show="loading == true" class="flex items-center justify-center space-x-2 bg-white/80 py-16">
      <div
        class="inline-block h-48 w-48 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
    <!-- items -->
    <div class="bg-white/80 grid place-content-center 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-8" @product-refresh="getProducts()">
      <!-- <ListItem v-for="item in searchedList" :name="item.name" :price="item.price" :link="item.file_path" :prod_id="item.id" /> -->
      <ListItem v-for="item in favoriteList" :product="item" />
    </div>
  </main>
</template>
