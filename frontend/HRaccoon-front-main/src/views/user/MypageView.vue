<template>
  <h1>| 마이페이지</h1>
  <VCard class="mb-4">
    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <VImg :src="params.userImageUrl" style="max-height: 420px" />
        </VCol>
        <VCol cols="12" md="8">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userName" class="custom-text-field" label="이름" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userId" class="custom-text-field" label="사번" readonly />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userBirth" class="custom-text-field" label="생년월일" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userGender" class="custom-text-field" label="성별" readonly />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userDepartmentName" class="custom-text-field" label="소속 부서" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <v-text-field v-model="params.userTeamName" class="custom-text-field" label="소속 팀" readonly />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userPositionName" class="custom-text-field" label="직책" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userRankName" class="custom-text-field" label="직위" readonly />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userJoinDate" class="custom-text-field" label="입사일" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userRemainVacation" class="custom-text-field" label="잔여 휴가" readonly />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VRow>
        <ThreeInputDialog
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
    <VTabs v-model="tab" fixed-tabs>
      <VTab text="개인 정보" value="tab-1"></VTab>
      <VTab text="개인 역량" value="tab-2"></VTab>
    </VTabs>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem v-for="i in 2" :key="i" :value="'tab-' + i">
        <VCardText>
          <!-- 개인정보 Tab -->
          <div v-if="i === 1">
            <VRow>
              <VCol cols="12" md="6">
                <VTextField
                  v-model="params.userMobile"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="연락처"
                  @input="formatPhoneNumber"
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
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="params.userAddress"
                  :readonly="!isEditable"
                  class="custom-text-field"
                  label="주소"
                />
              </VCol>
            </VRow>
            <VRow>
              <VBtn class="ml-auto" color="primary" size="large" @click="onHandleUserBtn">
                {{ isEditable ? '수정 완료' : '수정하기' }}
              </VBtn>
            </VRow>
          </div>

          <!-- 개인역량 Tab -->
          <div v-if="i === 2">
            <VRow>
              <VCol>
                <VChipGroup>
                  <VChip
                    v-for="(ability, index) in modifiedAbilities"
                    :key="index"
                    :closable="isEditableAbilities"
                    @click:close="isEditableAbilities && removeAbility(index)"
                  >
                    {{ ability.abilityName }}
                  </VChip>
                </VChipGroup>
              </VCol>
            </VRow>
            <VRow>
              <VSelect
                v-if="isEditableAbilities"
                v-model="newAbility"
                :items="abilities"
                :return-object="false"
                item-title="name"
                item-value="code"
                label="개인역량을 선택해주세요"
              />

              <VBtn v-if="isEditableAbilities" class="ml-8" color="primary" size="large" @click="addAbility">
                추가
              </VBtn>
            </VRow>
            <VRow class="mt-5">
              <VBtn class="ml-auto" color="primary" size="large" @click="onHandleAbilityBtn">
                {{ isEditableAbilities ? '수정완료' : '수정하기' }}
              </VBtn>
            </VRow>
          </div>
        </VCardText>
      </VTabsWindowItem>
    </VTabsWindow>
  </VCard>

  <VDialog v-model="dialog" width="500px">
    <VCard max-width="400" prepend-icon="mdi-success" title="성공">
      <VSpacer />
      <VCardText class="text-center"> 수정에 성공했습니다.</VCardText>
      <template v-slot:actions>
        <VBtn class="ms-auto" text="확인" @click="dialog = false" />
      </template>
    </VCard>
  </VDialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'
import ThreeInputDialog from '@/components/dialog/ThreeInputDialog.vue'

// api
import api from '/src/api/axios.js'

// store
import { useCodeStore } from '/src/stores/useCodeStore.js'
import { useAuthStore } from '@/stores/useAuthStore.js'

// util
import { validateEmail, validatePassword, validatePhoneNumber } from '@/util/util.js'

//constant
import { userConstant } from '@/util/constants/userConstant.js'
import { loginConstant } from '@/util/constants/loginConstant.js'

const useAuth = useAuthStore()
const store = useCodeStore()
const toast = useToast()
const {
  DUPLICATE_INFO,
  ABILITY_DUPLICATE,
  ABILITY_LIMITED,
  ABILITY_REMAIN,
  NOT_VALID_PHONE,
  NOT_VALID_EMAIL,
  NOT_VALID_ADDRESS,
} = userConstant

const userId = ref(useAuth.userId)
const params = ref({
  userAbilities: [],
})

/* 역량 목록 & 수정 관련 ref*/
const abilities = ref([])
const newAbility = ref('')
const modifiedAbilities = ref([])

/* 컴포넌트 로직 관련 ref*/
const tab = ref('tab-1')
const isEditable = ref(false)
const isEditableAbilities = ref(false)
const dialog = ref(false)

