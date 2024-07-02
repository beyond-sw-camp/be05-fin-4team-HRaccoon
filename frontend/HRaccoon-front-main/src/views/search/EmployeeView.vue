<template>
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
              <VTextField v-model="params.userName" class="custom-text-field" label="이름" readonly />
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
              <VTextField v-model="params.userDepartmentName" class="custom-text-field" label="소속 부서" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <v-text-field v-model="params.userTeamName" class="custom-text-field" label="소속 팀" readonly />
            </VCol>
          </v-row>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userRankName" class="custom-text-field" label="직위" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userPositionName" class="custom-text-field" label="직책" readonly />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userMobile" class="custom-text-field" label="연락처" readonly />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="params.userEmail" class="custom-text-field" label="이메일" readonly />
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard>
    <VTabs v-model="tab" fixed-tabs>
      <VTab text="근무 좌석 정보" value="tab-1"></VTab>
      <VTab text="개인 역량" value="tab-2"></VTab>
    </VTabs>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem v-for="i in 2" :key="i" :value="'tab-' + i">
        <VCardText>
          <div v-if="i === 1" class="w-100">
            <VRow v-if="userSeat.seatOffice">
              <VCol cols="12" md="6">
                <VTextField v-model="userSeat.seatOffice" class="custom-text-field" label="현 근무장소" readonly />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="seatCustomLocation" class="custom-text-field" label="좌석" readonly />
              </VCol>
            </VRow>
            <VRow v-else>자리에 없습니다.</VRow>
          </div>

          <div v-if="i === 2">
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
          </div>
          <VRow class="mt-4">
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
      </VTabsWindowItem>
    </VTabsWindow>
  </VCard>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

// api
import api from '@/api/axios.js'

// store
import { useCodeStore } from '@/stores/useCodeStore.js'
import { useAuthStore } from '@/stores/useAuthStore.js'

const router = useRouter()
const route = useRoute()
const store = useCodeStore()
const authStore = useAuthStore()

const params = ref({})
const userId = ref(route.params.userId)
const userAbilities = ref([])

const tab = ref('tab-1')
const userSeat = ref({})
const seatCustomLocation = ref('')

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

    const abilities = response.data.data
    userAbilities.value = abilities.map(ability => ability.abilityName)
  } catch (error) {
    console.error('[ERROR] fetchUserAbilities error:', error.response)
  }
}

const fetchUserSeat = async () => {
  try {
    const response = await api.get(`/seat/info/${userId.value}`)
    console.log('[SUCCESS] fetchUserSeat response:', response.data)

    userSeat.value = response.data.data
    userSeat.value.seatOffice = `${store.getCodeName(userSeat.value.seatOffice)} 오피스`
    seatCustomLocation.value = `${userSeat.value.seatFloor}층 ${userSeat.value.seatNum}번`
  } catch (error) {
    console.error('[ERROR] fetchUserSeat error:', error.response)
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchUserAbilities()
  fetchUserSeat()
})
</script>

<style scoped></style>
