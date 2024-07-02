<template>
  <VerticalNavLayout>
    <!-- 👉 horizontal Navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn class="ms-n3 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <TodoDialog class="me-2" />

        <NotificationButton class="me-3" />

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile class="me-4" />

        <TwoButtonDialog
          :right-btn-action="onHandleDialogButton"
          button-name="로그아웃"
          content="정말로 로그아웃 하시겠습니까?"
          icon="mdi-logout"
          right-btn-name="로그아웃"
          title="로그아웃"
        />
      </div>
    </template>

    <!-- 👉 Vertical Navbar -->
    <template #vertical-nav-content>
      <VerticalNavSectionTitle
        :item="{
          heading: '내 정보',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '홈',
          icon: 'bx-home',
          to: '/home',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '마이 페이지',
          icon: 'mdi-account-cog-outline',
          to: '/mypage',
        }"
      />

      <!-- 👉 관리자 -->
      <VerticalNavSectionTitle
        v-if="authority === 'ADMIN'"
        :item="{
          heading: '관리자',
        }"
      />
      <VerticalNavLink
        v-if="authority === 'ADMIN'"
        :item="{
          title: '직원 정보 조회',
          icon: 'bx-user-check',
          to: '/admin/employee/list',
        }"
      />
      <VerticalNavLink
        v-if="authority === 'ADMIN'"
        :item="{
          title: '직원 등록',
          icon: 'bx-user-plus',
          to: '/admin/employee/register',
        }"
      />

      <!-- 👉 근태 -->
      <VerticalNavSectionTitle
        :item="{
          heading: '근태',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '근태 관리',
          icon: 'bx-alarm-add',
          to: '/attendance',
        }"
      />

      <!-- 👉 결재 -->
      <VerticalNavSectionTitle
        :item="{
          heading: '결재 관리',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '결재 상신',
          icon: 'bx-barcode',
          to: '/approval/request',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '결재 요청 관리',
          icon: 'bx-add-to-queue',
          to: '/approval/request/list',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '결재 현황 관리',
          icon: 'bx-bar-chart-alt-2',
          to: '/approval/status/list',
        }"
      />

      <!-- 👉 좌석 -->
      <VerticalNavSectionTitle
        :item="{
          heading: '좌석 관리',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '좌석 선택',
          icon: 'mdi-alpha-t-box-outline',
          to: '/seat',
        }"
      />

      <!-- 👉직원 -->
      <VerticalNavSectionTitle
        :item="{
          heading: '직원 관리',
        }"
      />
      <VerticalNavLink
        :item="{
          title: '직원 정보 조회',
          icon: 'bx-bar-chart-alt',
          to: '/search',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'

// Components
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

import Footer from '@/layouts/components/GlobalFooter.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'
import TodoDialog from '@/components/todo/TodoDialog.vue'
import NotificationButton from '@/layouts/components/NotificationButton.vue'

// store
import { useAuthStore } from '@/stores/useAuthStore.js'
import { useSSEStore } from '@/stores/useSSEStore.js'

// util
import { connectSSE } from '@/plugins/sse/sseService.js'

const { fetchSignOut, authority } = useAuthStore()
const sseStore = useSSEStore()

const router = useRouter()
const toast = useToast()

const onHandleDialogButton = async () => {
  const res = await fetchSignOut()

  if (res) {
    await router.push('/login')
    toast.success('로그아웃 되었습니다.')
  } else {
    toast.error('로그아웃에 실패했습니다.')
  }
}

onMounted(() => {
  connectSSE()
  console.log(authority)
})

watch(
  () => sseStore.isConnected,
  (newVal, oldVal) => {
    if (newVal) {
      console.log('SSE 연결되었습니다.')
    } else {
      console.log('SSE 연결이 끊어졌습니다.')
    }
  },
)

watch(
  () => sseStore.lastError,
  (newVal, oldVal) => {
    if (newVal) {
      toast.error(`SSE Error: ${newVal}`)
    }
  },
)
</script>
<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
