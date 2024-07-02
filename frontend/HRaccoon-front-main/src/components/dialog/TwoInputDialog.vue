<template>
  <div>
    <v-dialog v-model="dialog" max-width="600" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <VBtn :text="buttonName" size="large" v-bind="activatorProps"></VBtn>
      </template>

      <VCard :title="title" prepend-icon="mdi-checkbox-marked-circle-outline">
        <v-spacer></v-spacer>
        <VCardText>
          <VRow>
            <VCol>
              <VTextField
                v-model="topContent"
                :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                :type="isNewPasswordVisible ? 'text' : 'password'"
                :label="topInputLabel"
                @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                auto-grow
                multi-line
              ></VTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <VTextField
                v-model="bottomContent"
                :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :label="bottomInputLabel"
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                auto-grow
                multi-line
              ></VTextField>
            </VCol>
          </VRow>
          <small class="text-caption text-medium-emphasis">{{ description }}</small>
        </VCardText>

        <v-card-actions>
          <v-spacer></v-spacer>
          <VBtn :text="leftBtnNane" variant="plain" @click="dialog = false"></VBtn>
          <VBtn :text="rightBtnName" @click="handleRightBtnClick"></VBtn>
        </v-card-actions>
      </VCard>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  buttonName: { type: String, default: '버튼 제목' },
  leftBtnNane: {
    type: String,
    default: '취소',
  },
  rightBtnName: {
    type: String,
    default: '확인',
  },
  rightBtnAction: {
    type: Function,
    default: () => {},
  },
  title: {
    type: String,
    default: '모달 제목',
  },
  topInputLabel: {
    type: String,
    default: '새 비밀번호',
  },
  bottomInputLabel: {
    type: String,
    default: '비밀번호 확인',
  },
  description: {
    type: String,
    default: '*작성 시, 비밀번호 수정에 반영됩니다.',
  },
})

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const dialog = ref(false)
const topContent = ref('')
const bottomContent = ref('')

const handleRightBtnClick = () => {
  props.rightBtnAction(topContent.value, bottomContent.value)
  dialog.value = false
  topContent.value = ''
  bottomContent.value = ''
}
</script>
