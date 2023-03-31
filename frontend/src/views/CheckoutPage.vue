<script setup>
import { store } from '../store.js'
import Section from '@/components/Section.vue'
import ProductCard from '@/components/ProductCard.vue'
import AddressCard from '@/components/AddressCard.vue'

import axios from 'axios';
</script>

<script>
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
      const result = await axios.post('http://localhost:3000/api/get-user', {}, {
        headers: {
          'authorization': `Bearer ${this.$cookies.get('jwt-token')}`
        }
      }).then((res) => {
        if (res.error) {
          alert('โปรดลงชื่อเข้าใช้ใหม่')
          this.$router.push('/login')
        } else {
          this.userInfo = JSON.parse(JSON.stringify(res.data.data))
          this.address = JSON.parse(JSON.stringify(res.data.address))
          this.selectedAddress = this.address.find(currentValue => currentValue.main_addr)
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
          name: currentValue.name,
          quantity: currentValue.quantity,
          price: currentValue.price,
          total: currentValue.quantity * currentValue.price
        }
      }))
      const result = await axios.post('http://localhost:3000/api/place-order',
      {
        user_id: this.userInfo.id,
        address_id: this.selectedAddress.id,
        cart: JSON.stringify(cartClean)
      }, {
        headers: {
          'authorization': `Bearer ${this.$cookies.get('jwt-token')}`
        }
      }).then(res => {
        alert('การสั่งซื้อสำเร็จ')
        localStorage.removeItem('cart')
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
    if (!store.username || store.cart.length == 0) {
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
      <p>{{ userInfo }}</p><br>
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="this.$router.back()"><img class="h-7" src="../svg/NavBack.svg"></button>
    </Section>
    <div class="bg-white font-mali">
      <div class="container mx-auto flex py-8">
        <div class="w-1/2 pr-4">
          <h1 class="font-pattaya text-4xl">รายการอาหาร</h1><br>
          <ProductCard v-for="item in store.cart" :title="item.name" :amount="item.quantity" :price="item.price" />
        </div>
        <div class="w-1/2 pl-4">
          <h1 class="font-pattaya text-4xl">ข้อมูลผู้ใช้</h1>
          <br><hr><br>
          <h2 class="font-bold text-xl">ที่อยู่</h2>
          <AddressCard v-for="addr in address" :main="addr.main_addr" @click="this.selectedAddress = addr">
            {{ addr.address }}
          </AddressCard>
          <br><hr><br>
          selected = {{ selectedAddress }}
        </div>
      </div>
    </div>
    <Section :title="'ราคาทั้งหมด: ' + totalPrice + ' บาท'">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa ut quos optio deserunt aut ipsum velit omnis laborum nesciunt! Vero impedit fugit, voluptates dolore suscipit consequatur molestias eum ad repellendus.</p><br>
      <button @click="sendOrder()" class="rounded-full bg-primary text-white text-2xl font-bold px-6 py-3">สั่งซื้อเลย</button><br><br>
      <p><b>this.userInfo.id:</b> {{ this.userInfo.id }}</p>
      <p><b>this.selectedAddress.id:</b> {{ this.selectedAddress.id }}</p>
      <p><b>this.store.cart:</b> {{ this.store.cart }}</p>
    </Section>
  </div>
</template>