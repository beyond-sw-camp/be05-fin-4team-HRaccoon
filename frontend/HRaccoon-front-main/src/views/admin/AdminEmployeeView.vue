<template>
  <div>
    <h1>| 직원 정보 상세</h1>
    <VCard class="mb-4">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VImg :src="params.userImageUrl" style="max-height: 420px" />
          </VCol>
          <VCol cols="12" md="8">
            <v-row>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userName" :readonly="!isEditable" class="custom-text-field" label="이름" />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userId" class="custom-text-field" label="사번" readonly />
              </VCol>
            </v-row>
            <v-row>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userBirth" class="custom-text-field" label="생년월일" readonly />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="params.userGender" class="custom-text-field" label="성별" readonly />
              </VCol>
            </v-row>
            <v-row>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userDepartmentName"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="소속 부서"
                />
              </VCol>
              <VCol cols="12" md="6">
                <v-text-field
                  v-model="params.userTeamName"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="소속 팀"
                />
              </VCol>
            </v-row>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userRankName"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="직위"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userPositionName"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="직책"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userMobile"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="연락처"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userEmail"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="이메일"
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model="params.userJoinDate" class="custom-text-field" label="입사일" readonly />
          </VCol>
          <VCol cols="12" md="6">
            <VTextField v-model="params.userLeavingDate" class="custom-text-field" label="퇴사일" readonly />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="8">
            <VTextField v-model="params.userAddress" :readonly="!isEditable" class="custom-text-field" label="주소" />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField v-model="params.userRole" class="custom-text-field" label="권한" readonly />
          </VCol>
        </VRow>
        <VRow v-if="isEditable">
          <VCol>
            <VFileInput
              v-model="tempImg"
              :show-size="1000"
              color="primary"
              counter
              label="수정할 직원 사진"
              placeholder="수정할 직원 사진을 등록해주세요."
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
          <VBtn v-if="!isEditable" class="ml-auto mr-5" color="primary" size="large" @click="onHandleUserBtn">
            수정하기
          </VBtn>
          <TwoButtonDialog
            v-else
            :rightBtnAction="onHandleUserBtn"
            button-name="수정 완료"
            button-size="large"
            class="ml-auto mr-5"
            content="정말로 직원 정보를 수정하시겠습니까?"
            icon="mdi-user-register"
            rightBtnName="수정"
            title="직원 정보 수정 확인"
          />
          <InputDialog
            v-if="!params.userDeleteYn"
            :rightBtnAction="fetchUserDelete"
            button-name="삭제하기"
            description="*작성 시, 직원 퇴사 사유에 반영됩니다."
            inputLabel="퇴사 사유"
            right-btn-name="삭제"
            title="직원 퇴사 확인"
          />
        </VRow>

        <VRow>
          <TwoInputDialog
            :rightBtnAction="onHandleUserPasswordBtn"
            button-name="비밀번호 수정하기"
            class="ml-auto mt-3"
            right-btn-name="수정"
            title="직원 비밀번호 수정"
          />
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardTitle>개인 역량</VCardTitle>
      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12">
              <VChipGroup>
                <VChip v-for="(ability, index) in userAbilities" :key="index">
                  {{ ability }}
                </VChip>
              </VChipGroup>
            </VCol>
          </VRow>
        </VForm>
        <VRow>
          <VBtn
            class="ml-auto"
            size="large"
            variant="tonal"
            @click="
              () => {
                router.go(-1)
              }
            "
            >뒤로 가기
          </VBtn>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'
import InputDialog from '@/components/dialog/InputDialog.vue'
import TwoInputDialog from '@/components/dialog/TwoInputDialog.vue'
import { VCardTitle } from 'vuetify/lib/components/index.mjs'
import { useToast } from 'vue-toastification'

// api
import api from '@/api/axios.js'

// store
import { useCodeStore } from '@/stores/useCodeStore.js'

//constants
import { DEPATMENT_LIST, POSITION_LIST, RANK_LIST, TEAM_LIST, userConstant } from '@/util/constants/userConstant.js'
import { loginConstant } from '@/util/constants/loginConstant.js'

// util
import { validateEmail, validatePassword, validatePhoneNumber } from '@/util/util.js'
import { S3uploadImage } from '@/plugins/aws/s3.js'

const toast = useToast()

const { NOT_VALID_PHONE, NOT_VALID_EMAIL, NOT_VALID_ADDRESS } = userConstant

const departmentList = DEPATMENT_LIST
const teamList = TEAM_LIST
const rankList = RANK_LIST
const positionList = POSITION_LIST

const router = useRouter()
const route = useRoute()
const store = useCodeStore()

const params = ref({})
const userId = ref(route.params.userId)
const userAbilities = ref([])

const tempImg = ref(null)
const tempImgName = ref({
  name: '',
})

const isEditable = ref(false)

