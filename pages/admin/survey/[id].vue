<template>
  <div>
    <SurveyForm
    :submit-url="'/admin/survey/submit/' + route.params.id"
    :fetch-url="'/admin/survey/incomplete/' + route.params.id"
    :is-admin="true"
  />
  </div>
</template>
  
<script setup>;
import { useRoute } from '#imports';
import SurveyForm from '~/components/SurveyForm.vue'
const route = useRoute()
 
</script>
   