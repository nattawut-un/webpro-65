<script setup>
import Section from '@/components/Section.vue'

import { store } from '@/store'
import http from '@/http'
import moment from 'moment'
</script>

<script>

export default {
  data() {
    return {
      store,
      loading: false,
      users: [],
    }
  },
  methods: {
    async getUsers() {
      this.loading = true
      await http.get('/api/get_all_users')
      .then(res => {
        this.users = res.data
      })
      .catch(err => console.log(err))
      this.loading = false
    },
    async deleteUser(user) {
      this.loading = true
      if (confirm('คุณต้องการลบผู้ใช้ "' + user.username + '" หรือไม่\nการกระทำนี้ไม่สามารถย้อนกลับได้')) {
        await http.delete('/api/user/delete', {
        data: {
          uid: user.id
        }})
        .then(res => {
          alert('ลบผู้ใช้แล้ว')
          this.getUsers()
        })
        .catch(err => console.log(err))
      }
      this.loading = false
    },
    async addAdmin(user) {
      console.log(user)
      await http.put(`/api/user/set_admin`, {
        uid: user.id
      })
      .then(res => {
        alert(`เพิ่ม ${user.username} เป็น admin แล้ว`)
        user.is_admin = 1
      }).catch(err => {
        console.log(err)
      })
    },
    async removeAdmin(user) {
      console.log(user)
      await http.put(`/api/user/remove_admin`, {
        uid: user.id
      })
      .then(res => {
        alert(`ลบ ${user.username} ออกจาก admin แล้ว`)
        user.is_admin = 0
      }).catch(err => {
        console.log(err)
      })
    },
  },
  mounted() {
    this.getUsers()
  },
}
</script>

<template>
  <main>
    <Section title="รายการผู้ใช้ทั้งหมด">
      <p>มีผู้ใช้ทั้งหมด {{ users.length }} คน</p>
      <br><br>
      <router-link to="/admin" class="bg-secondary hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2">กลับไปหน้าหลัก</router-link>
    </Section>

    <!-- finished -->
    <div class="bg-white p-8 font-mali">
      <!-- each item -->
      <div v-show="loading">
        <div class="flex items-center justify-center h-[45vh]">
          <div
            class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      </div>

      <!-- finished -->
      <div v-if="!loading">
        <h1 class="text-2xl font-pattaya">รายการผู้ใช้ทั้งหมด ({{ users.length }})</h1><br>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left">
            <thead class="text-sm bg-gray-300 text-black">
              <tr>
                <th scope="col" class="px-6 py-3">
                  ชื่อ
                </th>
                <th scope="col" class="px-6 py-3">
                  ชื่อจริง
                </th>
                <!-- <th scope="col" class="px-6 py-3">
                  อีเมล
                </th>
                <th scope="col" class="px-6 py-3">
                  เบอร์
                </th> -->
                <th scope="col" class="px-6 py-3">
                  การสั่งซื้อ
                </th>
                <th scope="col" class="px-6 py-3">
                  เวลาสมัคร
                </th>
                <th scope="col" class="px-6 py-3">
                  เวลา login ล่าสุด
                </th>
                <th scope="col" class="px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="bg-gray-100 border-b hover:bg-gray-200 text-black transition ease-out duration-100"
                v-for="user in users" :key="user.id">
                <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                  <span v-if="user.id == store.user.data.id" class="bg-green-300 text-black text-xs p-1 rounded-lg mr-1.5">YOU</span>
                  <span v-if="user.is_admin == 1" class="bg-secondary text-black text-xs p-1 rounded-lg mr-1.5">ADMIN</span>
                  <span v-if="user.is_admin == 2" class="bg-primary text-white text-xs p-1 rounded-lg mr-1.5">OWNER</span>
                  <span class="tooltip">
                    {{ user.username }}
                    <span class="tooltiptext text-xs">id: {{ user.id }}</span>
                  </span>
                </th>
                <td class="px-6 py-4 font-bold">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <!-- <td class="px-6 py-4">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4">
                  {{ user.phone }}
                </td> -->
                <td class="px-6 py-4">
                  {{ user._count.orders }}
                </td>
                <td class="px-6 py-4">
                  <span class="tooltip">
                    {{ moment(user.registerTime).fromNow() }}
                    <span class="tooltiptext text-xs">{{ moment(user.registerTime).format('llll') }}</span>
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="tooltip">
                    {{ moment(user.lastLogin).fromNow() }}
                    <span class="tooltiptext text-xs">{{ moment(user.lastLogin).format('llll') }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div v-if="store.user.data.isAdmin === 2">
                    <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" v-if="store.user.data.isAdmin === 2 && user.isAdmin === 0" @click="addAdmin(user)">
                      ➕ ตั้งเป็นแอดมิน
                    </button>
                    <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" v-if="store.user.data.isAdmin === 2 && user.isAdmin === 1" @click="removeAdmin(user)">
                      ❌ ลบออกจากแอดมิน
                    </button>&nbsp;
                    <button @click="deleteUser(user)" v-if="store.user.data.id !== user.id"
                      class="font-medium text-red-500 hover:underline">
                      ❌ ลบผู้ใช้
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.tooltiptext {
  visibility: hidden;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: start;
  font-weight: normal;
  padding: 4px 5px;
  margin: -3px 10px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  transition: opacity .2s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
