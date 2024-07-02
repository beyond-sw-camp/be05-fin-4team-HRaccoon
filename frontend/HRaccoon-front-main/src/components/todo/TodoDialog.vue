<template>
  <div class="text-center">
    <VDialog v-model="dialog" content-class="custom-dialog" transition="slide-x-transition" width="500">
      <template v-slot:activator="{ props }">
        <IconBtn v-bind="props">
          <VIcon>mdi-application-edit</VIcon>
        </IconBtn>
      </template>

      <template v-slot:default="{ isActive }">
        <VCard height="100vh" title="TodoList">
          <VCardText>
            <TodoList />
          </VCardText>
          <VCardActions>
            <VSpacer></VSpacer>
            <VBtn text="뒤로가기" variant="text" @click="dialog = false" />
          </VCardActions>
        </VCard>
      </template>
    </VDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TodoList from '@/components/todo/TodoList.vue'

const dialog = ref(false)
</script>
<style lang="scss">
.custom-dialog {
  position: absolute;
  right: 0;
  margin: 0;
  height: 100%;
}
</style>
