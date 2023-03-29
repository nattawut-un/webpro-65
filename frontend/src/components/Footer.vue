<script setup>
import { store } from '../store.js'
</script>

<script>
export default {
  data() {
    return {
      store,
    }
  },
}
</script>

<template>
  <footer class="bg-primary font-mali text-white">
    <div class="container mx-auto md:flex p-8">
      <div class="md:w-2/3 md:pr-4 md:border-r-4 mb-4">
        <h1 class="text-xl font-bold mb-2">{{ store.shopName }}</h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum suscipit veniam quos aut quas ipsa quo explicabo molestias, dolores dignissimos in impedit, minima ullam nihil voluptate dicta praesentium sequi doloremque?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil excepturi exercitationem doloremque vero maxime minima commodi illum repellat, corrupti eaque consequuntur distinctio ipsum aliquid dolorem qui ea fuga enim at!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odio esse magni quidem saepe nemo aperiam autem blanditiis adipisci eum sequi omnis exercitationem ea, distinctio laborum quia! Atque, perferendis nulla.</p>
      </div>
      <div class="md:w-1/3 md:pl-4">
        <h1 class="text-xl font-bold">
          Web Technology
        </h1><br>
        <h2 class="text-lg font-bold">
          ณัฐวุฒิ อุ่นวิเศษ
        </h2>
        <h3 class="text-md">
          64070035
        </h3>
        <br>
        <p>
          เว็บไซต์นี้เป็นส่วนหนึ่งของวิชา Web Technology ภาคเรียนที่ 2 ปีการศึกษา 2565
        </p>
      </div>
    </div>
  </footer>
</template>