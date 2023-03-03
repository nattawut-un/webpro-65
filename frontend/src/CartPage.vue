<script>
export default {
  data() {
    return {
      cart: []
    }
  },
  methods: {
    removeFromCart(item) {
      if (confirm('คุณต้องการลบสินค้าออกจากตะกร้าหรือไม่')) {
        this.cart.splice(item, 1)
        localStorage.setItem('cart', JSON.stringify(this.cart))
        this.$router.go(0)
      }
    },
    clearCart() {
      this.cart = []
      localStorage.setItem('cart', '[]')
      alert('ลบสินค้าทั้งหมดจากจะกร้าแล้ว')
      this.$router.go(0)
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, currentValue) => {
        return total + (parseFloat(currentValue.price) * parseInt(currentValue.quantity))
      }, 0)
    }
  },
  mounted() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <main class="backdrop-blur-lg min-h-[75vh] flex font-mali">
    <div class="w-1/2 bg-gray-300/80">
      <img src="./images/food_cart.jpg" class="w-[100%] h-[100%] object-cover">
    </div>
    <div class="w-1/2 bg-white/80 p-12">
      <button class="bg-red-200 hover:bg-primary transition ease-in-out duration-200 text-black hover:text-white rounded-full px-4 py-2" @click="$router.back()"><img class="h-7" src="./svg/NavBack.svg"></button><br><br>
      <h1 class="text-[400%] font-pattaya">ตะกร้าสินค้า</h1>
      <br><br>
      <div v-show="cart.length == 0">
        <h1 class="text-2xl font-bold">ไม่มีอะไรในตะกร้า</h1>
      </div>
      <div class="flex border-b-2 border-gray-200/50 pt-2 pb-8" v-for="item in cart">
        <div class="w-1/4 mr-8">
          <img :src="'../src/images/products/' + item.id + '.jpg'" class="w-full aspect-square rounded-full object-cover shadow-lg">
        </div>
        <div class="w-3/4 flex">
          <div class="w-2/3">
            <h3 class="text-2xl font-bold">{{ item.name }}</h3>
            <p>ราคา {{ item.price }} บาท</p>
            <p>จำนวน {{ item.quantity }} ที่</p>
          </div>
          <div class="w-1/3 text-end">
            <h1 class="text-6xl font-bold mb-2">{{ item.price*item.quantity }}.-</h1>
            <button class="bg-red-500 text-white rounded-full px-4 py-2" @click="removeFromCart(this.cart.indexOf(item))" :disabled="cart.length == 0">
              ลบ
            </button>
          </div>
        </div>
      </div>
      <br><br><br>
      <div class="mb-8">
        <h2 class="text-3xl font-bold">ราคารวม: {{ totalPrice }} บาท</h2>
      </div>
      <div class="flex">
        <button class="bg-red-500 text-white rounded-full px-4 py-2" @click="clearCart()" :disabled="cart.length == 0">ลบทั้งหมด</button>
      </div>
    </div>
  </main>
</template>