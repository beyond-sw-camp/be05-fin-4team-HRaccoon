import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const noAuthUrls = ['/auth/sign-in', '/auth/re-issuance', '/auth/sign-out']

api.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    if (!noAuthUrls.includes(config.url)) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => Promise.reject(error),
)

api.interceptors.response.use(
  response => response,
  async error => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      const errorMessages = error.response.data.message
      if (errorMessages === '토큰이 만료되었습니다.' || errorMessages === '로그인이 필요합니다.') {
        originalRequest._retry = true
        try {
          await authStore.fetchRefreshToken()
          const token = authStore.accessToken
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
