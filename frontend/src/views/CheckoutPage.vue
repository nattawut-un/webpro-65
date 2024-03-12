<script setup>
import Section from '@/components/Section.vue'
import ProductCard from '@/components/ProductCard.vue'
import AddressCard from '@/components/AddressCard.vue'
</script>

<script>
import { store } from '../store.js'
import http from '@/http';
export default {
  data() {
    return {
      store,
      userInfo: {},
      address: [],
      selectedAddress: {},
    }
  },
  methods: {
    async userFetch() {
      const result = await http.get('/api/get_user')
      .then((res) => {
        if (res.error) {
          alert('โปรดลงชื่อเข้าใช้ใหม่')
          this.$router.push('/login')
        } else {
          this.userInfo = JSON.parse(JSON.stringify(res.data.data))
          this.address = JSON.parse(JSON.stringify(res.data.address))
          this.selectedAddress = this.address.find(currentValue => currentValue.mainAddress)
        }
      }).catch((err) => {
        console.log(err)
        alert('[catch] ' + err)
        this.$router.push('/login')
      })
    },
    async sendOrder() {
      let cartClean = this.store.cart.map((currentValue => {
        return {
          id: currentValue.id,
          quantity: currentValue.quantity,
          price: currentValue.price,
        }
      }))
      const result = await http.post('/api/place_order', {
        user_id: this.userInfo.id,
        address_id: this.selectedAddress.id,
        cart: JSON.stringify(cartClean)
      }).then(res => {
        alert('การสั่งซื้อสำเร็จ')
        localStorage.removeItem('cart')
        this.store.cart = []
        this.$router.push('/')
      }).catch(err => {
        alert(err)
      })
    }
  },
  computed: {
    totalPrice() {
      return this.store.cart.reduce((total, num) => {
        return total + parseFloat(num.price * num.quantity)
      }, 0)
    }
  },
  mounted() {
    if (!store.user || store.cart.length == 0) {
      this.$router.push('/')
    } else {
      this.userFetch()
    }
  }
}
</script>

<template>
  <div>
    <Section title="สั่งซื้อ">
      <p>โปรดตรวจสอบข้อมูลต่างๆ ก่อนสั่งซื้อ</p><br>
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="this.$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button>
    </Section>
    <div class="bg-white font-mali">
      <div class="container mx-auto flex py-8">
        <div class="w-1/2 pr-4">
          <h1 class="font-pattaya text-4xl">รายการอาหาร</h1><br>
          <ProductCard v-for="item in store.cart" :title="item.title" :amount="item.quantity" :price="item.price" :image="item.images[0].path" />
        </div>
        <div class="w-1/2 pl-4">
          <h1 class="font-pattaya text-4xl">ข้อมูลผู้ใช้</h1>
          <br><hr><br>
          <div>
            <div class="flex pb-2">
              <h2 class="font-bold text-xl mr-2">ที่อยู่</h2>
              <router-link to="/user" class="bg-green-400 px-3 py-1 rounded-full text-sm">เพิ่มอันใหม่</router-link>
            </div>
            <div class="flex" v-for="addr in address">
              <input type="radio" v-model="selectedAddress" :key="addr.id" :id="addr.id" :value="addr" class="mx-4">
              <label :for="addr.id">
                <AddressCard :main="addr.mainAddress">
                  {{ addr.address }}
                </AddressCard>
              </label>
            </div>
          </div>
          <br><hr><br>
        </div>
      </div>
    </div>
    <Section :title="'ราคาทั้งหมด: ' + totalPrice + ' บาท'">
      <p> <!-- idk --> </p><br>
      <button @click="sendOrder()" class="rounded-full bg-primary text-white text-2xl font-bold px-6 py-3">สั่งซื้อเลย</button><br><br>
      <!-- <p><b>this.userInfo.id:</b> {{ this.userInfo.id }}</p>
      <p><b>this.selectedAddress.id:</b> {{ this.selectedAddress.id }}</p>
      <p><b>this.store.cart:</b> {{ this.store.cart }}</p> -->
    </Section>
  </div>
</template>
