<template>
  <section class="w-100 bg-secondary px-4 py-8 font-mali">
    <div class="container mx-auto">
      <h1 class="text-4xl text-black font-pattaya mb-2">{{ title }}</h1>
      <slot></slot>
      <!-- <button @click="count++" class="bg-red-400 hover:bg-red-600 font-bold text-white transition duration-200 ease-out px-4 py-2 my-2 rounded-full">
        You clicked me {{count}} times.
      </button> -->
    </div>
  </section>
</template>

<script lang="ts">
  export default {
    props: ['title']
  }
</script>