const fetchUserInfo = async () => {
  try {
    const response = await api.get(`/admin/info/${userId.value}`)
    console.log('[SUCCESS] fetchUserInfo response:', response.data)

    params.value = {
      ...response.data.data,
      userBirth: dayjs(response.data.data.userBirth).format('YYYY년 MM월 DD일'),
      userJoinDate: response.data.data.userJoinDate
        ? dayjs(response.data.data.userJoinDate).format('YYYY년 MM월 DD일')
        : '',
      userLeavingDate: response.data.data.userLeavingDate
        ? dayjs(response.data.data.userLeavingDate).format('YYYY년 MM월 DD일')
        : '',
      userGender: response.data.data.userGender === 'MALE' ? '남자' : '여자',
      userDepartmentName: store.getCodeName(response.data.data.userDepartment),
      userTeamName: store.getCodeName(response.data.data.userTeam),
      userPositionName: store.getCodeName(response.data.data.userPosition),
      userRankName: store.getCodeName(response.data.data.userRank),
    }
  } catch (error) {
    console.error('[ERROR] fetchUserInfo error:', error.response)
  }
}

const fetchUserAbilities = async () => {
  try {
    const response = await api.get(`/user/ability/${userId.value}`)
    console.log('[SUCCESS] fetchUserAbilities response:', response.data)

    const abilities = response.data.data
    userAbilities.value = abilities.map(ability => ability.abilityName)
  } catch (error) {
    console.error('[ERROR] fetchUserAbilities error:', error.response)
  }
}

const fetchUserDelete = async content => {
  if (!content) {
    toast.error('퇴사사유를 입력해주세요.')
    return
  }
  const deleteInfo = {
    userId: userId.value,
    userDeleteReason: content,
  }
  try {
    const response = await api.post(`/admin/delete`, deleteInfo)
    console.log('[SUCCESS] fetchUserDelete response:', response.data)
    toast.success('해당 직원이 삭제되었습니다.')
    router.go(-1)
  } catch (error) {
    console.error('[ERROR] fetchUserDelete error:', error.response)
    toast.error(error.response.data.message)
  }
}

const fetchUpdateUserInfo = async () => {
  try {
    const response = await api.post('/admin/update', {
      userId: params.value.userId,
      userName: params.value.userName,
      userMobile: params.value.userMobile,
      userAddress: params.value.userAddress,
      userEmail: params.value.userEmail,
      userDepartment: params.value.userDepartmentName,
      userPosition: params.value.userPositionName,
      userTeam: params.value.userTeamName,
      userRank: params.value.userRankName,
      userRole: setUserRole(params.value.userTeamName),
      userImageUrl: params.value.userImageUrl,
    })
    console.log('[SUCCESS] fetchUpdateUserInfo response:', response.data)

    if (isEditable.value) {
      isEditable.value = !isEditable.value
    }

    toast.success('해당 직원의 정보가 수정되었습니다.')
    await fetchUserInfo()
  } catch (error) {
    console.error('[ERROR] fetchUpdateUserInfo error:', error.response)
    toast.error(error.response.data.message)
  }
}

const fetchUpdateUserPassword = async (topContent, bottomContent) => {
  try {
    const response = await api.post(`/admin/${userId.value}/change-password`, {
      userId: userId.value,
      newPassword: topContent,
      confirmPassword: bottomContent,
    })
    console.log('[SUCCESS] fetchUpdateUserPassword response:', response.data)

    toast.success('해당 직원의 비밀번호가 수정되었습니다.')
  } catch (error) {
    console.error('[ERROR] fetchUpdateUserPassword error:', error.response)
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

  if (params.value.userAddress.length < 1) {
    return NOT_VALID_ADDRESS
  }

  if (!departmentList.includes(params.value.userDepartmentName)) {
    return '해당 부서는 존재하지 않습니다. 다시 입력해주세요.'
  }

  if (!teamList.includes(params.value.userTeamName)) {
    return '해당 팀은 존재하지 않습니다. 다시 입력해주세요.'
  }

  if (!rankList.includes(params.value.userRankName)) {
    return '해당 직책은 존재하지 않습니다. 다시 입력해주세요.'
  }

  if (!positionList.includes(params.value.userPositionName)) {
    return '해당 직위 존재하지 않습니다. 다시 입력해주세요.'
  }
}

const onHandleUserBtn = () => {
  const values = Object.values(params.value)
  const hasNull = values.some(value => value === null)
  if (isEditable.value) {
    if (hasNull) {
      toast.error('모든 항목을 입력해주세요.')
      return
    }
    if (validateUserInfo()) {
      toast.error(validateUserInfo())
      return
    }
    fetchUpdateUserInfo()
  } else {
    isEditable.value = !isEditable.value
  }
}

const onHandleUserPasswordBtn = (topContent, bottomContent) => {
  if (!validatePassword(topContent)) {
    toast.error(loginConstant.AUTH_PASSWORD_REGEX)
    return
  }
  if (topContent === bottomContent) {
    fetchUpdateUserPassword(topContent, bottomContent)
  } else {
    toast.error('비밀번호가 일치하지 않습니다.')
  }
}

const setUserRole = team => {
  if (team === '인사지원팀') {
    return 'ADMIN'
  } else {
    return 'USER'
  }
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

onMounted(() => {
  fetchUserInfo()
  fetchUserAbilities()
})
</script>

<style scoped></style>
