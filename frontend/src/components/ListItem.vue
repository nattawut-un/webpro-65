<template>
  <a :href="'/products/'+ link" class="bg-secondary hover:bg-primary rounded-[1.5rem] font-mali text-black hover:text-white transition ease-out duration-100 shadow-lg border-primary border-4">
    <img class="rounded-[1.3rem] aspect-square object-cover" :src="('./src/assets/images/products/' + link + '.jpg')" @error="setToDefaultImg">
    <div class="p-5 px-6">
      <h1 class="text-2xl">{{ name }}</h1>
      <p>{{ price }} บาท</p>
    </div>
  </a>
</template>

<script lang="ts">
export default {
  props: ['name', 'price', 'link'],
  methods: {
    setToDefaultImg(e) {
      e.target.src = './src/assets/images/notfound.png'
    }
  }
}
</script>
