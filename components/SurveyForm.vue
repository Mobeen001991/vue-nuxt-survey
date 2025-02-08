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
          <input
            :id="'q' + (i + ((page - 1) * 5))"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': showValidationErrors && invalidFields['q' + (i + 1 + ((page - 1) * 5))] }"
            v-model.number="answers['q' + (i + 1 + ((page - 1) * 5))]"
            v-limit-range
             
          />
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
import surveyData from '~/assets/data/surveyQuestions.json';

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

const { $bus } = useNuxtApp();
const { $axios } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const title = ref('Survey');
const page = ref(1);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Flag to control when validation errors are shown.
const showValidationErrors = ref(false);

// Reactive object for survey responses (questions q1 to q10).
const answers = ref({
  q1: null, q2: null, q3: null, q4: null, q5: null,
  q6: null, q7: null, q8: null, q9: null, q10: null,
});

// Load survey questions from the imported JSON file.
const surveyQuestions = ref(surveyData.pages);

// Compute questions for the current page.
const questions = computed(() => {
  const found = surveyQuestions.value.find(e => e.page === page.value);
  return found ? found.questions : [];
});

// Computed property for invalid fields on the current page (only when validation is active).
const invalidFields = computed(() => {
  const invalid = {};
  // Determine the current page's question range.
  const startIndex = (page.value - 1) * 5 + 1;
  const endIndex = page.value * 5;
  for (let i = startIndex; i <= endIndex; i++) {
    const key = 'q' + i;
    // Mark field as invalid if it's null or an empty string.
    invalid[key] = (answers.value[key] === null || answers.value[key] === '');
  }
  return invalid;
});

// Navigation function to move to next page with validation.
const nextPage = () => {
  // For page 1, required fields are q1 to q5.
  const startIndex = (page.value - 1) * 5 + 1;
  const endIndex = page.value * 5;
  let hasInvalid = false;
  for (let i = startIndex; i <= endIndex; i++) {
    const key = 'q' + i;
    if (answers.value[key] === null || answers.value[key] === '') {
      hasInvalid = true;
    }
  }
  showValidationErrors.value = true;
  if (hasInvalid) {
    errorMessage.value = "Please fill in all required fields on this page.";
    return;
  }
  errorMessage.value = "";
  showValidationErrors.value = false;
  page.value = 2;
};

// Navigation function to go back to the previous page.
const prevPage = () => {
  page.value = 1;
  showValidationErrors.value = false;
};

// Submit the survey after validating page 2.
const submitSurvey = async () => {
  // Validate page 2 required fields (q6 to q10)
  const startIndex = 6;
  const endIndex = 10;
  let hasInvalid = false;
  for (let i = startIndex; i <= endIndex; i++) {
    const key = 'q' + i;
    if (answers.value[key] === null || answers.value[key] === '') {
      hasInvalid = true;
    }
  }
  showValidationErrors.value = true;
  if (hasInvalid) {
    errorMessage.value = "Please fill in all required fields on this page.";
    return;
  }
  
  errorMessage.value = "";
  successMessage.value = "";
  
  try {
    loading.value = true;
    await $axios.post(props.submitUrl, answers.value);
    //showValidationErrors.value = false;
    // Clear responses after submission.
    // Object.keys(answers.value).forEach((key) => {
    //   answers.value[key] = null;
    // });
    
    successMessage.value = "Survey submitted successfully!";
    if (!props.isAdmin) {
      let storedUser = localStorage.getItem('user');
      storedUser = JSON.parse(storedUser);
      storedUser.has_taken_survey = true;
      localStorage.setItem('user', JSON.stringify(storedUser));
      $bus.emit('user-data-updated');
    }
    // Redirect after 2 seconds.
    setTimeout(() => {
      loading.value = false;
      router.push('/statistics');
    }, 2000);
  } catch (error) {
    console.error("Error submitting survey:", error);
    errorMessage.value = error.response.data.message || "Error submitting survey. Please try again.";
  }
};

// Fetch incomplete survey data when the component mounts.
const fetchIncompleteSurvey = async () => {
  try {
    const response = await $axios.get(props.fetchUrl);
    if (!response.data.no_user_servey) {
      const userData = response.data.user;
      title.value = `Complete ${userData.name}'s Survey`;
      // Fill in existing answers if available.
      Object.keys(answers.value).forEach((key) => {
        answers.value[key] = response.data[key];
      });
    }
  } catch (error) {
    console.error('Error fetching incomplete survey data:', error);
    errorMessage.value = "Failed to load survey data.";
  }
};

onMounted(() => {
  if (props.fetchUrl) {
    fetchIncompleteSurvey();
  }
});
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

/* Bootstrap invalid input styling */
.is-invalid {
  border-color: #dc3545 !important;
}
</style>
