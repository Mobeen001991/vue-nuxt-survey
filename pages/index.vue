<template>
  <div  >
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Welcome');
</script>

<style scoped>
.hello-world {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-top: 20px;
}
</style>
