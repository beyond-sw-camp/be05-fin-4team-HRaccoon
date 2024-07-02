<template>
  <h1>| 좌석 배치도</h1>

  <v-row>
    <!-- 좌석 배치도 -->
    <v-col cols="8">
      <v-col v-if="seatLayouts[seatOffice] && seatLayouts[seatOffice][convertFloor(floor)]">
        <v-row
          v-for="(row, rowIndex) in getRowLayout(seatLayouts[seatOffice][convertFloor(floor)], convertFloor(floor))"
          :key="`${seatOffice}_${convertFloor(floor)}_row_${rowIndex}`"
        >
          <v-col
            v-for="(seat, colIndex) in row"
            :key="`${seatOffice}_${convertFloor(floor)}_seat_${rowIndex}_${colIndex}`"
          >
            <v-card
              v-if="seat"
              class="seat"
              :class="{
                checked: checked.includes(seat.seatLocation),
                selected: selected.includes(seat.seatLocation),
              }"
              @click="handleSeatClick(seat)"
              outlined
              flat
              elevation="2"
              v-tooltip.top="`사용자: ${seat.userId || '정보 없음'}`"
            >
              <v-card-text class="seat-text">
                {{ removeLeadingZeros(seat.seatNum) }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-col>

    <!-- 오피스 선택 및 층 선택 -->
    <v-col>
      <v-select v-model="selectedOfficeName" :items="officeNames" label="오피스를 선택해주세요"></v-select>
      <v-btn-toggle v-model="floor" mandatory class="mt-4">
        <v-btn value="LOBBY">Lobby</v-btn>
        <v-btn value="1F">1F</v-btn>
        <v-btn value="2F">2F</v-btn>
        <v-btn value="3F">3F</v-btn>
      </v-btn-toggle>
      <div class="legend mt-4">
        <div class="tips" v-show="showTips">
          <div><span class="checked seat seatTip"></span> : 다른 사원이 사용 중인 좌석</div>
          <div><span class="selected seat seatTip"></span> : 본인이 사용 중인 좌석</div>
          <div><span class="available seat seatTip"></span> : 사용 가능한 좌석</div>
          <!-- 새로고침 버튼 -->
          <v-btn icon @click="fetchSeatData">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- 공지사항 -->
      <v-card class="notice-card mt-6" outlined elevation="1">
        <v-card-title class="d-flex justify-space-between">
          <span>공지사항</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(notice, index) in notices" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ notice.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ notice.date }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ notice.content }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- 사용자 정보 및 통계 패널 -->
      <v-card class="user-info-panel mt-4" outlined elevation="1">
        <v-card-title>내 정보</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p>이름: {{ authStore.userName }}</p>
          <p>사번: {{ authStore.userId }}</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- 사원 정보 모달 -->
  <v-dialog v-model="showEmployeeModal" max-width="600px">
    <v-card>
      <v-card-title>
        <v-icon class="me-2">mdi-account</v-icon>
        사원 정보
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-img src="src/assets/employee.jpg" class="custom-avatar" alt="Avatar"></v-img>
          </v-col>
          <v-col cols="8">
            <p>이름: {{ employeeInfo.userName }}</p>
            <p>사번: {{ employeeInfo.userId }}</p>
            <p>부서: {{ employeeInfo.userTeam }}</p>
            <p>직책: {{ employeeInfo.userPosition }}</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="closeModal">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 좌석 선택 확인 모달 -->
  <v-dialog v-model="showConfirmModal" max-width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="me-2">mdi-check</v-icon>
        좌석 선택
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-center">{{ confirmMessage }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="fetchConfirmSelection">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 좌석 취소 확인 모달 -->
  <v-dialog v-model="showCancelModal" max-width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="me-2">mdi-close</v-icon>
        좌석 취소
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-center">{{ cancelMessage }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="fetchCancelSelection">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 알림 모달 -->
  <v-dialog v-model="showAlertModal" max-width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="me-2">mdi-alert</v-icon>
        좌석 선택
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-center">{{ alertMessage }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="closeAlertModal">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 좌석 선택 중복 경고 모달 -->
  <v-dialog v-model="showDuplicateSelectionModal" max-width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="me-2">mdi-alert</v-icon>
        좌석 선택 중복 경고
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="text-center">
        이미 선택중인 좌석이 있습니다. 취소 후 새로운 좌석을 선택해주세요.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn class="ms-auto" text @click="closeDuplicateSelectionModal">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCodeStore } from '/src/stores/useCodeStore.js'
import { useAuthStore } from '/src/stores/useAuthStore.js'
import { useSeatStore } from '/src/stores/useSeatStore.js'
import '/src/styles/styles.scss'
import api from '/src/api/axios.js'

// 스토어 인스턴스 초기화
const codeStore = useCodeStore()
const authStore = useAuthStore()
const seatStore = useSeatStore()

// 사용자 정보와 선택된 좌석 정보
const userNo = ref(authStore.userNo)
const selected = ref([])

