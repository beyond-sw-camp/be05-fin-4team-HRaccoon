<template>
  <Bar :ref="chart" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  labels: Array,
  values: Array,
})

const chart = ref(null)

const chartData = ref({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 9,
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      display: false, // label을 보이지 않게 설정
    },
    title: {
      display: false, // title을 보이지 않게 설정
    },
  },
})

const updateChart = () => {
  if (chart.value) {
    nextTick(() => {
      chart.value.chartInstance.update()
    })
  }
}

watch(
  () => props.labels,
  newLabels => {
    chartData.value.labels = newLabels
    updateChart()
  },
)

watch(
  () => props.values,
  newValues => {
    chartData.value.datasets[0].data = newValues
    updateChart()
  },
)

onMounted(() => {
  updateChart()
})
</script>
