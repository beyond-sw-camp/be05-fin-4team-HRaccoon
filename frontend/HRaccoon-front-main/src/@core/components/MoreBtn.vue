<script setup>
const props = defineProps({
  menuList: {
    type: Array,
    required: false,
  },
  itemProps: {
    type: Boolean,
    required: false,
  },
})
</script>

<template>
  <IconBtn>
    <VIcon icon="bx-dots-vertical" />

    <VMenu v-if="props.menuList" activator="parent">
      <VList :item-props="props.itemProps" :items="props.menuList" />
    </VMenu>
  </IconBtn>
</template>
