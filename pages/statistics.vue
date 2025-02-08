<template>
  <div class="">
    <h1 class="mb-4">Survey Statistics</h1>
    <div class="card p-3">
      <canvas id="surveyChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

// Register all Chart.js components
Chart.register(...registerables)

// Create a reactive variable for statistics
const stats = ref(null)

// Access the injected Axios instance from Nuxt
const { $axios } = useNuxtApp()

// Define a function to render the chart using the fetched statistics
const renderChart = () => {
  // Get the 2D drawing context of the canvas
  const ctx = document.getElementById('surveyChart').getContext('2d')
  
  // Create a new bar chart with the provided configuration
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
      datasets: [{
        label: 'Average Score',
        data: [
          stats.value.avg_q1,
          stats.value.avg_q2,
          stats.value.avg_q3,
          stats.value.avg_q4,
          stats.value.avg_q5,
          stats.value.avg_q6,
          stats.value.avg_q7,
          stats.value.avg_q8,
          stats.value.avg_q9,
          stats.value.avg_q10
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  })
}

// Fetch the survey statistics once the component has mounted
onMounted(async () => {
  try {
    const res = await $axios.get('/survey/statistics')
    stats.value = res.data;
    renderChart()
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
})
</script>


