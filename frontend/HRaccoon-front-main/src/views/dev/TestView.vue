<template>
  <div class="about">
    <h1>This is an Test page</h1>
    <h2>모달, 토스트</h2>
    <VRow>
      <VCol>
        <VBtn @click="toastError"> Show Toast</VBtn>
      </VCol>
      <VCol>
        <OneButtonDialog button-name="Open Dialog" content="테스트" icon="mdi-update" title="모달 제목" />
      </VCol>
      <VCol>
        <TwoButtonDialog
          button-name="Open Two Button Dialog"
          content="테스트"
          title="모달 제목"
          @right-btn-action="onHandleDialog"
        />
      </VCol>
      <VCol>
        <InputDialog />
      </VCol>
    </VRow>

    <VRow>
      <VCard>
        <VCardText>
          <h2>CKEditor</h2>
          <VSpacer />
          <CKEditor v-model:editorData="editorData" @update:editor-data="updateEditorData" />
        </VCardText>
      </VCard>
    </VRow>
    <VCard class="mt-5">
      <h2 class="mb-5">ProgressBar</h2>
      <VCardText>
        <VProgressLinear :model-value="50" class="mx-n5 progress-custom" color="primary" height="25" />
      </VCardText>
    </VCard>
    <VSpacer />
    <VCard class="mt-5">
      <VCardText>
        <h2>CKEditor</h2>
        <VSpacer />
        <VRow>
          <GraphBar :labels="labels" :values="votes" />
        </VRow>
      </VCardText>
    </VCard>
    <VCard class="mt-5">
      <VCardText>
        <div>
          <input type="file" @change="onFileChange" />
          <button @click="uploadFile">Upload</button>
          <p v-if="imageUrl">Image URL: {{ imageUrl }}</p>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { S3uploadImage } from '@/plugins/aws/s3.js'

// components
import CKEditor from '@/components/ckeditor/CKEditor.vue'
import InputDialog from '@/components/dialog/InputDialog.vue'
import OneButtonDialog from '@/components/dialog/OneButtonDialog.vue'
import TwoButtonDialog from '@/components/dialog/TwoButtonDialog.vue'
import GraphBar from '@/components/GraphBar.vue'

const toast = useToast()

const editorData = ref('<p>여기에 값을 입력하세요.🎉</p>')
const labels = ref(['test1', 'test2', 'test3', 'test4', 'test5'])
const votes = ref([12, 19, 3, 5, 2])
const file = ref(null)
const imageUrl = ref('')

const toastError = () => {
  toast.error('My toast content', {
    timeout: 2000,
  })
}

const onHandleDialog = () => {
  console.log('두번째 모달 버튼 클릭')
}

const updateEditorData = newData => {
  editorData.value = newData
}

// -- CKEditor Data 감지
watch(editorData, newValue => {
  console.log('Editor Data changed:', newValue)
})

const onFileChange = event => {
  file.value = event.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) return

  try {
    imageUrl.value = await S3uploadImage(file.value)
    console.log('File uploaded successfully:', imageUrl.value)
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}
</script>
<style lang="scss" scoped>
.progress-custom {
  background-color: var(--v-theme-primary);
}
</style>
