<template>
  <VCard>
    <VTabs v-model="navigationTab" align-tabs="center">
      <VTab v-for="item in tabItems" :key="item" :value="item">
        {{ item }}
      </VTab>
    </VTabs>
    <VDivider />
    <VWindow v-model="navigationTab">
      <VWindowItem v-for="item in tabItems" :key="item" :value="item" class="text-center">
        <VCardItem>
          <VCardTitle>{{ formatKoreanDate(selectedAttendanceDate) }}</VCardTitle>
        </VCardItem>
        <VCardText>{{ getTabContent(item) }}</VCardText>
      </VWindowItem>
    </VWindow>
  </VCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  selectedAttendanceDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
})

const navigationTab = ref('나의 출근시간')
const tabItems = ['나의 출근시간', '나의 퇴근시간']
const tabContent = computed(() => ({
  '나의 출근시간': props.startTime
    ? '나의 출근시간은 ' + formatKoreanTime(props.startTime) + ' 입니다.'
    : '출근하지 않았습니다.',
  '나의 퇴근시간': props.endTime
    ? '나의 퇴근시간은 ' + formatKoreanTime(props.endTime) + ' 입니다.'
    : '퇴근 시간이 설정되지 않았습니다.',
}))

const getTabContent = tab => {
  return tabContent.value[tab] || '내용이 없습니다.'
}

const formatKoreanDate = dateStr => {
  return dayjs(dateStr).format('M월 D일')
}

const formatKoreanTime = dateTimeStr => {
  return dayjs(dateTimeStr).format('HH시 mm분')
}
</script>
