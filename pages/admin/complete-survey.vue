<template>
    <div class="row justify-content-center">
      <h1 class="mb-4">Complete Your Survey</h1>
      <div v-if="loading" class="alert alert-info">Loading survey data...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else>
        <form @submit.prevent="submitSurvey">
          <div v-for="(question, index) in questions" :key="index" class="mb-3">
            <label :for="'q' + question.id" class="form-label">
              {{ question.text }} (0-5):
            </label>
            <input
              :id="'q' + question.id"
              type="number"
              class="form-control"
              v-model.number="responses[question.id]"
              min="0"
              max="5"
              required
            />
          </div>
          <button type="submit" class="btn btn-success w-100">Submit Survey</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useNuxtApp } from '#imports'
  
  // Attach the 'admin' middleware to this page
    definePageMeta({
    middleware: 'admin'
    });

  // Nuxt router and Axios instance
  const router = useRouter()
  const { $axios } = useNuxtApp()
  
  // State variables
  const questions = ref([])
  const responses = ref({})
  const loading = ref(true)
  const error = ref('')
  
  // Fetch incomplete survey data
  async function fetchIncompleteSurvey() {
    loading.value = true
    error.value = ''
    try {
      const response = await $axios.get('/survey/incomplete')
      questions.value = response.data.questions
      // Pre-fill existing answers if any
      response.data.answers.forEach((ans) => {
        responses.value[ans.question_id] = ans.value
      })
    } catch (err) {
      error.value = 'Failed to load survey data. Please try again later.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  
  // Submit completed survey
  async function submitSurvey() {
    try {
      await $axios.post('/survey/complete', { responses: responses.value })
      router.push('/statistics')
    } catch (err) {
      error.value = 'Failed to submit survey. Please try again.'
      console.error(err)
    }
  }
  
  // Fetch incomplete survey data on page load
  onMounted(fetchIncompleteSurvey)
  </script>
  
  <style scoped>
  /* Custom styles if needed */
  </style>
  