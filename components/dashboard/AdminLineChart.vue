<template>
  <div class="w-full h-full">
    <canvas ref="canvasEl" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
)

const props = defineProps<{
  labels: string[]
  data: number[]
  lineColor?: string
  fillColor?: string
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'line'> | null = null

function createChart() {
  if (!canvasEl.value) return

  // Destroy old instance if any
  if (chart) {
    chart.destroy()
    chart = null
  }

  chart = new Chart(canvasEl.value, {
    type: 'line',
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          borderColor: props.lineColor || '#6366f1',
          backgroundColor: props.fillColor || 'rgba(129, 140, 248, 0.15)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: '#e5e7eb',
            borderDash: [4, 4],
          },
          ticks: {
            color: '#9ca3af',
            font: { size: 11 },
          },
          border: {
            color: '#d1d5db',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#e5e7eb',
            borderDash: [4, 4],
          },
          ticks: {
            color: '#9ca3af',
            font: { size: 11 },
            stepSize: 1,
          },
          border: {
            color: '#d1d5db',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.parsed.y}`
            },
          },
        },
      },
    },
  })
}

onMounted(() => {
  createChart()
})

watch(
  () => [props.labels, props.data],
  () => {
    createChart()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

