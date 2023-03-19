<script setup>
import Section from '../components/Section.vue'
</script>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      userInfo: {},
      loading: false
    }
  },
  methods: {
    async loadProfile() {
      this.loading = true
      if (this.$cookies.isKey('jwt-token')) {
        const result = await axios.post('http://localhost:3000/api/get-user', {}, {
          headers: {
            'authorization': `Bearer ${this.$cookies.get('jwt-token')}`
          }
        }).then(response => {
          if (response.error) {
            alert('โปรดลงชื่อเข้าใช้ใหม่')
            this.$router.push('/login')
          } else {
            this.userInfo = JSON.parse(JSON.stringify(response.data.data))
          }
        }).catch((err) => {
          console.log(err)
          alert('[catch] ' + err)
          this.$router.push('/login')
        })
      } else {
        alert('โปรดลงชื่อเข้าใช้ใหม่')
        this.$router.push('/login')
      }
      this.loading = false
    }
  },
  mounted() {
    this.userInfo = {}
    this.loadProfile()
  }
}
</script>

<template>
  <div>
    <img src="../assets/images/food_profile.jpg" class="w-full h-[40vh] object-cover">
    <Section v-show="loading">
      <div class="flex items-center justify-center h-[45vh]">
        <div class="inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    </Section>
    <Section v-show="!loading" title="ข้อมูลผู้ใช้">
      <p>id: {{ userInfo.id }}</p>
      <p>username: {{ userInfo.username }}</p>
      <p>password: {{ userInfo.password }}</p>
      <p>is_admin: {{ userInfo.is_admin }}</p>
      <p>last_login: {{ userInfo.last_login }}</p>
      <p>phone: {{ userInfo.phone }}</p>
      <p>email: {{ userInfo.email }}</p>
      <p>address: {{ userInfo.address }}</p>
      <p>favorites: {{ userInfo.favorites }}</p>
      <br><hr><br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, rem! Ipsum quaerat vitae atque beatae, blanditiis perspiciatis natus dicta esse maiores iure, sit doloremque earum minima voluptatum? Hic, repudiandae earum?<br>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis hic quis dolores. Cum placeat repellat non sint, cumque voluptatibus? Placeat enim provident ipsa officia alias similique ullam pariatur aperiam perspiciatis.<br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad consequatur fuga quos? Odit, quos dolorem? Aperiam rem enim facere, esse vel culpa ipsa fugiat ut dignissimos provident corporis minus dolores!
    </Section>
  </div>
</template>
