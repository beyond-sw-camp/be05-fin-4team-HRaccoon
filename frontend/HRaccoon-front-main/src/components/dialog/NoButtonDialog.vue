<template>
  <div>
    <VDialog :v-model="dialogStatus" max-width="400" persistent>
      <VCard :prepend-icon="icon" :title="title">
        <VCardText> {{ content }}</VCardText>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <VBtn @click="closeDialog"> {{ leftBtnNane }}</VBtn>
          <VBtn @click="rightBtnAction"> {{ rightBtnName }}</VBtn>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  dialogStatus: Boolean,
  buttonName: String,
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
    default: 'Update in progress',
  },
  content: {
    type: String,
    default: 'Your application will relaunch automatically after the update is complete.',
  },
  icon: {
    type: String,
    default: 'mdi-checkbox-marked-circle-outline',
  },
})

const dialog = ref(props.dialogStatus)

watch(
  () => props.dialogStatus,
  newVal => {
    dialog.value = newVal
  },
)

const closeDialog = () => {
  dialog.value = false
}
</script>
