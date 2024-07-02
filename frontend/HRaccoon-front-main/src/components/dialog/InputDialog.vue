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
              <VTextarea v-model="content" :label="inputLabel" auto-grow multi-line></VTextarea>
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
  inputLabel: {
    type: String,
    default: '반려 사유',
  },
  description: {
    type: String,
    default: '*작성 시, 결재 반려사유에 반영됩니다.',
  },
})

const dialog = ref(false)
const content = ref('')

const handleRightBtnClick = () => {
  props.rightBtnAction(content.value)
  dialog.value = false
}
</script>
