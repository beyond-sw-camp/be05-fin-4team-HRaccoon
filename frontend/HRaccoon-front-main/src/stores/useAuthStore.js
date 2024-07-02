import { defineStore } from 'pinia'
import api from '@/api/axios'
import { jwtDecode } from 'jwt-decode'
import { disconnectSSE } from '@/plugins/sse/sseService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: sessionStorage.getItem('accessToken') || '',
    refreshToken: sessionStorage.getItem('refreshToken') || '',

    userNo: sessionStorage.getItem('userNo') || '',
    userId: sessionStorage.getItem('userId') || '',
    authority: sessionStorage.getItem('authority') || '',

    userName: sessionStorage.getItem('userName') || '',
  }),
  actions: {
    /**
     * @description Login 시 발급되는 accessToken 과 refreshToken 을 sessionStorage 에 저장하는 함수.
     * @param credentials
     */
    async fetchSignIn(credentials) {
      try {
        const response = await api.post('/auth/sign-in', credentials)

        if (response.data.status === 'error') {
          console.error('[ERROR] fetchSignIn func response error message : ', response.data.message)
        }

        this.setAuthData(response.data.data.accessToken, response.data.data.refreshToken)
      } catch (error) {
        console.error('[ERROR] fetchSignIn func error: ', error)
        throw error
      }
    },

    /**
     * @description refreshToken 을 사용하여 새로운 accessToken 과 refreshToken 을 발급받는 함수.
     */
    async fetchRefreshToken() {
      try {
        const response = await api.post(
          '/auth/re-issuance',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.refreshToken}`,
            },
          },
        )

        if (response.data.status === 'error') {
          console.error('[ERROR] fetchRefreshToken func response error message: ', response.data.message)
        }

        this.setAuthData(response.data.data.accessToken, response.data.data.refreshToken)
      } catch (error) {
        console.error('[ERROR] fetchRefreshToken func error:', error)
        await this.fetchSignOut()
        throw new Error('Unable to refresh token, please login again.')
      }
    },

    /**
     * @description 로그아웃 시 sessionStorage 에 저장된 accessToken 과 refreshToken 을 삭제하는 함수.
     * @returns {Promise<boolean>}
     */
    async fetchSignOut() {
      try {
        await api.post(
          '/auth/sign-out',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.refreshToken}`,
            },
          },
        )
        this.clearAuthData()
        disconnectSSE()
        return true
      } catch (error) {
        console.error('Sign out error:', error)
        return false
      }
    },

    /**
     * @description accessToken 과 refreshToken 을 sessionStorage 에 저장하고 상태를 업데이트하는 함수.
     * @param accessToken
     * @param refreshToken
     */
    setAuthData(accessToken, refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken

      const decodedToken = jwtDecode(this.accessToken)
      this.userNo = decodedToken?.userNo
      this.userId = decodedToken?.userId
      this.authority = decodedToken?.authority

      sessionStorage.setItem('accessToken', this.accessToken)
      sessionStorage.setItem('refreshToken', this.refreshToken)
      sessionStorage.setItem('userNo', this.userNo)
      sessionStorage.setItem('userId', this.userId)
      sessionStorage.setItem('authority', this.authority)
    },

    /**
     * @description sessionStorage 에 저장된 모든 인증 데이터를 삭제하는 함수.
     */
    clearAuthData() {
      this.accessToken = ''
      this.refreshToken = ''
      this.userNo = null
      this.userId = null
      this.authority = null
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('userNo')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('authority')
      sessionStorage.removeItem('userName')
    },

    /**
     * @description 사용자 이름을 가져오는 함수.
     */
    async fetchUserName() {
      try {
        const response = await api.get(`/user/info/name/${this.userId}`)

        if (response.data.status === 'error') {
          console.error('[ERROR] fetchUserName func response error message: ', response.data.message)
        }

        this.userName = response.data.data
        sessionStorage.setItem('userName', this.userName)
      } catch (error) {
        console.error('[ERROR] fetchUserName func error:', error)
      }
    },
  },
})
