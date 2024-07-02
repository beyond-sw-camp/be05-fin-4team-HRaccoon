<template>
  <VCard class="card-container">
    <h2 class="mb-2">근무 시간</h2>
    <VCardText>
      <VCol v-for="data in datas" :key="data.name" class="d-flex flex-col justify-space-between col-class">
        <span>{{ data.attendanceDay }}</span>
        <span>{{
          data.attendanceStatus === 'proxy'
            ? '미출근'
            : data.attendanceStatus !== '퇴근'
              ? data.attendanceStatus
              : data.attendanceTotalTime
        }}</span>
      </VCol>
    </VCardText>
  </VCard>
</template>

<script setup>
const props = defineProps({
  datas: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
}

.col-class {
  font-size: large;
  background-color: var(--v-theme-background);
  color: var(--v-theme-on-background);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.col-class:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.v-theme--light .col-class {
  background-color: var(--v-theme-background);
  color: var(--v-theme-on-background);

  span:last-child {
    color: var(--v-theme-secondary);
  }
}

.v-theme--dark .col-class {
  background-color: var(--v-theme-background);
  color: var(--v-theme-on-background);

  span:last-child {
    color: var(--v-theme-secondary);
  }
}

.col-class span:first-child {
  font-weight: bold;
}
</style>
