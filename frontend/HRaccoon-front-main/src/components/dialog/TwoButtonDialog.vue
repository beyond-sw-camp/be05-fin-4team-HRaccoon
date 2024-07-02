<template>
  <div>
    <VDialog v-model="dialog" max-width="400" persistent>
      <template v-slot:activator="{ props: activatorProps }">
        <VBtn :size="buttonSize" v-bind="activatorProps"> {{ buttonName }}</VBtn>
      </template>

      <VCard :prepend-icon="icon" :title="title">
        <VCardText> {{ content }}</VCardText>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <VBtn @click="dialog = false"> {{ leftBtnNane }}</VBtn>

          <VBtn @click="handleRightBtnClick"> {{ rightBtnName }}</VBtn>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  buttonName: String,
  buttonSize: String,
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

const dialog = ref(false)

const handleRightBtnClick = () => {
  props.rightBtnAction()
  dialog.value = false
}
</script>
