<template>
  <div>
    <h1 class="mb-2">| 대시보드</h1>
    <VRow>
      <VCol cols="12" md="4">
        <VRow>
          <VCol cols="12">
            <VCard class="card-container">
              <VCardTitle>이번주 나의 근무시간</VCardTitle>
              <VCardText>
                <AttendanceApexChart :params="chartParams" />
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
          </VCol>
          <VCol cols="12">
            <RemainSeat />
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="8">
        <VRow>
          <VCol cols="12">
            <CalendarCard />
          </VCol>
        </VRow>
        <VRow>
          <!-- 👉 Profit -->
          <VCol cols="12" md="6" sm="6">
            <CardStatisticsVertical
              v-bind="{
                title: '평균 휴가 사용률',
                image: chart1,
                stats: 95,
                change: 9,
              }"
            />
          </VCol>

          <!-- 👉 Sales -->
          <VCol cols="12" md="6" sm="6">
            <CardStatisticsVertical
              v-bind="{
                title: '평균 출장 사용률',
                image: chart2,
                stats: 80,
                change: 7,
              }"
            />
          </VCol>
        </VRow>
        <VRow>
          <!-- 👉 Profit -->
          <VCol cols="12" md="6" sm="6">
            <CardStatisticsVertical
              v-bind="{
                title: '평균 외근 사용률',
                image: chart2,
                stats: 90,
                change: -4,
              }"
            />
          </VCol>

          <!-- 👉 Sales -->
          <VCol cols="12" md="6" sm="6">
            <CardStatisticsVertical
              v-bind="{
                title: '나의 잔여 휴가',
                image: wallet,
                stats: remainVacation,
              }"
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CalendarCard from '@/components/calendar/CalendarCard.vue'
import AttendanceApexChart from '@/components/apexchart/AttendanceApexChart.vue'
import RemainSeat from '@/components/RemainSeat.vue'
import CardStatisticsVertical from '@/@core/components/cards/CardStatisticsVertical.vue'

// 👉 Images
import chart1 from '@images/cards/chart-success.png'
import chart2 from '@images/cards/chart-info.png'
import wallet from '@images/cards/wallet-primary.png'

import { onMounted, ref, watch } from 'vue'
// api
import api from '@/api/axios.js'
import { useAuthStore } from '@/stores/useAuthStore.js'

// util
import { removeDecimal } from '@/util/util.js'

const authStore = useAuthStore()
const userNo = ref(authStore.userNo || null)
const userId = ref(authStore.userId || null)

const chartParams = ref({
  text: '총 근무 시간',
  percent: 50,
  totalTime: 40,
  currentTime: 20,
})

const vacationParams = ref({})
const businessTripParams = ref({})
const outOnBusinessParams = ref({})

const remainVacation = ref()

const fetchAttendanceChartData = async () => {
  try {
    const response = await api.get(`/attendance/weektotalpercent/${userNo.value}`)
    console.log('[SUCCESS] fetchAttendanceChartData response:', response)

    chartParams.value.percent = removeDecimal(response.data.data.formattedPercent)
    chartParams.value.currentTime = response.data.data.totalWorkHours
  } catch (error) {
    console.error('[ERROR] fetchAttendanceChartData error:', error)
  }
}

const fetchVacationData = async () => {
  try {
    const response = await api.get(`/attendance/vacation-percentage`)
    console.log('[SUCCESS] fetchVacationData response:', response)

    vacationParams.value = {
      ...response.data.data,
    }
  } catch (error) {
    console.error('[ERROR] fetchVacationData error:', error)
  }
}

const fetchBusinessTripData = async () => {
  try {
    const response = await api.get(`/attendance/business-trip-percentage`)
    console.log('[SUCCESS] fetchBusinessTripData response:', response)

    businessTripParams.value = response.data.data
  } catch (error) {
    console.error('[ERROR] fetchBusinessTripData error:', error)
  }
}

const fetchOutOnBusinessData = async () => {
  try {
    const response = await api.get(`/attendance/out-on-business-percentage`)
    console.log('[SUCCESS] fetchOutOnBusinessData response:', response)

    outOnBusinessParams.value = response.data.data
  } catch (error) {
    console.error('[ERROR] fetchOutOnBusinessData error:', error)
  }
}

const fetchRemainVacationData = async () => {
  try {
    const response = await api.get(`/user/remain-vacation/${userId.value}`)
    console.log('[SUCCESS] fetchRemainVacationData response:', response)

    remainVacation.value = response.data.data.userRemainVacation
  } catch (error) {
    console.error('[ERROR] fetchRemainVacationData error:', error)
  }
}

watch(
  userNo,
  async newUserNo => {
    if (newUserNo) {
      await fetchAttendanceChartData()
    }
  },
  { immediate: true },
)

onMounted(() => {
  fetchRemainVacationData()
})
</script>

<style lang="scss">
.card-container {
  padding: 10px;
  height: 420px;
}
</style>
