<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-code="404"
      error-description="요청하신 페이지를 찾을 수 없습니다."
      error-title="Page Not Found ⚠️"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <Vue3Lottie
        :animation-data="animationData"
        :autoplay="true"
        :loop="true"
        :style="{ maxWidth: '500px', height: 'auto' }"
      />
      <VBtn class="mt-10" size="large" @click="goBack"> 이전 페이지로 돌아가기</VBtn>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import ErrorHeader from '@/components/ErrorHeader.vue'
import animationData from '@assets/json/404.json'

const router = useRouter()

const animationDataRef = ref(null)
const error = ref(null)

onMounted(() => {
  try {
    animationDataRef.value = animationData
  } catch (err) {
    error.value = err
    console.error('애니메이션 데이터를 로드하는 중 오류가 발생했습니다:', err)
  }
})

const goBack = () => {
  router.back()
}
</script>

<style lang="scss">
.misc-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  min-block-size: calc(var(--vh, 1vh) * 100);
}
</style>
