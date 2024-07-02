<template>
  <VCard elevation="10">
    <VCardTitle class="mt-5">잔여 좌석 확인</VCardTitle>
    <VCardText>
      <VRow class="mt-5 mb-5">
        <VCol>
          <VCombobox
            v-model="seatOffice"
            :items="['잠실오피스', '마포오피스', '성북오피스']"
            class="ml-auto"
            label="조회할 오피스를 고르세요."
          />
        </VCol>
      </VRow>
      <VList bg-color="transparent" class="d-flex flex-column-reverse mb-4" density="compact">
        <VListItem v-for="(floor, index) in floors" :key="index" class="mb-2">
          <VProgressLinear
            :class="`floor-${index}`"
            :color="colors[index]"
            :model-value="calculatePercentage(floor.cntNum, floor.totalNum)"
            class="mx-n5"
            height="20"
          />
          <template v-slot:prepend>
            <span class="mr-5" style="width: 20px">{{ floor.floor }}</span>
          </template>
          <template v-slot:append>
            <div class="rating-values">
              <span class="d-flex justify-end"> {{ floor.cntNum }} </span>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from '@/api/axios'

const seatOffice = ref('잠실오피스')
const remainSeat = ref([])
const floors = ref([
  { floor: 'L', totalNum: 27, cntNum: 0 },
  { floor: '1F', totalNum: 29, cntNum: 0 },
  { floor: '2F', totalNum: 28, cntNum: 0 },
  { floor: '3F', totalNum: 26, cntNum: 0 },
])
const colors = ['primary', 'success', 'info', 'warning', 'error']

const countSeatNumber = () => {
  floors.value.forEach(floor => (floor.cntNum = 0))

  for (const seat of remainSeat.value) {
    if (seat.seatFloor === 'L') {
      floors.value[0].cntNum++
    } else if (seat.seatFloor === '1') {
      floors.value[1].cntNum++
    } else if (seat.seatFloor === '2') {
      floors.value[2].cntNum++
    } else if (seat.seatFloor === '3') {
      floors.value[3].cntNum++
    }
  }
}

const fetchRemainSeat = async () => {
  try {
    const response = await axios.get(`/seat/office/${setToOfficeRegion()}`)
    console.log('[SUCCESS] fetchRemainSeat response:', response.data.data)

    remainSeat.value = response.data.data
    countSeatNumber()
  } catch (error) {
    console.log('[FAIL] fetchRemainSeat error:', error.response.data.message)
  }
}

const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return 100 - (value / total) * 100
}

const setToOfficeRegion = () => {
  return seatOffice.value.substring(0, 2)
}

onMounted(() => {
  fetchRemainSeat()
})

watch(seatOffice, () => {
  fetchRemainSeat()
})
</script>
<style lang="scss" scoped></style>
