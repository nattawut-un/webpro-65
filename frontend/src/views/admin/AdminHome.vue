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
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deserunt qui earum, nihil harum quo, explicabo rerum mollitia labore rem libero deleniti nesciunt vitae aliquid odit tenetur quibusdam illo expedita.',
          to: '/admin/products'
        },
        {
          icon: '📃',
          title: 'รายการสั่งซื้อ',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deserunt qui earum, nihil harum quo, explicabo rerum mollitia labore rem libero deleniti nesciunt vitae aliquid odit tenetur quibusdam illo expedita.',
          to: '/admin/orders'
        },
        {
          icon: '👥',
          title: 'จัดการผู้ใช้',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deserunt qui earum, nihil harum quo, explicabo rerum mollitia labore rem libero deleniti nesciunt vitae aliquid odit tenetur quibusdam illo expedita.',
          to: '/admin/users'
        },
        {
          icon: '💵',
          title: 'ระบบบัญชี',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deserunt qui earum, nihil harum quo, explicabo rerum mollitia labore rem libero deleniti nesciunt vitae aliquid odit tenetur quibusdam illo expedita.',
          to: '/admin/account'
        },
        {
          icon: '⚙️',
          title: 'ตั้งค่าระบบ',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro deserunt qui earum, nihil harum quo, explicabo rerum mollitia labore rem libero deleniti nesciunt vitae aliquid odit tenetur quibusdam illo expedita.',
          to: '/admin/settings'
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
  methods: {
    async authorize() {
      const result = await http.post('/api/get_user')
      .then(res => {
        if (res.error) {
          alert(res.error)
          this.$router.back()
        } else if (res.data.data.is_admin != 1) {
          this.$router.push('/')
        } else {
          this.userInfo = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    if (!this.$cookies.isKey('jwt-token')) {
      this.$router.push('/login')
    } else {
      this.authorize()
    }
  }
}
</script>

<template>
  <main>
    <img :src="AdminHomeHeader" class="w-full h-[30vh] object-cover">
    <Section title="Admin Home">
      <!-- <h2>{{ store.apiURL }}</h2><br>
      <h2>{{ userInfo }}</h2> -->
      <br><hr class="border-primary border-2 rounded-full"><br>
      <div class="grid grid-cols-2">
        <router-link v-for="(item, index) in menus" :to="item.to" :style="{ backgroundColor: colors[index % this.colors.length] }" class="text-white p-6 mx-4 my-2 rounded-lg shadow-lg hover:shadow-xl flex hover:scale-105 transition duration-150">
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
