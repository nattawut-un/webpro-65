<script setup>
import Section from '@/components/Section.vue'

import { store } from '@/store'
import http from '@/http'
import moment from 'moment'
moment.locale('th')
</script>

<script>

export default {
  data() {
    return {
      store,
      loading: false,
      orders: [],
      doing: [],
      finished: [],
    }
  },
  methods: {
    async getOrders() {
      this.loading = true
      await http.get('/api/orders')
        .then(response => {
          this.orders = response.data
          this.orders.forEach(v => {
            v.cart = JSON.parse(v.cart)
            v.totalPrice = v.cart.reduce((total, item) => {
              return total + parseFloat(item.total)
            }, 0)
          })
          this.doing = this.orders.filter(v => {
            return !v.finish_time
          })
          this.finished = this.orders.filter(v => {
            return v.finish_time
          })
        })
        .catch(err => console.log(err))
      this.loading = false
      this.toRefresh = 30
    },
    async finishOrder(order) {
      if (confirm('คุณต้องการทำให้ออเดอร์นี้เสร็จหรือไม่')) {
        this.loading = true
        await http.put('/api/orders/finish', {
          order_id: order.order_id
        })
          .then(response => {
            alert('order เสร็จสมบูรณ์\norder-id=' + order.order_id)
            this.getOrders()
          })
          .catch(err => console.log(err))
        this.loading = false
      }
    },
    async deleteOrder(order) {
      if (confirm('คุณต้องการลบออเดอร์นี้หรือไม่')) {
        this.loading = true
        await http.delete(`/api/orders/delete/${order.order_id}`)
          .then(response => {
            alert('order ถูกลบ\norder-id=' + order.order_id)
            this.getOrders()
          })
          .catch(err => console.log(err))
        this.loading = false
      }
    },
    async authorize() {
      const result = await http.post('/api/get_user')
        .then(res => {
          if (res.error) {
            alert(res.error)
            this.$router.back()
          } else if (res.data.data.is_admin != 1) { this.$router.push('/') }
          else {
            // this.userInfo = res.data.data
            return true
          }
        }).catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    toRefresh(sec) {
      if (sec <= 0) {
        this.getOrders()
      }
    }
  },
  created() {
    this.getOrders()
  },
}
</script>

<template>
  <main>
    <Section title="รายการผู้ใช้ทั้งหมด">
      <p>รายการผู้ใช้ทั้งหมด</p>
      <br>
      <button class="bg-secondary hover:bg-primary px-4 py-2 rounded-full text-black hover:text-white font-bold transition ease-out duration-200" @click="getOrders()">รีเฟรช</button>
      <br><br>
      <router-link to="/admin" class="bg-secondary hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2">กลับไปหน้าหลัก</router-link>
    </Section>
    <div class="bg-gray-100 p-8 font-mali">
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
      <!-- <router-link class="font-mali bg-gray-200 shadow-lg m-8 px-8 py-6 rounded-lg flex" v-for="item in orders" :to="'/admin/orders/' + item.order_id">
          {{ item.order_id }}
        </router-link> -->

      <!-- finished -->
      <h1 class="text-2xl font-pattaya">กำลังดำเนินการ ({{ doing.length }})</h1>
      <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in doing">
        <div class="flex" v-if="order.finish_time == null">
          <div class="w-1/2">
            <!-- <div class="bg-gray-100/50">
              <p v-for="(value, key) in order">{{ key }}: {{ value }}</p>
            </div> -->
            <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.order_id }}</h3>
            <p><b>ชื่อผู้สั่ง:</b><br>{{ order.username }}</p>
            <p><b>เวลาที่สั่งซื้อ:</b><br>{{ moment(order.order_time).format('llll') }} ({{ moment(order.order_time).fromNow() }})</p>
            <p><b>ที่อยู่:</b><br>{{ order.address }}</p>
          </div>
          <div class="w-1/2 px-4">
            <!-- <table class="table-auto w-full bg-white">
              <thead class="bg-red-100">
                <tr class="border-b-2 border-primary text-left">
                  <th class="px-2">ชื่อ</th>
                  <th class="px-2">จำนวน</th>
                  <th class="px-2">ราคา</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t-2 border-gray-300" v-for="item in order.cart">
                  <td class="px-2">{{ item.name }}</td>
                  <td class="px-2">{{ item.quantity }}</td>
                  <td class="px-2">{{ item.total }}</td>
                </tr>
              </tbody>
            </table> -->
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left">
                <thead class="text-sm uppercase bg-gray-300 text-black">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      ชื่อ
                    </th>
                    <th scope="col" class="px-6 py-3">
                      จำนวน
                    </th>
                    <th scope="col" class="px-6 py-3">
                      ราคา
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="bg-gray-100 border-b"
                    v-for="item in order.cart" :key="item.order_id">
                    <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                      {{ item.name }}
                    </th>
                    <td class="px-6 py-4">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4">
                      {{ item.total }}.-
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br>
        <div class="flex">
          <button class="bg-green-400 px-4 py-2 font-bold rounded-full mr-2" @click="finishOrder(order)">✅ เสร็จสิ้น</button>
          <button class="bg-red-500 px-4 py-2 text-white font-bold rounded-full mr-2" @click="deleteOrder(order)">🚫 ยกเลิก</button>
        </div>
      </div>
    </div>

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
      <h1 class="text-2xl font-pattaya">เสร็จสิ้น ({{ finished.length }})</h1><br>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="text-sm uppercase bg-gray-300 text-black">
            <tr>
              <th scope="col" class="px-6 py-3">
                ชื่อ
              </th>
              <th scope="col" class="px-6 py-3">
                ที่อยู่
              </th>
              <th scope="col" class="px-6 py-3">
                จำนวน
              </th>
              <th scope="col" class="px-6 py-3">
                ราคารวม
              </th>
              <th scope="col" class="px-6 py-3">
                เวลาสั่งซื้อ
              </th>
              <th scope="col" class="px-6 py-3">
                เวลาเสร็จสิ้น
              </th>
              <th scope="col" class="px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="bg-gray-100 border-b hover:bg-gray-200 text-black transition ease-out duration-100"
              v-for="item in finished" :key="item.order_id">
              <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                {{ item.username }}
              </th>
              <td class="px-6 py-4">
                {{ item.address }}
              </td>
              <td class="px-6 py-4">
                {{ item.cart.length }}
              </td>
              <td class="px-6 py-4">
                {{ item.totalPrice }}.-
              </td>
              <td class="px-6 py-4">
                {{ moment(item.order_time).format('llll') }}<br>({{ moment(item.order_time).fromNow() }})
              </td>
              <td class="px-6 py-4">
                {{ moment(item.finish_time).format('llll') }}<br>({{ moment(item.finish_time).fromNow() }})
              </td>
              <td class="px-6 py-4 text-right">
                <router-link :to="'/admin/orders/' + item.order_id"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline">📃ข้อมุล</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main></template>
