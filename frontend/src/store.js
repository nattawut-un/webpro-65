import { reactive } from 'vue'

const api = import.meta.env.VITE_API_URL
const shop = import.meta.env.VITE_SHOP_NAME

export const store = reactive({
  shopName: shop,
  cart: [],
  user: {},
  apiURL: api
})
