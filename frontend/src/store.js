import { reactive } from 'vue'

const api = import.meta.env.VITE_API_URL

export const store = reactive({
  shopName: 'Web Pro',
  cart: [],
  username: '',
  session: '',
  apiURL: api
})
