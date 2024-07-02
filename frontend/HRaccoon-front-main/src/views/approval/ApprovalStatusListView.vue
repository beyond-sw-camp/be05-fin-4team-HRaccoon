<template>
  <h1 class="mb-2">| 결재 현황 관리</h1>
  <VCard>
    <VCard>
      <ApprovalTable :data="params" type="status" />
      <VPagination v-model="currentPage" :length="totalPage" :total-visible="5" @update:modelValue="onHandlePage" />
    </VCard>
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

const userNo = ref(useAuthStore().userNo || '')

const fetchApprovalStatusList = async () => {
  try {
    const response = await api.get(`/approval/submitted-approval-list/${userNo.value}`, {
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
    console.error('[ERROR] fetchApprovalStatusList error:', error)
  }
}

const onHandlePage = page => {
  currentPage.value = page

  fetchApprovalStatusList()
}

watch(
  userNo,
  async newUserNo => {
    if (newUserNo) {
      await fetchApprovalStatusList()
    }
  },
  { immediate: true },
)
</script>
<style scoped></style>
