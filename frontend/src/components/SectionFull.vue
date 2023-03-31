<template>
  <main class="backdrop-blur-lg min-h-[75vh] md:flex font-mali">
    <div class="md:w-1/2 bg-gray-300/80">
      <img v-if="image" :src="image" class="w-full h-full object-cover">
      <img v-if="imageApi" :src="'http://localhost:3000/images/' + imageApi + '.jpg'" class="w-full object-contain">
    </div>
    <div class="md:w-1/2 bg-white/80 p-12">
      <button v-show="backButton == 'true'" class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="this.$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button><br><br>
      <h1 class="text-[400%] font-pattaya">{{ title }}</h1>
      <br><hr><br>
      <slot></slot>
    </div>
  </main>
</template>

<script lang="ts">
export default {
  props: ['title', 'image', 'imageApi', 'backButton', 'contain'],
}
</script>