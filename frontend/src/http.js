import axios from 'axios'

const api = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL: api,
  withCredentials: true,
})

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
      return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default instance
