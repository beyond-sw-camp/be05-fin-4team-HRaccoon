<template>
  <h1 class="mb-2">| 결재 요청 관리</h1>
  <VCard>
    <ApprovalTable :data="params" type="request" />
    <VPagination v-model="currentPage" :length="totalPage" :total-visible="5" @update:modelValue="onHandlePage" />
  </VCard>
</template>
<script setup>
import { ref, watch } from 'vue'
// components
import ApprovalTable from '@/components/table/ApprovalTable.vue'
// api
import api from '@/api/axios.js'
// store
import { useAuthStore } from '@/stores/useAuthStore.js'
// util
import { formatDate } from '@/util/util.js'
// constants
import { APPROVAL_STATUS, APPROVAL_TITLE } from '@/util/constants/approvalConstant.js'

const params = ref([])
const currentPage = ref(1)
const totalPage = ref(1)

const userId = ref(useAuthStore().userId || '')

const fetchApprovalRequestList = async () => {
  try {
    const response = await api.get(`/approval/requested-approval-list/${userId.value}`, {
      params: {
        pageNumber: currentPage.value,
      },
    })

    params.value = response.data.data.content.map(item => {
      return {
        ...item,
        approvalTitle: APPROVAL_TITLE[item.approvalType] || APPROVAL_TITLE.DEFAULT,
        approvalSubmitDate: formatDate(item.approvalSubmitDate),
        approvalStatus: APPROVAL_STATUS[item.approvalStatus],
      }
    })
    totalPage.value = response.data.data.totalPages
    currentPage.value = response.data.data.pageable.pageNumber + 1
  } catch (error) {
    console.error('[ERROR] fetchApprovalRequestList error:', error)
  }
}

const onHandlePage = page => {
  currentPage.value = page

  fetchApprovalRequestList()
}

watch(
  userId,
  async newUserId => {
    if (newUserId) {
      await fetchApprovalRequestList()
    }
  },
  { immediate: true },
)
</script>
<style scoped></style>
