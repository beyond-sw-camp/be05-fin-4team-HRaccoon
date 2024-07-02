<template>
  <div>
    <VueApexCharts
      :height="300"
      :options="chartOptions.radial"
      :series="[params.percent]"
      class="mt-6"
      type="radialBar"
    />
  </div>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useDisplay, useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { computed } from 'vue'

const props = defineProps({
  params: {
    text: {
      type: String,
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    totalTime: Number,
    currentTime: Number,
  },
})

const vuetifyTheme = useTheme()
const display = useDisplay()

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const disabledTextColor = `rgba(${hexToRgb(String(currentTheme['on-surface']))},${variableTheme['disabled-opacity']})`
  const primaryTextColor = `rgba(${hexToRgb(String(currentTheme['on-surface']))},${variableTheme['high-emphasis-opacity']})`
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
  return {
    bar: {
      chart: {
        stacked: true,
        parentHeightOffset: 0,
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 6,
        lineCap: 'round',
        colors: [currentTheme.surface],
      },
      colors: [`rgba(${hexToRgb(String(currentTheme.primary))}, 1)`, `rgba(${hexToRgb(String(currentTheme.info))}, 1)`],
      legend: {
        offsetX: -10,
        position: 'top',
        fontSize: '14px',
        horizontalAlign: 'left',
        fontFamily: 'Public Sans',
        labels: { colors: currentTheme.secondary },
        itemMargin: {
          vertical: 4,
          horizontal: 10,
        },
        markers: {
          width: 8,
          height: 8,
          radius: 10,
          offsetX: -4,
        },
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      grid: {
        borderColor,
        padding: { bottom: 5 },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '30%',
          endingShape: 'rounded',
          startingShape: 'rounded',
        },
      },
      xaxis: {
        axisTicks: { show: false },
        crosshairs: { opacity: 0 },
        axisBorder: { show: false },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            fontSize: '14px',
            colors: disabledTextColor,
            fontFamily: 'Public Sans',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
            colors: disabledTextColor,
            fontFamily: 'Public Sans',
          },
        },
      },
      responsive: [
        {
          breakpoint: display.thresholds.value.xl,
          options: { plotOptions: { bar: { columnWidth: '43%' } } },
        },
        {
          breakpoint: display.thresholds.value.lg,
          options: { plotOptions: { bar: { columnWidth: '50%' } } },
        },
        {
          breakpoint: display.thresholds.value.md,
          options: { plotOptions: { bar: { columnWidth: '42%' } } },
        },
        {
          breakpoint: display.thresholds.value.sm,
          options: { plotOptions: { bar: { columnWidth: '45%' } } },
        },
      ],
    },
    radial: {
      chart: { sparkline: { enabled: true } },
      labels: [props.params.currentTime + '시간 / ' + props.params.totalTime + '시간'],
      stroke: { dashArray: 5 },
      colors: [`rgba(${hexToRgb(String(currentTheme.primary))}, 1)`],
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          opacityTo: 0.6,
          opacityFrom: 1,
          shadeIntensity: 0.5,
          stops: [30, 70, 100],
          inverseColors: false,
          gradientToColors: [currentTheme.primary],
        },
      },
      plotOptions: {
        radialBar: {
          endAngle: 150,
          startAngle: -140,
          hollow: { size: '55%' },
          track: { background: 'transparent' },
          dataLabels: {
            name: {
              offsetY: 25,
              fontWeight: 600,
              fontSize: '20px',
              color: currentTheme.secondary,
              fontFamily: 'Public Sans',
            },
            value: {
              offsetY: -15,
              fontWeight: 800,
              fontSize: '30px',
              color: primaryTextColor,
              fontFamily: 'Public Sans',
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 900,
          options: { chart: { height: 250 } },
        },
        {
          breakpoint: 735,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 660,
          options: { chart: { height: 200 } },
        },
        {
          breakpoint: 600,
          options: { chart: { height: 380 } },
        },
      ],
    },
  }
})
</script>

<style lang="scss">
.apex {
  font-size: 20px;
  padding: 20px 0;
  text-align: center;
}
</style>
