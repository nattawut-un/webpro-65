<script setup>
import { store } from '../store';
import Section from '@/components/Section.vue'
</script>

<script>
import http from '@/http'
import { store } from '../store'
import moment from 'moment'

export default {
  data() {
    return {
      store,
      orders: [],
      doing: [],
      finished: []
    }
  },
  methods: {
    async fetchOrder() {
      const result = await http.post('/api/get_order')
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
      }).catch(err => {
        console.log(err)
        alert(err)
        this.$router.push('/')
      })
    }
  },
  created() {
    if (!store.username) {
      this.$router.push('/')
    } else {
      this.fetchOrder()
    }
  }
}
</script>

<template>
  <main>
    <img src="../assets/images/food_profile.jpg" class="w-full h-[30vh] object-cover">
    <Section title="รายการอาหารที่สั่ง">
      <p>คุณสั่งไปแล้วทั้งหมด {{ orders.length }} ครั้ง</p>
      <!-- <br><p>{{ orders }}</p> -->
    </Section>
    <div class="bg-gray-100 py-8">
      <div class="container mx-auto">
        <h2 class="font-pattaya text-2xl">กำลังดำเนินการ</h2>
        <div>
          <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in doing">
            <div class="flex">
              <div class="w-1/2">
                <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.order_id }}</h3>
                <p><b>เวลาที่สั่งซื้อ:</b><br>{{ moment(order.order_time).format('llll') }}</p>
                <p><b>ที่อยู่:</b><br>{{ order.address }}</p>
              </div>
              <div class="w-1/2 px-4">
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
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white py-8">
      <div class="container mx-auto">
        <h2 class="font-pattaya text-2xl">ดำเนินการเสร็จสิ้น</h2>
        <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in finished">
          <div class="flex">
            <div class="w-1/2">
              <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.order_id }}</h3>
              <p><b>เวลาที่สั่งซื้อ:</b><br>{{ moment(order.order_time).format('llll') }} ({{ moment(order.order_time).fromNow() }})</p>
              <p><b>เวลาที่เสร็จสิ้น:</b><br>{{ moment(order.finish_time).format('llll') }} ({{ moment(order.finish_time).fromNow() }})</p>
              <p><b>ที่อยู่:</b><br>{{ order.address }}</p>
            </div>
            <div class="w-1/2 px-4">
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
          <br><button class="bg-primary text-white font-bold rounded-full px-4 py-2">📃 สั่งอีกรอบ</button>
        </div>
      </div>
    </div>
  </main>
</template>