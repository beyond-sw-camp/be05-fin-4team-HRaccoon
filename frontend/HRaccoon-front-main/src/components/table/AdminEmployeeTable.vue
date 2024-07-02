<template>
  <div>
    <VTable>
      <thead>
        <tr>
          <th class="text-uppercase">번호</th>
          <th>소속</th>
          <th>사번</th>
          <th>성명</th>
          <th>역량</th>
          <th>퇴사여부</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in data"
          :key="user.approvalNo"
          @click="navigateToUser(user.userId)"
          style="cursor: pointer"
        >
          <td>
            {{ index + 1 }}
          </td>
          <td class="text-center">
            {{ user.userDepartment }}
          </td>
          <td class="text-center">
            {{ user.userId }}
          </td>
          <td class="text-center">
            {{ user.userName }}
          </td>
          <td class="text-center">
            <div v-for="ab in (user.ability || []).slice(0, 3)" :key="ab.abilityNo">#{{ ab.abilityName }}</div>
          </td>
          <td class="text-center">
            {{ user.userDeleteYn ? '퇴사' : '재직' }}
          </td>
        </tr>
      </tbody>
    </VTable>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const router = useRouter()

const navigateToUser = userId => {
  router.push(`/admin/employee/edit/${userId}`)
}
</script>
