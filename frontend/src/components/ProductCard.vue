<template>
  <div class="flex bg-gray-100 border-2 rounded-xl shadow-lg p-4 mb-4">
    <div class="w-1/5">
      <img :src="image || '../assets/images/profile.jpg'" class="rounded-full">
    </div>
    <div class="w-3/5 px-4">
      <h1 class="font-bold text-2xl mb-2">{{ title }}</h1>
      <p>จำนวน: {{ amount }}</p>
      <p>ราคาต่อหน่วย: {{ price }}.-</p>
    </div>
    <div class="w-1/5 font-bold text-4xl font-chonburi">
      {{ totalPrice }}.-
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: ['image', 'title', 'amount', 'price'],
    computed: {
      totalPrice() {
        return this.amount * this.price
      }
    }
  }
</script>
