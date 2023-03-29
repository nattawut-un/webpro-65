<template>
  <div class="my-4">
    <div v-if="main" class="bg-primary text-white font-bold px-4 py-2 overflow-auto rounded-t-2xl">
      Main
    </div>
    <div class="bg-white px-4 py-2 shadow-lg" :class="[main ? 'rounded-b-2xl' : 'rounded-2xl']">
      <span :class="[main ? 'font-bold' : '']">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    props: ['main']
  }
</script>