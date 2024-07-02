<template>
  <VCard class="pa-5">
    <VCardTitle>Team Calendar</VCardTitle>
    <VRow class="isMobile">
      <div class="py-8">
        <VCombobox
          v-model="userTeam"
          :items="teamList"
          label="조회할 팀을 고르세요."
          variant="outlined"
          width="280px"
        ></VCombobox>
      </div>
    </VRow>
    <VRow>
      <VCol cols="12" md="7">
        <div class="mb-5">
          <VueDatePickerComponent
            :markers="markers"
            @handleSelectCurrentDate="selectCurrentDate"
          ></VueDatePickerComponent>
          <!-- <VDatePicker
            v-model="selectDate"
            :min="new Date('2010-01-01')"
            placeholder="날짜를 선택하세요."
            :allowed-dates="markers"
            width="100%"
          /> -->
          <div v-if="isDateSelected(selectDate)" class="tooltip">
            <VDivider class="mb-2"></VDivider>
            <div v-for="text in getDataBySelectDate(selectDate)" :key="text.id">
              <p>{{ text }}</p>
              <VDivider class="mb-2"></VDivider>
            </div>
          </div>
        </div>
      </VCol>
      <VCol cols="12" md="5" class="calcontent">
        <VCombobox
          class="isWeb"
          v-model="userTeam"
          :items="teamList"
          label="조회할 팀을 고르세요."
          variant="outlined"
        ></VCombobox>
        <v-card variant="outlined" class="mx-auto" color="#8592A3">
          <div class="tips" v-show="showTips">
            <div>
              <div class="seat vacation"></div>
              휴가
            </div>
            <div>
              <div class="seat businesstrip"></div>
              출장
            </div>
            <div>
              <div class="seat outonbusiness"></div>
              외근
            </div>
          </div>
        </v-card>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from '@/api/axios'
import VueDatePickerComponent from '@/components/calendar/VueDatePicker.vue'

const teamList = ref([
  'IT영업팀',
  '해외영업팀',
  'IT개발팀',
  '개발지원팀',
  'IOT영업팀',
  'IOTPass영업팀',
  'IOT개발팀',
  '경영지원팀',
  '외주관리팀',
  '인사지원팀',
  '총무팀',
])
const userTeam = ref('IT영업팀')
const selectDate = ref(new Date())

const markers = ref([])
const tooltip = ref([])

const teamApprovalInfo = ref([])

const showTips = ref(true)

const getTeamApprovalInfo = async () => {
  try {
    resetMarkersAndTooltips()
    const response = await axios.get(`/user/team/${userTeam.value}`)
    console.log('get userTeam success ! ', response)
    teamApprovalInfo.value = response.data.data
    addMarkers()
  } catch (error) {
    console.log('Error get userTeam:', error)
  }
}

const resetMarkersAndTooltips = () => {
  markers.value = []
  tooltip.value = []
}

const addMarkers = () => {
  const dateMap = {}

  // 사용자 정보를 날짜별로 그룹화
  teamApprovalInfo.value.forEach(user => {
    const startDate = new Date(user.approvalDetailStartDate)
    const endDate = new Date(user.approvalDetailEndDate)
    const currentDate = new Date(startDate)

    // startDate부터 endDate까지의 모든 날짜를 포함
    while (currentDate <= endDate) {
      const dateKey = dateStr(currentDate)

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = []
      }

      dateMap[dateKey].push({
        userName: user.userName,
        approvalType: user.approvalType,
        color:
          user.approvalType === 'BUSINESS_TRIP' ? '#FF3E1D' : user.approvalType === 'VACATION' ? '#71DD37' : '#FFAB00',
        startDate: dateStr(startDate),
        endDate: dateStr(endDate),
      })

      currentDate.setUTCDate(currentDate.getUTCDate() + 1) // 다음 날짜로 이동
    }
  })

  // 날짜별로 마커 생성
  Object.entries(dateMap).forEach(([dateKey, users]) => {
    markers.value.push({
      date: new Date(dateKey),
      type: 'dot',
      color: users[0].color,
    })
    // markers.value.push(new Date(dateKey))
    users.map(user =>
      tooltip.value.push({
        date: new Date(dateKey),
        text: `${user.userName}님 ${setToApprovalType(user.approvalType)}: ${user.startDate}~${user.endDate}`,
      }),
    )
  })
}

onMounted(() => {
  getTeamApprovalInfo()
})

const getDataBySelectDate = date => {
  const res_text = []
  tooltip.value.forEach(({ date: map_date, text }) => {
    if (dateStr(date) === dateStr(map_date)) {
      res_text.push(text)
    }
  })
  return res_text
}
const isDateSelected = date => {
  return getDataBySelectDate(date).length > 0
}

const dateStr = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectCurrentDate = date => {
  selectDate.value = date
  console.log('card selectDate: ', selectDate.value)
}

const setToApprovalType = approvalType => {
  if (approvalType === 'BUSINESS_TRIP') {
    return '출장'
  } else if (approvalType === 'OUT_ON_BUSINESS') {
    return '외근'
  } else if (approvalType === 'VACATION') {
    return '휴가'
  }
}

watch(userTeam, getTeamApprovalInfo)
</script>

<style lang="scss">
.tooltip {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 10px;
}
.tips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1.5rem 0;
}
.isWeb {
  margin-top: 20px;
  margin-bottom: 50px;
}
.isMobile {
  display: none;
}
@media (max-width: 960px) {
  .isMobile {
    display: flex;
    justify-content: flex-end;
    margin-right: 8px;
  }
  .isWeb {
    display: none;
  }
}
</style>
