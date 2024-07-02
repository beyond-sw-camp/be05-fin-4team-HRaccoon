export const APPROVAL_TYPE = Object.freeze({
  BUSINESS_TRIP: '출장',
  VACATION: '휴가',
  OUT_ON_BUSINESS: '외근',
})

export const APPROVAL_TITLE = Object.freeze({
  BUSINESS_TRIP: '출장 신청',
  VACATION: '휴가 신청',
  OUT_ON_BUSINESS: '외근 신청',
  DEFAULT: '결재 신청',
})

export const APPROVAL_STATUS = Object.freeze({
  PENDING: '결재 중',
  APPROVED: '결재 승인',
  REJECTED: '결재 반려',
  CANCELED: '결재 취소',
})
