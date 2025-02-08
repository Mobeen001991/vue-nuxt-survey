<template>
  <div class="">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="mb-4">Register</h1>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Enter your name"
              class="form-control"
              required
            />
          </div>
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
          <div class="mb-3">
            <label for="password_confirmation" class="form-label">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              v-model="password_confirmation"
              type="password"
              placeholder="Confirm your password"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success mt-3">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useNuxtApp } from '#imports'
const { $bus } = useNuxtApp() // Use the global event bus
// Reactive state for the form fields and messages
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')
const error = ref('')
const success = ref('')

// Access the Nuxt router and the injected Axios instance
const router = useRouter()
const { $axios } = useNuxtApp()

// The register function submits the form data to your Laravel API
async function register() {
  error.value = ''
  success.value = ''

  try {
    const response = await $axios.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    // Store the token and user data 
    localStorage.setItem('login_token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    $bus.emit('user-logged-in') // Emit login event
    success.value = response.message || 'Registration successful! Please log in.'
    
    router.push('/survey')
  } catch (e) {
    console.error(e)
    // Handle errors returned by the API
    if (e.response && e.response.data) {
      error.value = e.response.data.message || 'Registration failed. Please check your input.'
    } else {
      error.value = 'An error occurred during registration.'
    }
  }
}
</script>
