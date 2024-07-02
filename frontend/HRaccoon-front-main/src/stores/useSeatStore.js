import { defineStore } from 'pinia'

// useSeatStore 스토어 정의
export const useSeatStore = defineStore('seat', {
  // state 함수는 스토어의 초기 상태를 반환합니다.
  state: () => ({
    selectedSeats: {}, // 사용자 ID를 키로, 선택된 좌석 번호를 값으로 가지는 객체
  }),

  // actions 객체는 상태를 변경하는 메소드들을 포함합니다.
  actions: {
    // selectSeat 메소드는 특정 사용자가 특정 좌석을 선택했음을 저장합니다.
    selectSeat(userNo, seatNo) {
      this.selectedSeats[userNo] = seatNo
    },

    // cancelSeat 메소드는 특정 사용자의 좌석 선택을 취소합니다.
    cancelSeat(userNo) {
      delete this.selectedSeats[userNo]
    },

    // getSelectedSeat 메소드는 특정 사용자가 선택한 좌석 번호를 반환합니다.
    // 선택된 좌석이 없으면 null을 반환합니다.
    getSelectedSeat(userNo) {
      return this.selectedSeats[userNo] || null
    },
  },
})
