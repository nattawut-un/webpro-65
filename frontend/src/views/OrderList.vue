<script setup>
import { store } from '../store';
import Section from '@/components/Section.vue'
</script>

<script>
import http from '@/http'
import { store } from '../store'

export default {
  data() {
    return {
      store,
      orders: []
    }
  },
  methods: {
    async fetchOrder() {
      const result = await http.post('/api/get_order')
      .then(res => {
        this.orders = res.data
      }).catch(err => {
        console.log(err)
        alert(err)
        this.$router.push('/')
      })
    }
  },
  mounted() {
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
      <p>ตรวจสอบได้ที่นี่</p><br>
      <p>{{ orders }}</p>
    </Section>
    <div class="bg-gray-100 py-8">
      <div class="container mx-auto">
        <h2 class="font-pattaya text-2xl">กำลังดำเนินการ</h2>
        <div>
          <div class="bg-gray-200 my-2 p-4 rounded-lg border-4 border-gray-300 font-mali" v-for="order in orders">
            <div class="flex" v-if="order.finish_time == null">
              <div class="w-1/2">
                <!-- <div class="bg-gray-100/50">
                  <p v-for="(value, key) in order">{{ key }}: {{ value }}</p>
                </div> -->
                <h3 class="text-gray-400 font-[monospace] font-bold text-sm mb-3">#{{ order.order_id }}</h3>
                <p><b>เวลาที่สั่งซื้อ:</b><br>{{ new Date(order.order_time).toLocaleString() }}</p>
                <p><b>ที่อยู่:</b><br>{{ order.address }}</p>
              </div>
              <div class="w-1/2 px-4">
                <table class="table-auto w-full bg-white">
                  <thead class="bg-red-100">
                    <tr class="border-b-2 border-primary text-left">
                      <th class="px-2">ชื่อ</th>
                      <th class="px-2">จำนวน</th>
                      <th class="px-2">ราคา</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t-2 border-gray-300" v-for="item in JSON.parse(order.cart)">
                      <td class="px-2">{{ item.name }}</td>
                      <td class="px-2">{{ item.quantity }}</td>
                      <td class="px-2">{{ item.total }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white py-8">
      <div class="container mx-auto">
        <h2 class="font-pattaya text-2xl">ดำเนินการเสร็จสิ้น</h2>
      </div>
    </div>
  </main>
</template>