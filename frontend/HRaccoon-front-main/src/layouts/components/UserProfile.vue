<template>
  <VBadge bordered color="success" dot location="bottom right" offset-x="3" offset-y="3">
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <!--      VIMg-->
      <v-img cover src="https://hraccoon-image-bucket.s3.ap-northeast-2.amazonaws.com/apple-icon-72x72.png" />
      <!-- SECTION Menu -->
      <VMenu activator="parent" location="bottom end" offset="14px" width="230">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge color="success" dot location="bottom right" offset-x="3" offset-y="3">
                  <VAvatar color="primary" variant="tonal">
                    <v-img
                      cover
                      src="https://hraccoon-image-bucket.s3.ap-northeast-2.amazonaws.com/apple-icon-72x72.png"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold"> {{ userName || 'Guest' }}</VListItemTitle>
            <VListItemSubtitle>{{ authority || 'User' }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 MyPage -->
          <VListItem :to="{ name: 'MyPage' }" link>
            <template #prepend>
              <VIcon class="me-2" icon="bx-user" size="22" />
            </template>

            <VListItemTitle>MyPage</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="bx-cog" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
<script setup>
import { useAuthStore } from '@/stores/useAuthStore.js'
import { ref, watch } from 'vue'

const authStore = useAuthStore()
const authority = ref(authStore.authority || '')
const userName = ref(authStore.userName || '')

watch(
  () => [authStore.authority, authStore.userName],
  ([newAuthority, newUserName]) => {
    if (!authority.value) {
      authority.value = newAuthority
    }
    if (!userName.value) {
      userName.value = newUserName
    }
  },
  { immediate: true },
)
</script>
