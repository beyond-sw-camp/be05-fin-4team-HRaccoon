<template>
  <h1 class="mb-2">| {{ headerTitle }}</h1>
  <VCard>
    <VRow>
      <VCol cols="12" md="4">
        <VTextField v-model="params.userTeam" label="소속" readonly />
      </VCol>

      <!-- 사번 -->
      <VCol cols="12" md="4">
        <VTextField v-model="params.userId" label="사번" readonly />
      </VCol>

      <!-- 결재자 & 상신자-->
      <VCol cols="12" md="4">
        <VTextField v-model="approvalPersonType" :label="approvalPerson" readonly />
      </VCol>

      <!-- 유형 -->
      <VCol cols="12" md="3">
        <VTextField v-model="params.approvalType" label="유형" readonly />
      </VCol>

      <!-- 기간 시작 -->
      <VCol cols="12" md="3">
        <VTextField v-model="params.approvalDetailStartDate" label="기간 시작" readonly />
      </VCol>

      <!-- 기간 끝 -->
      <VCol cols="12" md="3">
        <VTextField v-model="params.approvalDetailEndDate" label="기간 끝" readonly />
      </VCol>

      <!-- 결재 상태 -->
      <VCol cols="12" md="3">
        <VTextField v-model="params.approvalStatus" label="결재 상태" readonly />
      </VCol>

      <!-- 제목 -->
      <VCol cols="12" md="6">
        <VTextField v-model="params.approvalTitle" label="제목" readonly />
      </VCol>

      <!-- 등록일자 -->
      <VCol cols="12" md="6">
        <VTextField v-model="params.approvalSubmitDate" label="등록일자" readonly />
      </VCol>

      <!-- 내용 -->
      <VCol cols="12">
        <CKEditor v-model:editorData="params.approvalDetailContent" is-disabled="true" />
      </VCol>

      <VCol v-if="getKeyByValue(APPROVAL_STATUS, params.approvalStatus) === 'REJECTED'" cols="12">
        <VTextarea v-model="params.approvalDetailResponseContent" auto-grow label="반려 사유" readonly />
      </VCol>

      <VCol
        v-if="props.type === 'request' && getKeyByValue(APPROVAL_STATUS, params.approvalStatus) === 'PENDING'"
        class="d-flex gap-4"
      >
        <TwoButtonDialog
          :rightBtnAction="fetchApprovalSuccess"
          button-size="large"
          buttonName="승인"
          content="결재를 승인하시겠습니까?"
          icon="mdi-check-all"
          rightBtnName="승인"
          title="결재 승인"
        />
        <InputDialog :rightBtnAction="fetchApprovalReject" button-name="반려" right-btn-name="반려" title="결재 반려" />
      </VCol>

      <VCol
        v-if="props.type === 'status' && getKeyByValue(APPROVAL_STATUS, params.approvalStatus) === 'PENDING'"
        class="d-flex gap-4"
      >
        <TwoButtonDialog
          :rightBtnAction="fetchApprovalCancel"
          button-size="large"
          buttonName="결재 취소"
          content="결재를 취소하시겠습니까?"
          icon="mdi-cancel"
          left-btn-nane="뒤로가기"
          rightBtnName="결재 취소"
          title="결재 취소"
        />
      </VCol>

      <VCol class="v-col-right">
        <VBtn
          size="large"
          variant="tonal"
          @click="
            () => {
              router.go(-1)
            }
          "
          >뒤로 가기
        </VBtn>
      </VCol>
    </VRow>
  </VCard>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

// components
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'
import InputDialog from '@/components/dialog/InputDialog.vue'

// api
import api from '@/api/axios.js'

// store
import { useAuthStore } from '@/stores/useAuthStore.js'

// util
import { formatDate, getKeyByValue } from '@/util/util.js'

// constants
import { APPROVAL_STATUS, APPROVAL_TITLE, APPROVAL_TYPE } from '@/util/constants/approvalConstant.js'
import CKEditor from '@/components/ckeditor/CKEditor.vue'

const props = defineProps({
  approvalNo: String,
  type: String,
})

const router = useRouter()
const toast = useToast()

const params = ref({})
const userNo = ref(useAuthStore().userNo || '')
const userId = ref(useAuthStore().userId || '')

const fetchApprovalRequestDetail = async () => {
  try {
    const response = await api.get(`/approval/requested-approval-list/${userNo.value}/${props.approvalNo}`)
    console.log('[SUCCESS] fetchApprovalRequestDetail response:', response)

    params.value = {
      userTeam: response.data.data.userTeam,
      userId: response.data.data.userId,
      userName: response.data.data.userName,
      approvalType: APPROVAL_TYPE[response.data.data.approvalType],
      approvalTitle: getKeyByValue(APPROVAL_TITLE, response.data.data.approvalType) || APPROVAL_TITLE.DEFAULT,
      approvalDetailStartDate: formatDate(response.data.data.approvalDetailStartDate),
      approvalDetailEndDate: formatDate(response.data.data.approvalDetailEndDate),
      approvalAuthority: response.data.data.approvalAuthority,
      approvalAuthorityName: response.data.data.approvalAuthorityName,
      approvalSubmitDate: formatDate(response.data.data.approvalSubmitDate),
      approvalDetailContent: response.data.data.approvalDetailContent,
      approvalStatus: APPROVAL_STATUS[response.data.data.approvalStatus],
      approvalDetailResponseContent: response.data.data.approvalDetailResponseContent,
    }
  } catch (error) {
    console.error('[ERROR] fetchApprovalRequestDetail error:', error)
  }
}

