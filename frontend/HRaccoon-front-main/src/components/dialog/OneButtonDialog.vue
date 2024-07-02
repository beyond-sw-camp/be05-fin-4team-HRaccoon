<template>
  <div>
    <VBtn @click="dialog = true"> {{ buttonName }}</VBtn>

    <VDialog v-model="dialog" width="auto">
      <VCard :prepend-icon="icon" :title="title" max-width="400">
        <VCardText> {{ content }}</VCardText>
        <template v-slot:actions>
          <VBtn class="ms-auto" text="확인" @click="dialog = false"></VBtn>
        </template>
      </VCard>
    </VDialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  buttonName: String,
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
</script>
