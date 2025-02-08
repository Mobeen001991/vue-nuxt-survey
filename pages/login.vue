<template>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="mb-4">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
        <!-- Registration Link -->
        <div class="text-center mt-3">
          <p>
            Don't have an account?
            <NuxtLink to="/register">Register here</NuxtLink>
          </p>
        </div>
      </div>
    </div>
 
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useNuxtApp } from '#imports'
const { $bus } = useNuxtApp() // Use the global event bus

// Reactive state for form fields and error message
const email = ref('')
const password = ref('')
const error = ref('')

// Access the Nuxt router and injected Axios instance
const router = useRouter()
const { $axios } = useNuxtApp()

// The login function sends credentials and handles API errors
async function login() {
  try {
    const response = await $axios.post('/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('login_token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    $bus.emit('user-logged-in') // Emit login event
    router.push('/statistics')
  } catch (e) {
    // Check if the error has a response from the API
    if (e.response) {
      error.value =
        e.response.data.message ||
        'Login failed. Please check your credentials.'
    } else if (e.request) {
      error.value = 'No response from the server. Please try again later.'
    } else {
      error.value = 'An error occurred. Please try again.'
    }
  }
}
</script>