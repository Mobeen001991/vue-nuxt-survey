<template>
    <div class="survey-container">
      <h1 class="mb-5">{{ title }}</h1>
  
      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
  
      <!-- Error Message -->
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
  
      <form @submit.prevent="submitSurvey">
        <div>
          <div v-for="(val, i) in questions" :key="i + page" class="mb-3">
            <label :for="'q' + i" class="form-label">
              {{ val.text }} (0–5):
            </label>
            <input :id="'q' + (i + ((page - 1) * 5))" type="text" class="form-control"
              v-model.number="answers['q' + (i + 1 + ((page - 1) * 5))]" v-limit-range />
          </div>
        </div>
  
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" v-if="page > 1" @click="prevPage">
            Previous
          </button>
          <div>
            <button type="button" class="btn btn-primary me-2" v-if="page < 2" @click="nextPage">
              Next
            </button>
            <button type="submit" :disabled="loading" class="btn btn-success" v-if="page === 2">
              Submit Survey
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute, useNuxtApp } from '#imports';
  import surveyData from '~/assets/data/surveyQuestions.json'
  
  const props = defineProps({
    submitUrl: {
      type: String,
      required: true
    },
    fetchUrl: {
      type: String,
      required: false
    },
    isAdmin: {
      type: Boolean,
      required: false
    }
  });
  
  const { $bus } = useNuxtApp() // Use the global event bus
  const { $axios } = useNuxtApp()
  const router = useRouter();
  const route = useRoute();
  
  const title = ref('Survey');
  const page = ref(1);
  const loading = ref(false);
  const answers = ref({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null,
  });
  const successMessage = ref('');
  const errorMessage = ref('');
  
  const questions = computed(() => {
    const found = surveyData.pages.find(e => e.page === page.value);
    return found ? found.questions : [];
  });
  
  const nextPage = () => { page.value = 2 };
  const prevPage = () => { page.value = 1 };
  
  const submitSurvey = async () => {
    successMessage.value = '';
    errorMessage.value = '';
  
    try {
      loading.value = true;
      await $axios.post(props.submitUrl, answers.value);
  
      // Clear responses after submission
      Object.keys(answers.value).forEach((key) => {
        answers.value[key] = null;
      });
  
      // Show success message
      successMessage.value = "Survey submitted successfully!";
      if(!props.isAdmin){
        let storedUser = localStorage.getItem('user')
        storedUser = JSON.parse(storedUser);
        storedUser.has_taken_survey = true
        localStorage.setItem('user', JSON.stringify(storedUser))
        $bus.emit('user-data-updated')
      }
      // Redirect after 2 seconds
      setTimeout(() => {
        loading.value = false;
        router.push('/statistics');
      }, 2000);
    } catch (error) {
      console.error("Error submitting survey:", error);
      errorMessage.value = "Error submitting survey. Please try again.";
    }
  };
  
  onMounted(() => {
    if (props.fetchUrl) {
      fetchIncompleteSurvey();
    }
  });
  
  const fetchIncompleteSurvey = async () => {
    try {
      const response = await $axios.get(props.fetchUrl);
      if (!response.data.no_user_servey) {
        const user = response.data.user;
        title.value = `Complete ${user.name}'s Survey`
        // Fill in existing answers
        Object.keys(answers.value).forEach((e) => {
          answers.value[e] = response.data[e];
        });
      }
    } catch (error) {
      console.error('Error fetching incomplete users:', error);
      errorMessage.value = "Failed to load survey data.";
    }
  };
  </script>
  
  <style scoped>
  .survey-container {
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .question {
    margin-bottom: 1rem;
  }
  
  .question label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: space-between;
  }
  </style>