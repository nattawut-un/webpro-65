<script setup>
import Section from '@/components/Section.vue'
import AdminHomeHeader from '@/assets/images/admin_home.jpg'
import { store } from '@/store'
</script>

<script>
import http from '@/http'
import { store } from '@/store'


export default {
  data() {
    return {
      store,
      userInfo: {},
      menus: [
        {
          icon: '🍛',
          title: 'รายการสินค้า',
          description: 'เพิ่ม แก้ไข ลบรายการสินค้า',
          to: '/admin/products'
        },
        {
          icon: '📃',
          title: 'รายการสั่งซื้อ',
          description: 'ดำเนินการคพสั่งซื้อให้เสร็จ หรือลบคำสั่งซื้อ',
          to: '/admin/orders'
        },
        {
          icon: '👥',
          title: 'จัดการผู้ใช้',
          description: 'ให้สิทธิ์ผู้ใช้ หรือลบผู้ใช้',
          to: '/admin/users'
        },
      ],
      colors: [
        '#f87171',
        '#fb923c',
        '#fbbf24',
        '#84cc16',
        '#22d3ee',
        '#a78bfa',
        '#f472b6',
      ]
    }
  },
}
</script>

<template>
  <main>
    <img :src="AdminHomeHeader" class="w-full h-[30vh] object-cover">
    <Section title="Admin Home">
      <h2>Server URL: {{ store.apiURL }}</h2>
      <br><hr class="border-primary border-2 rounded-full"><br>
      <div class="grid grid-cols-2">
        <router-link v-for="(item, index) in menus" :to="item.to" :style="{ backgroundColor: colors[index % this.colors.length] }" class="text-white p-6 mx-4 my-2 rounded-lg shadow-lg hover:shadow-xl flex hover:scale-105 transition duration-150 min-h-[230px]">
          <div class="w-1/3">
            <span class="text-[120px]">{{ item.icon }}</span>
          </div>
          <div class="w-2/3">
            <h2 class="text-4xl font-pattaya">{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </router-link>
      </div>
    </Section>
  </main>
</template>
