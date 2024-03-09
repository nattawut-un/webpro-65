<script setup>
import { store } from '../store';
import Section from '@/components/Section.vue'
import UserProfileImage from '@/assets/images/food_profile.jpg'
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
      this.loading = true
      this.orders = []
      this.doing = []
      this.finished = []
      await http.get('/api/get_order')
      .then(response => {
        this.orders = response.data
        for (const [key, value] of Object.entries(this.orders)) {
          if (value.finishTime) {
            this.finished.push(value)
          } else {
            this.doing.push(value)
          }
        }
      }).catch(err => {
        console.log(err)
        alert(err)
        // this.$router.push('/')
      })
    },
    totalPrice(list) {
      return list.reduce((total, item) => { return total + (item.priceEach * item.amount) }, 0)
    },
    totalAmount(list) {
      return list.reduce((total, item) => { return total + item.amount }, 0)
    },
  },
  mounted() {
    if (!store.user) {
      this.$router.push('/')
    } else {
      this.fetchOrder()
    }
  }
}
</script>

<template>
  <main>
    <img :src="UserProfileImage" class="w-full h-[30vh] object-cover">
    <Section title="รายการอาหารที่สั่ง">
      <p>คุณสั่งไปแล้วทั้งหมด {{ orders.length }} ครั้ง</p>
      <!-- <br><p>{{ orders }}</p> -->
    </Section>
    <div class="bg-gray-100 py-8">
      <div class="container mx-auto">
        <h2 class="font-pattaya text-2xl">กำลังดำเนินการ ({{ doing.length }})</h2>
        <div>
          <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in doing">
            <div class="flex">
              <div class="w-1/2">
                <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.id }}</h3>
                <p><b>เวลาที่สั่งซื้อ:</b><br>{{ moment(order.orderTime).format('llll') }}</p>
                <p><b>ที่อยู่:</b><br>{{ order.address.address }}</p>
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
                        v-for="item in order.cartItem" :key="item.id">
                        <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                          {{ item.product.title }}
                        </th>
                        <td class="px-6 py-4">
                          {{ item.amount }}
                        </td>
                        <td class="px-6 py-4">
                          {{ item.product.price * item.amount }}.-
                        </td>
                      </tr>
                      <tr
                        class="bg-gray-200 border-b">
                        <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                          รวม
                        </th>
                        <td class="px-6 py-4 font-bold">
                          {{ totalAmount(order.cartItem) }}
                        </td>
                        <td class="px-6 py-4 font-bold">
                          {{ totalPrice(order.cartItem) }}.-
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
        <h2 class="font-pattaya text-2xl">ดำเนินการเสร็จสิ้น ({{ finished.length }})</h2>
        <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in finished">
          <div class="flex">
            <div class="w-1/2">
              <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.id }}</h3>
              <p><b>เวลาที่สั่งซื้อ:</b><br>{{ moment(order.orderTime).format('llll') }} ({{ moment(order.orderTime).fromNow() }})</p>
              <p><b>เวลาที่เสร็จสิ้น:</b><br>{{ moment(order.finishTime).format('llll') }} ({{ moment(order.finishTime).fromNow() }})</p>
              <p><b>ที่อยู่:</b><br>{{ order.address.address }}</p>
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
                      v-for="item in order.cartItem" :key="item.id">
                      <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                        {{ item.product.title }}
                      </th>
                      <td class="px-6 py-4">
                        {{ item.amount }}
                      </td>
                      <td class="px-6 py-4">
                        {{ item.priceEach * item.amount }}.-
                      </td>
                    </tr>
                    <tr
                      class="bg-gray-200 border-b">
                      <th scope="row" class="px-6 py-4 font-bold whitespace-nowrap">
                        รวม
                      </th>
                      <td class="px-6 py-4 font-bold">
                        {{ totalAmount(order.cartItem) }}
                      </td>
                      <td class="px-6 py-4 font-bold">
                        {{ totalPrice(order.cartItem) }}.-
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
  </main>
</template>