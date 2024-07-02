<template>
  <VContainer style="max-width: 500px">
    <VTextField v-model="todoInsert" label="해야 할 일을 입력하세요." variant="solo" @keydown.enter="fetchAddTodo">
      <template v-slot:append-inner>
        <VFadeTransition>
          <VBtn v-show="todoInsert" icon="mdi-plus-circle" variant="text" @click="fetchAddTodo" />
        </VFadeTransition>
      </template>
    </VTextField>

    <VRow align="center" class="my-1">
      <strong class="mx-4 text-info-darken-2">
        Tasks:&nbsp;
        <VFadeTransition leave-absolute>
          <span :key="todos.length">
            {{ todos.length }}
          </span>
        </VFadeTransition>
      </strong>
      <strong class="mx-4 text-info-darken-2"> Remaining: {{ remainingTasks() }} </strong>

      <VDivider vertical />

      <strong class="mx-4 text-success-darken-2"> Completed: {{ completedTasks() }} </strong>
    </VRow>

    <VDivider class="mb-4" />

    <VCard v-if="todos.length > 0">
      <VSlideYTransition class="py-0" group tag="VList">
        <div v-for="(todo, i) in todos" :key="`${i}-${todo.todoContent}`">
          <VDivider v-if="i !== 0" :key="`${i}-divider`" />

          <VListItem @click="fetchTodoComplete(todo.todoNo)">
            <template v-slot:prepend>
              <VCheckbox v-model="todo.todoCompleteYn" color="grey"></VCheckbox>
            </template>

            <VListItemTitle>
              <span :class="todo.todoCompleteYn ? 'text-grey done' : 'text-primary'">{{ todo.todoContent }}</span>
            </VListItemTitle>

            <template v-slot:append>
              <VExpandXTransition>
                <img
                  v-if="todo.todoCompleteYn"
                  alt="delete-icon"
                  class="delete-btn"
                  src="../../assets/images/circle-substract.png"
                  style="cursor: pointer"
                  @click="fetchTodoDelete(todo.todoNo)"
                />
              </VExpandXTransition>
            </template>
          </VListItem>
        </div>
      </VSlideYTransition>
    </VCard>
  </VContainer>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import axios from '@/api/axios'

const todos = ref([])
const todoInsert = ref('')
const todoChangeTrigger = ref(0)

const userNo = ref(useAuthStore().userNo || '')

const fetchTodoList = async () => {
  try {
    const response = await axios.get(`/todo/list/${userNo.value}`)
    console.log('[SUCCESS] fetchTodoList response:', response.data)
    todos.value = response.data.data
  } catch (error) {
    console.error('[ERROR] fetchTodoList error:', error)
  }
}

const fetchAddTodo = async () => {
  try {
    const response = await axios.post('/todo/create', {
      todoContent: todoInsert.value,
      todoCompleteYn: false,
      todoDeleteYn: false,
      userNo: userNo.value,
    })
    console.log('[SUCCESS] fetchAddTodo response:', response.data)

    todoInsert.value = ''
    triggerTodoListRefresh()
  } catch (error) {
    console.error('[ERROR] fetchAddTodo error:', error)
  }
}

const fetchTodoComplete = async todoNo => {
  try {
    const response = await axios.post(`/todo/complete/${todoNo}`)
    console.log('[SUCCESS] fetchTodoComplete response:', response.data)

    triggerTodoListRefresh()
  } catch (error) {
    console.error('[ERROR] fetchTodoComplete error:', error)
  }
}

const fetchTodoDelete = async todoNo => {
  try {
    const response = await axios.post(`/todo/delete/${todoNo}`)
    console.log('[SUCCESS] fetchTodoDelete response:', response.data)

    triggerTodoListRefresh()
  } catch (error) {
    console.error('[ERROR] fetchTodoDelete error:', error)
  }
}

const completedTasks = () => {
  return todos.value.filter(todo => todo.todoCompleteYn).length
}
const progress = () => {
  return (completedTasks() / todos.value.length) * 100
}
const remainingTasks = () => {
  return todos.value.length - completedTasks()
}

const triggerTodoListRefresh = () => {
  todoChangeTrigger.value++
}

onMounted(() => {
  fetchTodoList()
})

watch(todoChangeTrigger, fetchTodoList)
</script>

<style lang="scss">
.v-selection-control__input input {
  position: absolute;
  left: 8px;
  top: 0;
  width: 20px;
  opacity: 1;
}

.done {
  text-decoration: line-through;
}

.delete-btn {
  height: 30px;
}
</style>
