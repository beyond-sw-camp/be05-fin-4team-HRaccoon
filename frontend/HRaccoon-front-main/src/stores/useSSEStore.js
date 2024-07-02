import { defineStore } from 'pinia'
import api from '@/api/axios.js'
import { useAuthStore } from '@/stores/useAuthStore.js'

export const useSSEStore = defineStore('sse', {
  state: () => ({
    notifications: [],
    isConnected: false,
    lastError: null,
  }),
  actions: {
    addNotification(notification) {
      this.notifications.push(notification)
    },
    setNotifications(notifications) {
      this.notifications = notifications
    },
    setConnected(connected) {
      this.isConnected = connected
    },
    setError(error) {
      this.lastError = error
    },

    async markAsRead(webNotificationNo) {
      try {
        await api.post(`/notification/read/${webNotificationNo}`)
        const notification = this.notifications.find(n => n.webNotificationNo === webNotificationNo)

        console.log('[INFO] Marked notification as read:', notification)
        if (notification) {
          notification.webNotificationIsRead = true
          console.log('[INFO] Marked notification as read:', notification)
          this.notifications = [...this.notifications]
          console.log('[INFO] Marked notification as read:', this.notifications)
        }
      } catch (error) {
        console.error('[ERROR] Failed to mark notification as read:', error)
      }
    },
  },
  persist: {
    key: () => {
      const authStore = useAuthStore()
      return `sse-store-${authStore.userId}`
    },
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      },
    ],
  },
})
