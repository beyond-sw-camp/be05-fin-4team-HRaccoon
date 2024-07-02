<template>
  <div>
    <h1>| 직원 등록</h1>
    <VCard class="mb-4 h-100">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VImg :src="params.userImageUrl" alt="직원 사진" />
          </VCol>
          <VCol cols="12" md="8">
            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userId" label="아이디(사번)" outlined />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userPassword" label="비밀번호" outlined />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userName" label="이름" outlined />
              </VCol>
              <VCol cols="12" md="6">
                <VDateInput v-model="params.userBirth" label="생년월일" prepend-icon="" variant="outlined"></VDateInput>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VCombobox v-model="params.userGender" :items="genderList" label="성별" variant="outlined"></VCombobox>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userAddress" label="주소" outlined />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userMobile" label="전화번호" outlined />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userEmail" label="이메일" outlined />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VCombobox
                  v-model="params.userDepartment"
                  :items="departmentList"
                  label="소속 부서"
                  variant="outlined"
                ></VCombobox>
              </VCol>
              <VCol cols="12" md="6">
                <VCombobox v-model="params.userTeam" :items="teamList" label="소속 팀" variant="outlined"></VCombobox>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VCombobox v-model="params.userRank" :items="rankList" label="직위" variant="outlined"></VCombobox>
              </VCol>
              <VCol cols="12" md="6">
                <VCombobox
                  v-model="params.userPosition"
                  :items="positionList"
                  label="직책"
                  variant="outlined"
                ></VCombobox>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VFileInput
              v-model="tempImg"
              :show-size="1000"
              color="primary"
              counter
              label="직원 사진"
              placeholder="직원 사진을 등록해주세요."
              prepend-icon="mdi-paperclip"
              variant="outlined"
            >
              <template v-slot:selection="{ file }">
                <VChip v-if="tempImgName.name" class="me-2" color="primary" label size="small">
                  {{ tempImgName.name }}
                </VChip>
              </template>
            </VFileInput>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="8" />
          <VCol cols="12" md="4">
            <VRow>
              <VSpacer />
              <VBtn color="secondary" size="large" @click="onReset">초기화</VBtn>
              <TwoButtonDialog
                :rightBtnAction="onHandleSubmit"
                button-name="등록하기"
                button-size="large"
                class="ml-4"
                content="정말로 직원 등록을 진행하시겠습니까?"
                icon="mdi-user-register"
                rightBtnName="등록"
                title="직원 등록 확인"
              />
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'
import { useToast } from 'vue-toastification'
import { VDateInput } from 'vuetify/labs/components'

// api
import api from '@/api/axios.js'
import dayjs from 'dayjs'

// util
import {
  DEPATMENT_LIST,
  GENDER,
  POSITION_LIST,
  RANK_LIST,
  TEAM_LIST,
  userConstant,
} from '@/util/constants/userConstant'
import { loginConstant } from '@/util/constants/loginConstant'
import { formatDate, getKeyByValue, validateEmail, validatePassword, validatePhoneNumber } from '@/util/util'
import { S3uploadImage } from '@/plugins/aws/s3.js'

import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const { NOT_VALID_PHONE, NOT_VALID_EMAIL, NOT_VALID_ADDRESS } = userConstant

const { AUTH_PASSWORD_REGEX } = loginConstant

const departmentList = DEPATMENT_LIST
const teamList = TEAM_LIST
const rankList = RANK_LIST
const positionList = POSITION_LIST
const genderList = ['남자', '여자']

const params = ref({
  userId: '',
  userPassword: '',
  userName: '',
  userMobile: '',
  userAddress: '',
  userBirth: null,
  userGender: '',
  userEmail: '',
  userDepartment: '',
  userPosition: '',
  userTeam: '',
  userRank: '',
  userImageUrl: '',
})
const tempImg = ref(null)
const tempImgName = ref({
  name: '',
})

const fetchUserInfo = async () => {
  const userInfo = {
    userId: params.value.userId,
    userPassword: params.value.userPassword,
    userName: params.value.userName,
    userMobile: params.value.userMobile,
    userAddress: params.value.userAddress,
    userBirth: formatDate(params.value.userBirth),
    userGender: getKeyByValue(GENDER, params.value.userGender),
    userEmail: params.value.userEmail,
    userDepartment: params.value.userDepartment,
    userPosition: params.value.userPosition,
    userTeam: params.value.userTeam,
    userRank: params.value.userRank,
    userRole: setUserRole(params.value.userTeam),
    userJoinDate: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss').toString(),
    userImageUrl: params.value.userImageUrl,
  }

  try {
    const response = await api.post(`/admin/create`, userInfo)
    console.log('[SUCCESS] fetchUserInfo response: ', response.data)

    toast.success(response.data.message)
    onReset()
    router.push(`/admin/employee/edit/${userInfo.userId}`)
  } catch (error) {
    console.error('[ERROR] fetchUserInfo error: ', error)
    toast.error(error.response.data.message)
  }
}

const validateUserInfo = () => {
  if (!validatePhoneNumber(params.value.userMobile)) {
    return NOT_VALID_PHONE
  }

  if (!validateEmail(params.value.userEmail)) {
    return NOT_VALID_EMAIL
  }

  if (!validatePassword(params.value.userPassword)) {
    return AUTH_PASSWORD_REGEX
  }

  if (params.value.userAddress.length < 1) {
    return NOT_VALID_ADDRESS
  }
}

const onHandleSubmit = async () => {
  const values = Object.values(params.value)
  const hasNull = values.some(value => value === null || value === '')

  if (hasNull) {
    toast.error('모든 항목을 입력해주세요.')
    return
  }

  if (validateUserInfo()) {
    toast.error(validateUserInfo())
    return
  }

  await fetchUserInfo()
}

const setUserRole = team => {
  if (team === '인사지원팀') {
    return 'ADMIN'
  } else {
    return 'USER'
  }
}

const onReset = () => {
  params.value.userId = ''
  params.value.userPassword = ''
  params.value.userName = ''
  params.value.userMobile = ''
  params.value.userAddress = ''
  params.value.userBirth = null
  params.value.userGender = ''
  params.value.userEmail = ''
  params.value.userDepartment = ''
  params.value.userPosition = ''
  params.value.userTeam = ''
  params.value.userRank = ''
}

watch(
  () => tempImg.value,
  async newImageUrl => {
    if (newImageUrl) {
      params.value.userImageUrl = await S3uploadImage(newImageUrl)
      tempImgName.value.name = newImageUrl.name
    }
  },
)

watch(
  () => params.value.userImageUrl,
  newImageUrl => {
    console.log('newImageUrl:', newImageUrl)
  },
)
</script>
