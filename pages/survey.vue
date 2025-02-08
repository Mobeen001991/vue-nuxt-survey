<template>
  <div class="">
    <SurveyForm
    :submit-url="'/survey'"
  />
  </div>
</template>
  
<script setup>
import { onMounted } from 'vue'
const { $axios } = useNuxtApp()
definePageMeta({
  middleware: 'auth'
})
// Check if the survey has already been taken
function isSurveyTaken() {
  $axios.get('/survey/status')
    .then(response => {
      if (response.data.taken) {
        router.push('/statistics')
      }
    })
    .catch(error => {
      console.error('Error checking survey status:', error)
    })
}

onMounted(() => {
  isSurveyTaken()
})
</script>