const fetchApprovalStatusDetail = async () => {
  try {
    const response = await api.get(`/approval/submitted-approval-list/${userNo.value}/${props.approvalNo}`)
    console.log('[SUCCESS] fetchApprovalStatusDetail response:', response)

    params.value = {
      userTeam: response.data.data.userTeam,
      userId: response.data.data.userId,
      userName: response.data.data.userName,
      approvalType: APPROVAL_TYPE[response.data.data.approvalType],
      approvalTitle: getKeyByValue(APPROVAL_TITLE, response.data.data.approvalType) || APPROVAL_TITLE.DEFAULT,
      approvalDetailStartDate: formatDate(response.data.data.approvalDetailStartDate),
      approvalDetailEndDate: formatDate(response.data.data.approvalDetailEndDate),
      approvalAuthority: response.data.data.approvalAuthority,
      approvalAuthorityName: response.data.data.approvalAuthorityName,
      approvalSubmitDate: formatDate(response.data.data.approvalSubmitDate),
      approvalDetailContent: response.data.data.approvalDetailContent,
      approvalStatus: APPROVAL_STATUS[response.data.data.approvalStatus],
      approvalDetailResponseContent: response.data.data.approvalDetailResponseContent,
    }
  } catch (error) {
    console.error('[ERROR] fetchApprovalStatusDetail error:', error)
  }
}

/**
 * @description 결재 반려 요청 함수
 * @returns {Promise<void>}
 */
const fetchApprovalReject = async content => {
  try {
    const response = await api.post(`/approval/requested-approval-list/${userNo.value}/${props.approvalNo}/reject`, {
      isApproved: false,
      rejectionReason: content,
    })
    console.log('[SUCCESS] fetchApprovalReject response:', response)

    toast.success('결재 반려가 완료되었습니다.')
    fetchApprovalSendEmail()
    await fetchApprovalRequestDetail()
  } catch (error) {
    console.error('[ERROR] fetchApprovalReject error:', error)

    toast.error(error.response.data.message)
  }
}

/**
 * @description 결재 승인 요청 함수
 * @returns {Promise<void>}
 */
const fetchApprovalSuccess = async () => {
  try {
    const response = await api.post(`/approval/requested-approval-list/${userNo.value}/${props.approvalNo}/approve`)
    console.log('[SUCCESS] fetchApprovalSuccess response:', response)

    toast.success('결재 승인이 완료되었습니다.')
    fetchApprovalSendEmail()
    await fetchApprovalRequestDetail()
  } catch (error) {
    console.error('[ERROR] fetchApprovalSuccess error:', error)

    toast.error(error.response.data.message)
  }
}

/**
 * @description 결재 취소 요청 함수
 * @returns {Promise<void>}
 */
const fetchApprovalCancel = async () => {
  try {
    const response = await api.post(`/approval/submitted-approval-list/${userNo.value}/${props.approvalNo}/cancel`)
    console.log('[SUCCESS] fetchApprovalCancel response:', response)

    toast.success(response.data.message)
    await fetchApprovalStatusDetail()
  } catch (error) {
    console.error('[ERROR] fetchApprovalCancel error:', error)

    toast.error(error.response.data.message)
  }
}

const fetchApprovalSendEmail = async () => {
  try {
    const response = await api.post(`/notification/email/send/result/${userId.value}/${props.approvalNo}`)
    console.log('[SUCCESS] fetchApprovalSendEmail response:', response)

    toast.success(response.data.message)
  } catch (error) {
    console.error('[ERROR] fetchApprovalSendEmail error:', error)
  }
}

const headerTitle = computed(() => {
  return props.type === 'request' ? '결재 요청 확인' : '결재 현황 확인'
})

const approvalPerson = computed(() => {
  return props.type === 'request' ? '상신자' : '결재자'
})

const approvalPersonType = computed(() => {
  return props.type === 'request' ? params.value.userName : params.value.approvalAuthorityName
})

watch(
  userNo,
  async newUserNo => {
    if (newUserNo) {
      console.log(newUserNo)

      if (props.type === 'request') {
        await fetchApprovalRequestDetail()
      } else {
        await fetchApprovalStatusDetail()
      }
    }
  },
  { immediate: true },
)
</script>
<style scoped>
.v-card {
  padding: 1rem;
}

.v-col-right {
  display: flex;
  justify-content: flex-end;
}
</style>
