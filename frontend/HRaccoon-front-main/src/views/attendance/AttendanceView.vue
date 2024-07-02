<template>
  <h1 class="mb-2">| 근태 관리</h1>
  <VRow>
    <VCol>
      <VCard class="date-picker-card h-100">
        <VDatePicker
          v-model="selectedDate"
          :max="yesterday"
          clearable
          label="날짜"
          min="2010-01-01"
          placeholder="날짜를 선택하세요."
          readonly
          width="100%"
        />
      </VCard>
    </VCol>
    <VCol>
      <CardNavigation
        :end-time="dailyParams.endTime"
        :selected-attendance-date="dailyParams.selectedAttendanceDate"
        :start-time="dailyParams.startTime"
        class="mb-4"
      />
      <VCard>
        <VCardText>
          <AttendanceApexChart :params="monthlyChartParams" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12" md="6">
      <VCard class="h-100">
        <VCardText>
          <h2 class="mb-4">금주 근무 시간</h2>
          <VRow>
            <GraphBar
              :key="updateKey"
              :labels="defaultGraphLabels"
              :values="weekendGraphValues"
              style="width: auto; height: auto"
            />
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12" md="6">
      <WorkTimeListCard :datas="weekendParams" />
    </VCol>
  </VRow>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

// components
import WorkTimeListCard from '@/components/WorkTimeListCard.vue'
import CardNavigation from '@/components/CardNavigation.vue'
import AttendanceApexChart from '@/components/apexchart/AttendanceApexChart.vue'

// api
import api from '@/api/axios.js'
import { useAuthStore } from '@/stores/useAuthStore.js'

// util
import { formatDate, removeDecimal } from '@/util/util.js'
import GraphBar from '@/components/GraphBar.vue'

const authStore = useAuthStore()
const weekendParams = ref([
  { attendanceDay: '월', attendanceTotalTime: '8' },
  { attendanceDay: '화', attendanceTotalTime: '7' },
  { attendanceDay: '수', attendanceTotalTime: '8' },
  { attendanceDay: '목', attendanceTotalTime: '8' },
  { attendanceDay: '금', attendanceTotalTime: '8' },
])
const dailyParams = ref({
  /* 형식 확인 */
  selectedAttendanceDate: '2024-01-01',
  startTime: '2024-06-03T00:45:04',
  endTime: '2024-06-03T12:45:01',
})
const monthlyChartParams = ref({})

/* GraphBar params */
const weekendGraphValues = ref([])
const defaultGraphLabels = ref([' 월요일', '화요일', '수요일', '목요일', '금요일'])
const updateKey = ref(0)

const userNo = ref(authStore.userNo || null)

// logic variables
const selectedDate = ref(new Date(new Date().setDate(new Date().getDate() - 1)))
const yesterday = ref(new Date(new Date().setDate(new Date().getDate() - 1)))

const fetchAttendanceChartData = async () => {
  try {
    const response = await api.get(`/attendance/monthtotalpercent/${userNo.value}`)
    console.log('[SUCCESS] fetchAttendanceChartData response:', response)

    monthlyChartParams.value.percent = removeDecimal(response.data.data.formattedPercent)
    monthlyChartParams.value.currentTime = response.data.data.totalWorkHours
    monthlyChartParams.value.totalTime = response.data.data.totalHours
    monthlyChartParams.value.text = '월별 근무시간 달성률'
  } catch (error) {
    console.error('[ERROR] fetchAttendanceChartData error:', error)
  }
}

const fetchDailyAttendanceData = async paramDate => {
  try {
    const response = await api.get(`/attendance/startend/${userNo.value}/${paramDate}`)
    console.log('[SUCCESS] fetchDailyAttendanceData response:', response)

    if (response.data.data) {
      dailyParams.value.selectedAttendanceDate = response.data.data.attendanceDate
      dailyParams.value.startTime = response.data.data.attendanceStartTime
      dailyParams.value.endTime = response.data.data.attendanceEndTime
    } else {
      dailyParams.value.selectedAttendanceDate = paramDate
      dailyParams.value.startTime = ''
      dailyParams.value.endTime = ''
    }
  } catch (error) {
    console.error('[ERROR] fetchDailyAttendanceData error:', error)
  }
}

const fetchWeekendWorkTime = async () => {
  try {
    const response = await api.get(`/attendance/worktimeperdate/${userNo.value}`)
    console.log('[SUCCESS] fetchWeekendWorkTime response:', response)

    const sortedData = sortAttendanceData(response.data.data)
    const sortedDataExceptWeekend = sortedData.slice(0, -2)

    weekendParams.value = sortedDataExceptWeekend
    weekendGraphValues.value = sortedDataExceptWeekend.map(data =>
      data.attendanceTotalTime === null ? 0 : data.attendanceTotalTime,
    )
    updateKey.value++
  } catch (error) {
    console.error('[ERROR] fetchWeekendWorkTime error:', error)
  }
}

const dayOrder = ['월', '화', '수', '목', '금', '토', '일']
const sortAttendanceData = data => {
  return data.sort((a, b) => dayOrder.indexOf(a.attendanceDay) - dayOrder.indexOf(b.attendanceDay))
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

watch(selectedDate, newDate => {
  fetchDailyAttendanceData(formatDate(newDate))
})

onMounted(() => {
  fetchDailyAttendanceData(formatDate(selectedDate.value))
  fetchWeekendWorkTime()
})
</script>
<style scoped>
.date-picker-card {
  min-width: 300px;
  width: 100%;
}
</style>
