<script setup>
import Section from './components/Section.vue'
import ListItem from './components/ListItem.vue'
</script>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      products: [],
      searchKeyword: '',
    }
  },
  methods: {
    async getProducts() {
      try {
        let res = await axios
          .get('http://localhost:3000/products')
          .then(response => (this.products = response.data))
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    searchedList() {
      if (this.searchKeyword == '') {
        return this.products
      }
      return this.products.filter((currentValue) => {
        return currentValue.name.includes(this.searchKeyword)
      })
    }
  },
  mounted() {
    this.getProducts()
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <main>
    <img src="./images/food_list.jpg" class="w-full h-[30vh] object-cover">
    <Section title="รายการอาหารทั้งหมด">
      <p class="indent-12">
        เอ็กซ์โปแคชเชียร์ สเตริโอแก๊สโซฮอล์ออกแบบ แจมด็อกเตอร์เฮอร์ริเคนไงแฮปปี้ ปฏิสัมพันธ์พะเรอช็อปจูเนียร์ เอ๋อเอ็กซ์โป บรรพชน กลาสเจ๊าะแจ๊ะ ธรรมายากูซ่าบร็อคโคลีพาสปอร์ต ไมค์เจ๊าะแจ๊ะเซ็นเตอร์ฮวงจุ้ยทอล์ค ยาวีมอยส์เจอไรเซอร์ละอ่อนบัสธัมโม พริตตี้พุทธภูมิ ก่อนหน้าแมคเคอเรลมายองเนสไพลินโครนา แฟรี่ราชบัณฑิตยสถานศิรินทร์ศากยบุตร ตัวเองติวเตอร์ โปรโมเตอร์ เคอร์ฟิว
      </p>
      <p class="indent-12">
        มั้งลิมิต รูบิกอุปการคุณรวมมิตรเซ็นทรัลเฟรชชี่ ปาสเตอร์ แอปเปิลมยุราภิรมย์แช่แข็ง ทาวน์เฮาส์แซ็กโซโฟน แชมเปี้ยนครัวซองต์เช็ก ซูโม่ บร็อคโคลีฮาโลวีนวิวสแตนเลสแชมปิยอง สปอร์ตซิตี้ติงต๊องไฮกุสปิริต สเตริโอล้มเหลวต่อยอดพุดดิ้ง ฮีโร่เทคโนไฮไลท์เที่ยงวัน อีแต๋นพูลฮีโร่แจ๊ส ออเดอร์วืด เมเปิลฮัมติวแคร์ไอติม มัฟฟินจิตเภทรีโมท ถูกต้องแม่ค้าวีซ่าฮากกาฮันนีมูน
      </p>
    </Section>
    <!-- searching & sorting -->
    <div class="bg-primary/70 hover:bg-primary backdrop-blur-md transition duration-300 ease-out font-mali text-white sticky top-[75px]">
      <div class="container mx-auto p-2 flex">
        <!-- <label class="font-bold mr-2">ค้นหา</label> -->
        <img src="./svg/Search.svg" class="h-[23px] mr-2">
        <input type="text" v-model="searchKeyword" class="text-black bg-white rounded-full px-2 mr-2" />
        ผลการค้นหาทั้งหมด {{ searchedList.length }} รายการ
      </div>
    </div>
    <!-- if 0 result -->
    <div v-show="searchedList.length == 0" class="bg-white/80">
      <div class="container mx-auto pt-16">
        <h1 class="text-[600%] font-pattaya">ไม่พบสิ่งที่ท่านค้นหา</h1>
        <p class="text-[200%] font-mali">โปรดกรอกคำค้นหาใหม่</p>
      </div>
    </div>
    <!-- items -->
    <div class="bg-white/80 grid place-content-center 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-8">
      <ListItem v-for="item in searchedList" :name="item.name" :price="item.price" :link="item.id" />
    </div>
  </main>
</template>
