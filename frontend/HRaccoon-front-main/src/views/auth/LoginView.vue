<template>
  <div class="container">
    <Vue3Lottie :animation-data="animationData" :autoplay="true" :loop="true" class="lottie-background" />
    <div class="auth-wrapper">
      <VCard class="auth-card pa-4 pt-7" max-width="448">
        <VCardItem class="justify-center">
          <VImg :src="'src/assets/images/hraccoon_primary.png'" class="photo" />
          <VCardTitle class="text-4xl font-weight-bold title">HRaccoon</VCardTitle>
        </VCardItem>

        <VCardText class="pt-2 d-flex flex-column align-center justify-center">
          <h5 class="text-h5 mb-1">Welcome to HRaccoon! 👋🏻</h5>
          <p class="mb-0 text-center">
            안녕하세요 인사관리 프로그램 <br />
            HRaccoon입니다. <br />로그인을 진행해주세요.
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onHandleSubmit">
            <VRow>
              <!-- userId -->
              <VCol cols="12">
                <VTextField
                  v-model="form.userId"
                  autofocus
                  label="사번"
                  placeholder="사번을 입력하세요."
                  type="userId"
                />
              </VCol>

              <!-- userPassword -->
              <VCol cols="12">
                <VTextField
                  v-model="form.userPassword"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  label="비밀번호"
                  placeholder="············"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center justify-space-between flex-wrap mt-4 mb-4" />

                <!-- login button -->
                <VBtn block type="submit">Login</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// store
import { useAuthStore } from '@/stores/useAuthStore.js'

// components
import { useToast } from 'vue-toastification'

// constants
import { loginConstant } from '@/util/constants/loginConstant.js'
import animationData from '@/assets/json/landing.json'
import { Vue3Lottie } from 'vue3-lottie'

const { fetchSignIn, fetchUserName } = useAuthStore()
const router = useRouter()
const toast = useToast()

const isPasswordVisible = ref(false)
const animationDataRef = ref(null)
const form = ref({
  userId: '',
  userPassword: '',
})

const { AUTH_SUCCESS, AUTH_ID_REGEX, AUTH_PASSWORD_REGEX, AUTH_NOT_MATCH } = loginConstant

const onHandleSubmit = async () => {
  const validationError = validateForm()
  if (validationError) {
    toast.error(validationError)
    return
  }
  try {
    await fetchSignIn(form.value)

    toast.success(AUTH_SUCCESS)
    await fetchUserName()
    await router.push('/home')
  } catch (error) {
    console.log(error)
    toast.error(AUTH_NOT_MATCH)
  }
}

const validateForm = () => {
  const idError = validationId(form.value.userId)
  const passwordError = validatePassword(form.value.userPassword)
  if (idError) {
    return idError
  }
  if (passwordError) {
    return passwordError
  }
  return null
}

const validationId = password => {
  const regex = /^A\d{6}$/
  if (!regex.test(password)) {
    return AUTH_ID_REGEX
  }
  return null
}

const validatePassword = password => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[A-Za-z\d!@#$%^&*_]{8,16}$/
  if (!passwordPattern.test(password)) {
    return AUTH_PASSWORD_REGEX
  }
  return null
}

onMounted(() => {
  try {
    animationDataRef.value = animationData
  } catch (err) {
    console.error('애니메이션 데이터를 로드하는 중 오류가 발생했습니다:', err)
  }
})
</script>
<style lang="scss">
@use '@core/scss/template/pages/page-auth.scss';

.container {
  position: relative;
  display: flex;
  height: 100dvh;
  width: 100dvw;

  .lottie-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    margin: 0;

    .lottie-animation {
      width: 100%;
      height: 100%;
    }
  }

  .auth-wrapper {
    position: relative;
    flex: 1;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .lottie-background {
    display: none;
  }
}

.title {
  color: rgb(var(--v-theme-primary));
}
</style>
