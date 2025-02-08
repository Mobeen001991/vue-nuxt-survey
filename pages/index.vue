<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello, World!');
</script>

<style scoped>
.hello-world {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-top: 20px;
}
</style>
