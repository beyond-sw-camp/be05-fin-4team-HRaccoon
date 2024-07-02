<template>
  <VBadge :content="cnt">
    <VIcon icon="bx-bell" size="24" />

    <!-- SECTION Menu -->
    <VMenu activator="parent" location="bottom end" offset="14px">
      <VList>
        <VListSubheader>알림</VListSubheader>
        <VListItem
          v-for="(notification, index) in unreadNotifications"
          :key="index"
          link
          @click="markNotificationAsRead(notification.webNotificationNo)"
        >
          <div class="d-flex flex-row">
            <VIcon class="mr-3" icon="mdi-tooltip-check-outline" />
            <VListItemTitle>{{ notification.webNotificationMessage }}</VListItemTitle>
            <VIcon class="ml-3" icon="mdi-check" />
          </div>
          <VDivider />
        </VListItem>
      </VList>
    </VMenu>
  </VBadge>
</template>
<script setup>
import { useSSEStore } from '@/stores/useSSEStore.js'
import { ref, watch } from 'vue'

const notificationStore = useSSEStore()

const notifications = ref(notificationStore.notifications)
const unreadNotifications = ref(notifications.value.filter(notification => !notification.webNotificationIsRead))
const cnt = ref(unreadNotifications.value.length)

const markNotificationAsRead = async webNotificationNo => {
  await notificationStore.markAsRead(webNotificationNo)
}

watch(
  () => notificationStore.notifications,
  newNotifications => {
    notifications.value = newNotifications
    unreadNotifications.value = notifications.value.filter(notification => !notification.webNotificationIsRead)
    cnt.value = unreadNotifications.value.length
  },
  { deep: true },
)
</script>
