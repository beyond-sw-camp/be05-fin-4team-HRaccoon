<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  item: {
    type: null,
    required: true,
  },
})
</script>

<template>
  <li :class="{ disabled: item.disable }" class="nav-link">
    <Component :is="item.to ? 'RouterLink' : 'a'" :href="item.href" :to="item.to">
      <VIcon :icon="item.icon" class="nav-item-icon" />
      <!-- 👉 Title -->
      <span class="nav-item-title">
        {{ item.title }}
      </span>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
