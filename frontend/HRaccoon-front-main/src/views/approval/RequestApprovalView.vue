<template>
  <h1 class="mb-2">| 결재 상신</h1>
  <VCard>
    <VRow>
      <VCol cols="12" md="4">
        <VTextField v-model="params.userTeam" label="소속" readonly />
      </VCol>

      <!-- 사번 -->
      <VCol cols="12" md="4">
        <VTextField v-model="userId" label="사번" readonly />
      </VCol>

      <!-- 이름 -->
      <VCol cols="12" md="4">
        <VTextField v-model="params.userName" label="이름" readonly />
      </VCol>

      <!-- 유형 -->
      <VCol cols="12" md="3">
        <VSelect v-model="params.approvalType" :items="Object.values(APPROVAL_TYPE)" label="유형" />
      </VCol>

      <!-- 기간 시작 -->
      <VCol cols="12" md="3">
        <VDateInput v-model="params.approvalDetailStartDate" label="기간 시작" />
      </VCol>

      <!-- 기간 끝 -->
      <VCol cols="12" md="3">
        <VDateInput v-model="params.approvalDetailEndDate" label="기간 끝" />
      </VCol>

      <!-- 결재자 -->
      <VCol cols="12" md="3">
        <VSelect
          v-model="params.approvalAuthority"
          :items="mappedApprovers"
          item-title="title"
          item-value="value"
          label="결재자"
        />
      </VCol>

      <!-- 제목 -->
      <VCol cols="12" md="6">
        <VTextField v-model="params.title" label="제목" readonly />
      </VCol>

      <!-- 등록일자 -->
      <VCol cols="12" md="6">
        <VTextField v-model="params.approvalSubmitDate" label="등록일자" readonly />
      </VCol>

      <!-- 내용 -->
      <VCol cols="12">
        <CKEditor v-model:editorData="params.approvalDetailContent" @update:editor-data="updateEditorData" />
      </VCol>

      <VCol class="d-flex gap-4">
        <TwoButtonDialog
          :rightBtnAction="onHandleSubmit"
          buttonName="제출"
          buttonSize="large"
          content="결재를 신청하시겠습니까?"
          rightBtnName="확인"
          title="결재 신청"
        />
        <VBtn color="secondary" size="large" type="reset" variant="tonal" @click="resetParams">초기화</VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { VDateInput } from 'vuetify/labs/components'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

// components
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'

// api
import api from '@/api/axios.js'

// store
import { useAuthStore } from '@/stores/useAuthStore.js'

// util
import dayjs from 'dayjs'
import { formatLocalDateTime, getKeyByValue } from '@/util/util.js'

// constants
import { APPROVAL_TITLE, APPROVAL_TYPE } from '@/util/constants/approvalConstant.js'
import CKEditor from '@/components/ckeditor/CKEditor.vue'

const toast = useToast()
const router = useRouter()

const params = ref({
  userTeam: '',
  userName: '',
  approvalType: '',
  approvalDetailStartDate: null,
  approvalDetailEndDate: null,
  approvalAuthority: '',
  title: '',
  approvalSubmitDate: dayjs(new Date()).format('YYYY-MM-DD'),
  approvalDetailContent: '',
})
const approvers = ref([])
const userId = ref(useAuthStore().userId || '')
const userNo = ref(useAuthStore().userNo || '')

const fetchUserInfo = async () => {
  const response = await api.get(`/user/belong-info/${userId.value}`)
  console.log('[SUCCESS] fetchUserInfo response: ', response.data.data)

  params.value.userTeam = response.data.data.userTeam
  params.value.userName = response.data.data.userName
}

const fetchApprovalInfo = async () => {
  const approvalInfo = {
    userNo: userNo.value,
    approvalType: getKeyByValue(APPROVAL_TYPE, params.value.approvalType),
    approvalDetailStartDate: formatLocalDateTime(params.value.approvalDetailStartDate),
    approvalDetailEndDate: formatLocalDateTime(params.value.approvalDetailEndDate),
    selectedApprovalAuthority: params.value.approvalAuthority,
    approvalDetailContent: params.value.approvalDetailContent,
  }

  try {
    const response = await api.post(`/approval/submit/${userNo.value}`, approvalInfo)
    console.log('[SUCCESS] fetchApprovalInfo response: ', response.data)
    toast.success(response.data.message)

    fetchApprovalEmail(approvalInfo)
  } catch (error) {
    console.error('[ERROR] fetchApprovalInfo error: ', error)
    toast.error(error.response.data.message)
  }
}

const fetchApprovalAuthority = async () => {
  try {
    const response = await api.get(`/approval/approval-authority/${userNo.value}`)
    console.log('[SUCCESS] fetchApprovalAuthority response: ', response.data)

    approvers.value = response.data.data
  } catch (error) {
    console.error('[ERROR] fetchApprovalAuthority error: ', error)
    toast(error.response.data.message)
  }
}

const fetchApprovalEmail = async approvalInfo => {
  try {
    const response = await api.post(`/notification/email/send/${userId.value}`, approvalInfo)
    console.log('[SUCCESS] fetchApprovalEmail response: ', response.data)
  } catch (error) {
    console.error('[ERROR] fetchApprovalEmail error: ', error)
    toast.error(error.response.data.message)
  }
}

const onHandleSubmit = async () => {
  const values = Object.values(params.value)
  const hasNull = values.some(value => value === null || value === '')

  if (hasNull) {
    toast.error('모든 항목을 입력해주세요.')
    return
  }

  await fetchApprovalInfo()
  await router.push('/approval/status/list')
}

const resetParams = () => {
  params.value.approvalDetailStartDate = null
  params.value.approvalDetailEndDate = null
  params.value.approvalAuthority = ''
  params.value.approvalDetailContent = ''
}

const mappedApprovers = computed(() =>
  approvers.value.map(approver => ({
    title: approver.userName,
    value: approver.userId,
  })),
)

const updateEditorData = newData => {
  params.value.approvalDetailContent = newData
}

watch(
  () => params.value.approvalType,
  newStatus => {
    try {
      const approvalKey = getKeyByValue(APPROVAL_TYPE, newStatus)
      params.value.title = APPROVAL_TITLE[approvalKey] || APPROVAL_TITLE.DEFAULT
    } catch (error) {
      params.value.title = APPROVAL_TITLE.DEFAULT
    }
  },
)

watch(
  userId,
  async newUserId => {
    if (newUserId) {
      await fetchUserInfo()
    }
  },
  { immediate: true },
)

watch(
  userNo,
  async newUserNo => {
    if (newUserNo) {
      await fetchApprovalAuthority()
    }
  },
  { immediate: true },
)
</script>
<style scoped>
.v-card {
  padding: 1rem;
}
</style>