// 초기 오피스 및 층 설정
const seatOffice = ref('OJS01')
const floor = ref('LOBBY')

// 오피스 목록과 선택된 오피스 이름
const offices = ref(['OJS01', 'OMP02', 'OSB03'])
const officeNames = computed(() => offices.value.map(office => codeStore.getCodeName(office)))
const selectedOfficeName = ref(codeStore.getCodeName(seatOffice.value))

// 좌석 레이아웃과 상태 정보
const seatLayouts = ref([])
const checked = ref([])
const seatUserInfo = ref()

// UI 상태 관련 변수들
const showTips = ref(true)
const showEmployeeModal = ref(false)
const showConfirmModal = ref(false)
const showCancelModal = ref(false)
const showAlertModal = ref(false)
const showDuplicateSelectionModal = ref(false)

// 직원 정보와 메시지
const employeeInfo = ref({})
const confirmMessage = ref('')
const cancelMessage = ref('')
const confirmAction = ref(null)
const alertMessage = ref('')

// 좌석 정보
const seatLocation = ref(null)
const seatNo = ref(null)
const seatNum = ref(null)

// 공지사항 데이터
const notices = ref([
  {
    title: '1인용 좌석 안내',
    content: '2F 2~7번, 12~17번, 22~27번 좌석은 1인용 좌석입니다.',
  },
  {
    title: '창가 좌석 안내',
    content: 'Lobby 1~6번 좌석과 1F, 3F 1~4번 좌석과 2F 1~7번 좌석은 창가자리입니다.',
  },
  {
    title: '좌석 초기화',
    content: '모든 좌석은 00시가 되면 초기화 됩니다. 좌석 취소를 꼭 해주시길 바랍니다.',
  },
  {
    title: '사무실 온도 조절 안내',
    date: '2024-05 ~ 2024-08',
    content: '무더운 여름철, 사무실의 냉방 온도를 항상 24도로 설정해 주시기 바랍니다.',
  },
])

// 층 정보를 변환하는 함수
const convertFloor = floor => {
  switch (floor) {
    case 'LOBBY':
      return 'L'
    case '1F':
      return '1'
    case '2F':
      return '2'
    case '3F':
      return '3'
    default:
      return floor
  }
}

// 좌석 선택이 불가능한지 확인하는 함수
const isSeatSelectionDisabled = seatLocation => {
  return checked.value.includes(seatLocation)
}

// 좌석 번호의 앞부분 0을 제거하는 함수
const removeLeadingZeros = seatNum => {
  return seatNum.replace(/^0+/, '')
}

// 좌석 클릭 핸들러
const handleSeatClick = async seat => {
  seatLocation.value = seat.seatLocation
  seatNo.value = seat.seatStatusNo
  seatNum.value = seat.seatNum

  // 다른 사람이 사용 중인 좌석인 경우 사용자 정보 보여주기
  if (checked.value.includes(seatLocation.value) && !selected.value.includes(seatLocation.value)) {
    const userInfo = await fetchUserInfo(seatLocation.value)
    if (userInfo) {
      employeeInfo.value = userInfo
      showEmployeeModal.value = true
    } else {
      showAlert('직원 정보를 가져올 수 없습니다.')
    }
    return
  }

  // 사용자가 자신의 좌석을 클릭한 경우 선택 취소 모달 보여주기
  if (selected.value.includes(seatLocation.value)) {
    cancelMessage.value = `좌석 ${removeLeadingZeros(seatNum.value)}번을 취소하시겠습니까?`
    showCancelModal.value = true
    return
  }

  // 새로운 좌석을 선택하는 경우 기존 선택된 좌석이 있는지 확인
  if (selected.value.length > 0) {
    showDuplicateSelectionModal.value = true
    return
  }

  // 새로운 좌석을 선택하는 경우 확인 모달 보여주기
  confirmMessage.value = `좌석 ${removeLeadingZeros(seatNum.value)}번을 선택하시겠습니까?`
  showConfirmModal.value = true
}

