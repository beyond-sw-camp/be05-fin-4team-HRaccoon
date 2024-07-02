<template>
  <VueDatePicker
    v-model="selectDate"
    inline
    auto-apply
    :markers="markers"
    locale="ko"
    :enable-time-picker="false"
    :dark="isDark"
  >
  </VueDatePicker>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useTheme } from 'vuetify'

const props = defineProps({
  markers: {
    type: Array,
    required: true,
  },
})

const { global: globalTheme } = useTheme()

const isDark = computed(() => (globalTheme.name.value === 'dark' ? true : false))

const selectDate = ref(new Date())

const emit = defineEmits(['handleSelectCurrentDate'])

const handleSelectCurrentDate = () => {
  emit('handleSelectCurrentDate', selectDate.value)
}

watch(selectDate, handleSelectCurrentDate)
</script>

<style lang="scss">
.dp__theme_light {
  --dp-primary-color: #696cff;
  --dp-primary-disabled-color: #8592a3;
  --dp-menu-border-color: none;
  --dp-arrow-left: 50%;
  --dp-hover-text-color: #696cff;
  --dp-icon-color: #696cff;
}
.dp__flex_display {
  display: block;
}
.dp__btn {
  background: none;
  color: var(--dp-hover-text-color);
}
.dp__inner_nav {
  color: var(--dp-icon-color);
}
:root {
  --dp-menu-min-width: 100%;
}
.dp__theme_dark {
  --dp-background-color: #2b2c40;
  --dp-text-color: #8592a3;
  --dp-hover-color: #4a5072;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #8592a3;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgb(0 92 178 / 20%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
  --dp-range-between-border-color: var(--dp-hover-color, #fff);
  --dp-loader: 5px solid #005cb2;
}
</style>
