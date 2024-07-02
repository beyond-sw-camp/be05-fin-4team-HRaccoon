<template>
  <VCard>
    <VCardTitle>나의 근무시간</VCardTitle>
    <VCardText>
      <VCol>
        <ApexChart :params="params" />
      </VCol>
    </VCardText>
    <template v-slot:actions>
      <VBtn
        :to="{ path: '/attendance' }"
        append-icon="mdi-chevron-right"
        block
        elevation="20"
        size="large"
        text="근태 관리 바로가기"
        variant="outlined"
      />
    </template>
  </VCard>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// components
import ApexChart from '@/components/apexchart/ApexChart.vue'

// api
import axios from '@/api/axios'

// store
import { useAuthStore } from '@/stores/useAuthStore'

// util
import { removeDecimal } from '@/util/util.js'

const userNo = ref(useAuthStore().userNo || '')
const params = ref({
  text: '총 근무 시간',
  type: 'radialBar',
  formattedPercent: 0,
})

const fetchAttendance = async () => {
  try {
    const response = await axios.get(`/attendance/weektotalpercent/${userNo.value}`)
    console.log('[SUCCESS] fetchAttendance response:', response.data.data)

    params.value.formattedPercent = removeDecimal(response.data.data.formattedPercent)
  } catch (error) {
    console.error('[ERROR] fetchApprovalSuccess error:', error)
  }
}

onMounted(() => {
  fetchAttendance()
})
</script>

<style></style>