const fetchUserInfo = async () => {
  try {
    const response = await api.get(`/user/info/${userId.value}`)
    console.log('[SUCCESS] fetchUserInfo response:', response.data)

    params.value = {
      ...response.data.data,
      userBirth: dayjs(response.data.data.userBirth).format('YYYY년 MM월 DD일'),
      userJoinDate: dayjs(response.data.data.userJoinDate).format('YYYY년 MM월 DD일'),
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

    params.value.userAbilities = response.data.data
    modifiedAbilities.value = params.value.userAbilities
  } catch (error) {
    console.error('[ERROR] fetchUserInfo error:', error.response)
  }
}

const fetchAbilities = async () => {
  try {
    const response = await api.get('/code/ability')
    console.log('[SUCCESS] fetchAbilities response:', response.data.data)

    abilities.value = [...response.data.data]
  } catch (error) {
    console.error('[ERROR] fetchAbilities error:', error.response)
  }
}

const fetchUpdateUserInfo = async () => {
  try {
    const response = await api.post('/user/update', {
      userId: params.value.userId,
      userMobile: params.value.userMobile,
      userAddress: params.value.userAddress,
      userEmail: params.value.userEmail,
    })
    console.log('[SUCCESS] fetchUpdateUserInfo response:', response.data)

    if (isEditable.value) {
      isEditable.value = false
      dialog.value = true
    }
  } catch (error) {
    console.error('[ERROR] fetchUpdateUserInfo error:', error.response)
    toast.error(DUPLICATE_INFO)
  }
}

const fetchUpdateUserPassword = async (topContent, centerContent, bottomContent) => {
  try {
    const response = await api.post(`/user/${userId.value}/change-password`, {
      userId: userId.value,
      originPassword: topContent,
      newPassword: centerContent,
      confirmPassword: bottomContent,
    })
    console.log('[SUCCESS] fetchUpdateUserPassword response:', response.data)

    toast.success('해당 직원의 비밀번호가 수정되었습니다.')
  } catch (error) {
    console.error('[ERROR] fetchUpdateUserPassword error:', error.response)
    toast.error(error.response.data.message)
  }
}

const fetchUpdateUserAbilities = async () => {
  try {
    const response = await api.post(
      `/user/ability/update/${userId.value}`,
      modifiedAbilities.value.map(ability => ({
        abilityName: ability.abilityCode,
      })),
    )
    console.log('[SUCCESS] fetchUpdateUserAbilities response:', response.data)

    if (isEditableAbilities.value) {
      isEditableAbilities.value = false
      dialog.value = true
    }

    await fetchUserAbilities()
  } catch (error) {
    console.error('[ERROR] fetchUpdateUserAbilities error:', error.response)
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
}

const onHandleUserBtn = () => {
  if (isEditable.value) {
    if (validateUserInfo()) {
      toast.error(validateUserInfo())
      return
    }
    fetchUpdateUserInfo()
  } else {
    isEditable.value = true
  }
}

const onHandleUserPasswordBtn = (topContent, centerContent, bottomContent) => {
  if (!validatePassword(centerContent)) {
    toast.error(loginConstant.AUTH_PASSWORD_REGEX)
    return
  }
  if (centerContent === bottomContent) {
    fetchUpdateUserPassword(topContent, centerContent, bottomContent)
  } else {
    toast.error('비밀번호가 일치하지 않습니다.')
  }
}

const onHandleAbilityBtn = () => {
  if (isEditableAbilities.value) {
    fetchUpdateUserAbilities()
  } else {
    isEditableAbilities.value = !isEditableAbilities.value
  }
}

const removeAbility = index => {
  if (modifiedAbilities.value.length > 1) {
    modifiedAbilities.value.splice(index, 1)
  } else {
    toast.error(ABILITY_REMAIN)
  }
}

const addAbility = () => {
  if (newAbility.value && !modifiedAbilities.value.find(a => a.abilityCode === newAbility.value)) {
    if (modifiedAbilities.value.length < 8) {
      const ability = abilities.value.find(a => a.code === newAbility.value)

      if (ability) {
        const newAbilityObject = {
          abilityCode: ability.code,
          abilityName: ability.name,
        }
        modifiedAbilities.value.push(newAbilityObject)
        newAbility.value = ''
      }
    } else {
      toast.error(ABILITY_LIMITED)
    }
  } else {
    toast.error(ABILITY_DUPLICATE)
  }
}

const formatPhoneNumber = event => {
  let phoneNumber = event.target.value.replace(/\D/g, '')
  if (phoneNumber.length > 3 && phoneNumber.length <= 7) {
    phoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  } else if (phoneNumber.length > 7) {
    phoneNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`
  }
  params.value.userMobile = phoneNumber
}

watch(
  modifiedAbilities.value,
  newVal => {
    console.log('modifiedAbilities:', newVal)
  },
  { deep: true },
)
watch(
  () => isEditableAbilities.value,
  newVal => {
    console.log('isEditableAbilities:', newVal)
  },
)

onMounted(() => {
  fetchUserInfo()
  fetchUserAbilities()
  fetchAbilities()
})
</script>

<style scoped></style>
