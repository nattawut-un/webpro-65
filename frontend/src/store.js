import { reactive } from 'vue'
// import { createStore } from 'vuex'

const api = import.meta.env.VITE_API_URL

// const store = createStore({
//   state() {
//     return {
//       shopName: 'Web Pro',
//       cart: [],
//       user: {},
//       apiURL: api
//     }
//   },
//   mutations: {
//     //
//   }
// })

export const store = reactive({
  shopName: 'Web Pro',
  cart: [],
  // username: '',
  user: {},
  apiURL: api
})
