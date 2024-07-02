<template>
  <ckeditor
    v-model="localEditorData"
    :config="editorConfig"
    :disabled="isDisabled"
    :editor="editor"
    :readOnly="isDisabled"
    class="custom-editor"
    @input="emitUpdate"
  ></ckeditor>
</template>

<script setup>
import { ref, watch } from 'vue'
import '../../../ckeditor5/build/ckeditor.js'

const props = defineProps({
  editorData: {
    type: String,
    required: true,
  },
  isDisabled: Boolean,
})

const emit = defineEmits(['update:editor-data'])

const localEditorData = ref(props.editorData)
const editor = ref(ClassicEditor)
const editorConfig = ref({
  // 에디터의 설정 추가
  highlight: {
    options: [
      {
        model: 'yellowMarker',
        class: 'marker-yellow',
        title: 'Yellow Marker',
        color: 'var(--ck-highlight-marker-yellow)',
        type: 'marker',
      },
      {
        model: 'greenMarker',
        class: 'marker-green',
        title: 'Green marker',
        color: 'var(--ck-highlight-marker-green)',
        type: 'marker',
      },
      {
        model: 'pinkMarker',
        class: 'marker-pink',
        title: 'Pink marker',
        color: 'var(--ck-highlight-marker-pink)',
        type: 'marker',
      },
      {
        model: 'blueMarker',
        class: 'marker-blue',
        title: 'Blue marker',
        color: 'var(--ck-highlight-marker-blue)',
        type: 'marker',
      },
      { model: 'redPen', class: 'pen-red', title: 'Red pen', color: 'var(--ck-highlight-pen-red)', type: 'pen' },
      {
        model: 'greenPen',
        class: 'pen-green',
        title: 'Green pen',
        color: 'var(--ck-highlight-pen-green)',
        type: 'pen',
      },
    ],
  },
})

watch(
  () => props.editorData,
  newValue => {
    if (localEditorData.value !== newValue) {
      localEditorData.value = newValue
    }
  },
)

const emitUpdate = () => {
  emit('update:editor-data', localEditorData.value)
}
</script>
<style>
.ck-editor__editable_inline:not(.ck-comment__input *) {
  min-height: 500px;
  overflow-y: auto;
}

.ck-content {
  padding-left: 2rem;
}
</style>
