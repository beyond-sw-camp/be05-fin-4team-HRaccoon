<script setup>
import { controlledComputed } from '@vueuse/core'
import MoreBtn from '@/@core/components/MoreBtn.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  stats: {
    type: Number,
    required: true,
  },
  change: {
    type: Number,
  },
})

const isPositive = controlledComputed(
  () => props.change,
  () => Math.sign(props.change) === 1,
)

const isPercentage = () => {
  if (props.title === '나의 잔여 휴가') {
    return '개'
  } else {
    return '%'
  }
}
</script>

<template>
  <VCard class="card-container">
    <VCardText class="d-flex align-center pb-4">
      <img :src="props.image" alt="image" width="42" />

      <VSpacer />
    </VCardText>

    <VCardText>
      <p class="mb-1">
        {{ props.title }}
      </p>
      <h5 class="text-h5 text-no-wrap mb-3">{{ props.stats + isPercentage() }}</h5>
      <span
        v-if="props.change"
        :class="isPositive ? 'text-success' : 'text-error'"
        class="d-flex align-center gap-1 text-sm"
      >
        <VIcon :icon="isPositive ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'" size="18" />
        {{ isPositive ? Math.abs(props.change) : props.change }}%
      </span>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-container {
  height: 206px;
}
</style>
