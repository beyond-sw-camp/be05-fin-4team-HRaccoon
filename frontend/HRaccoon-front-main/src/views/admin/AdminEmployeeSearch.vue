<template>
  <div>
    <h1 class="mb-2">| 직원 정보 조회 (관리자)</h1>
    <VCard class="mb-4">
      <VCardText class="pa-10">
        <VRow>
          <VCol cols="12" md="4">
            <VCombobox
              v-model="selectedDepartment"
              :items="departmentList"
              label="소속 부서"
              variant="outlined"
              @keydown.enter="onSubmit"
            ></VCombobox>
          </VCol>
          <VCol cols="12" md="4">
            <VCombobox
              v-model="selectedAbility"
              :items="abilityList"
              label="역량"
              variant="outlined"
              @keydown.enter="onSubmit"
            ></VCombobox>
          </VCol>
          <VCol>
            <VTextField
              v-model="searchQuery"
              :loading="loading"
              density="compact"
              hide-details
              label="조회할 직원의 이름, 사번을 입력하세요."
              single-line
              style="height: 66px"
              variant="solo"
              @keydown.enter="onSubmit"
            ></VTextField>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="4">
            <VCombobox
              v-model="selectedDeleteYn"
              :items="deleteYnList"
              label="퇴사여부"
              variant="outlined"
              @keydown.enter="onSubmit"
            ></VCombobox>
          </VCol>
        </VRow>
        <VRow>
          <VBtn class="ml-auto" size="large" variant="tonal" @click="onReset">초기화</VBtn>
          <VBtn class="ml-3" size="large" @click="onSubmit">검색</VBtn>
        </VRow>
      </VCardText>
    </VCard>
    <VCard>
      <div v-if="params.length > 0">
        <EmployeeTable :data="params" />
        <VPagination
          v-model="currentPage"
          :length="totalPage"
          total-visible="7"
          @update:modelValue="goToPage"
        ></VPagination>
      </div>
      <div v-else class="text-center pb-10">no result</div>
    </VCard>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import EmployeeTable from '@/components/table/AdminEmployeeTable.vue'
import { useToast } from 'vue-toastification'

// api
import axios from '@/api/axios'

// store
import { useCodeStore } from '@/stores/useCodeStore'

import { ABILITY_LIST, DEPATMENT_LIST } from '@/util/constants/userConstant'

const toast = useToast()

const store = useCodeStore()
const departmentList = DEPATMENT_LIST
const abilityList = ABILITY_LIST
const deleteYnList = ['재직', '퇴사']

const loaded = ref(false)
const loading = ref(false)

const searchQuery = ref('')
const selectedAbility = ref('')
const selectedDepartment = ref('')
const selectedDeleteYn = ref('')

const params = ref([])
const totalPage = ref(1)
const currentPage = ref(1)

const fetchEmployeeAbility = async (userId, index) => {
  try {
    const response = await axios.get(`/user/ability/${userId}`)

    params.value[index].ability = response.data.data
  } catch (error) {
    console.error('Error get Ability:', error)
  }
}

const fetchEmployeeList = async () => {
  try {
    const response = await axios.get(`/admin/search`, {
      params: {
        keyword: searchQuery.value,
        ability: selectedAbility.value,
        department: selectedDepartment.value,
        pageNumber: currentPage.value,
        deleteYn: selectedDeleteYn.value,
      },
    })

    params.value = response.data.data.content
    totalPage.value = response.data.data.totalPages
    currentPage.value = response.data.data.pageable.pageNumber + 1

    await setEmployeeAbility(params.value)
  } catch (error) {
    console.log('Error get Employee:', error)
    toast.error(error.response.data.message)
  }
}

const setEmployeeAbility = async employees => {
  try {
    const promises = employees.map(async (employee, index) => {
      const ability = await fetchEmployeeAbility(employee.userId, index)
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('Error set Ability:', error)
  }
}

const goToPage = newPage => {
  currentPage.value = newPage

  fetchEmployeeList()
}

const onSubmit = () => {
  loading.value = true
  currentPage.value = 1

  fetchEmployeeList()

  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

const onReset = () => {
  selectedAbility.value = ''
  selectedDepartment.value = ''
  searchQuery.value = ''
  selectedDeleteYn.value = ''
}

onMounted(() => {
  fetchEmployeeList()
})
</script>
<style scoped></style>