// 좌석 선택 API 호출 함수
const fetchConfirmSelection = async () => {
  closeConfirmModal()
  try {
    const response = await api.post(`/seat/available-seats/${seatOffice.value}/select/${seatNo.value}/${userNo.value}`)

    if (response.data && response.data.status === 'success') {
      selected.value.push(seatLocation.value)
      seatStore.selectSeat(userNo.value, seatLocation.value)
      showAlert(`좌석 ${removeLeadingZeros(seatNum.value)}번이 성공적으로 선택되었습니다.`)
      fetchSeatData()
    } else {
      showAlert(response.data.message)
    }
  } catch (error) {
    console.error('Error selecting seat:', error)
    showAlert('좌석 선택 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 좌석 취소 API 호출 함수
const fetchCancelSelection = async () => {
  closeCancelModal()
  try {
    const response = await api.post(`/seat/available-seats/${seatOffice.value}/cancel/${seatNo.value}/${userNo.value}`)

    if (response.data && response.data.status === 'success') {
      selected.value = selected.value.filter(seat => seat !== seatLocation.value)
      seatStore.cancelSeat(userNo.value)
      showAlert(`좌석 ${removeLeadingZeros(seatNum.value)}번이 성공적으로 취소되었습니다.`)
      fetchSeatData()
    } else {
      showAlert(response.data.message)
    }
  } catch (error) {
    console.error('Error canceling seat:', error)
    showAlert('좌석 취소 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 사용자 정보 API 호출 함수
const fetchUserInfo = async seatLocation => {
  try {
    const response = await api.get(`/seat/user/info/${seatLocation}`)
    if (response.data && response.data.status === 'success') {
      const userData = response.data.data
      userData.userTeam = codeStore.getCodeName(userData.userTeam)
      userData.userPosition = codeStore.getCodeName(userData.userPosition)
      return userData
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

// 좌석 데이터 불러오기 함수
const fetchSeatData = async () => {
  try {
    const convertedFloor = convertFloor(floor.value)
    const response = await api.get(`/seat/office/${seatOffice.value}/${convertedFloor}`)

    if (response.data && response.data.status === 'success') {
      const seatData = response.data.data
      const currentUserId = authStore.userId

      checked.value = seatData
        .filter(seat => seat.seatStatusYn && seat.userId !== currentUserId)
        .map(seat => seat.seatLocation)
      selected.value = seatData
        .filter(seat => seat.seatStatusYn && seat.userId === currentUserId)
        .map(seat => seat.seatLocation)
      seatUserInfo.value = seatData.reduce((acc, seat) => {
        acc[seat.seatLocation] = seat.userInfo
        return acc
      }, {})

      updateSeatLayouts(seatOffice.value, convertedFloor, seatData)
    } else {
      resetSeatData(seatOffice.value, convertedFloor)
    }
  } catch (error) {
    console.error('Error fetching seat data:', error)
  }
}

// 좌석 레이아웃 업데이트 함수
const updateSeatLayouts = (office, floor, data) => {
  seatLayouts.value = {
    ...seatLayouts.value,
    [office]: {
      ...seatLayouts.value[office],
      [floor]: data,
    },
  }
}

// 좌석 데이터 초기화 함수
const resetSeatData = (office, floor) => {
  checked.value = []
  selected.value = []
  seatUserInfo.value = {}
  updateSeatLayouts(office, floor, [])
}

// 층별 좌석 배열을 가져오는 함수
const getRowLayout = (layout, floor) => {
  const rowLayout = []
  let currentRow = []

  const rules = {
    L: [6, 2, 2],
    1: [4, 4, 2],
    2: [7, 1, 1],
    3: [4, 4, 2],
  }

  const getRuleIndex = (index, floor) => {
    if (floor === 'L') {
      if (index % 10 < 6) return 0
      if (index % 10 < 8) return 1
      return 2
    } else if (floor === '1' || floor === '3') {
      if (index % 10 < 4) return 0
      if (index % 10 < 8) return 1
      return 2
    } else if (floor === '2') {
      if (index % 10 < 7) return 0
      if (index % 10 < 9) return 1
      return 2
    }
  }

  layout.forEach((seat, index) => {
    const ruleIndex = getRuleIndex(index, floor)
    currentRow.push(seat)
    if (currentRow.length === rules[floor][ruleIndex]) {
      rowLayout.push(currentRow)
      currentRow = []
    }
  })

  if (currentRow.length > 0) {
    rowLayout.push(currentRow)
  }

  return rowLayout
}

// 모달 닫기 함수들
const closeModal = () => {
  showEmployeeModal.value = false
  employeeInfo.value = {}
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmMessage.value = ''
  confirmAction.value = null
}

const closeCancelModal = () => {
  showCancelModal.value = false
  cancelMessage.value = ''
}

// 알림 표시 함수
const showAlert = message => {
  alertMessage.value = message
  showAlertModal.value = true
}

// 알림 모달 닫기 함수
const closeAlertModal = () => {
  showAlertModal.value = false
  alertMessage.value = ''
}

// 중복 선택 모달 닫기 함수
const closeDuplicateSelectionModal = () => {
  showDuplicateSelectionModal.value = false
}

// 컴포넌트가 마운트될 때 실행되는 함수
onMounted(() => {
  fetchSeatData()
  const selectedSeat = seatStore.getSelectedSeat(userNo.value)
  if (selectedSeat) {
    selected.value = [selectedSeat]
  }
})

// 오피스와 층 정보가 변경될 때마다 좌석 데이터를 다시 불러오는 함수들
watch(seatOffice, fetchSeatData)
watch(floor, fetchSeatData)
watch(selectedOfficeName, newName => {
  seatOffice.value = Object.keys(codeStore.codeToNameMap).find(key => codeStore.codeToNameMap[key] === newName)
})
</script>

<style scoped></style>
