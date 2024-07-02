<template>
  <v-dialog :value="dialog" max-width="500px" @input="dialog = $event">
    <v-card>
      <v-card-actions>
        <v-btn color="primary" @click.stop="dialog = false">Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['input'])

const dialog = computed({
  get: () => props.value,
  set: value => emit('input', value),
})
</script>
