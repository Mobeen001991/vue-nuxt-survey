<template>
  <div>
    <!-- Top Bar / Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">Survey App</a>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav" v-if="user">
            <ClientOnly>
              <!-- Show Survey link if the user hasn't taken the survey -->
              <li class="nav-item active">
                <NuxtLink class="nav-link" v-if="user?.has_taken_survey === false && !user?.is_admin" to="/survey">Survey
                </NuxtLink>
              </li>

              <!-- Show Incomplete Survey only for Admins -->
              <li class="nav-item active">
                <NuxtLink class="nav-link" v-if="user?.is_admin" to="/admin/incomplete">Incomplete Survey</NuxtLink>
              </li>

              <!-- Always show Statistics -->
              <li class="nav-item active">
                <NuxtLink class="nav-link" to="/statistics">Statistics</NuxtLink>
              </li>

              <!-- Welcome message -->
              <li class="nav-item" v-if="user?.name">
                <span class="nav-link">Welcome, {{ user.name }}</span>
              </li>
            </ClientOnly>

            <!-- Logout Button -->
            <li class="nav-item">
              <button class="btn btn-outline-secondary" @click="logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-5">
      <!-- Render the page content -->
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const { $bus } = useNuxtApp() // Use the global event bus

// Reactive user state
const user = ref(null)
const router = useRouter()
// Fetch user from localStorage on mount
const fetchUser = () => {
  try {
    const storedUser = localStorage.getItem('user')
    user.value = storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error parsing user data:', error)
    user.value = null
  }
}
// Fetch user data from localStorage on mount (Client Side Only)
onMounted(() => {
  $bus.on('user-logged-in', fetchUser) // Listen for login event
  $bus.on('user-data-updated', fetchUser) // Listen for login event
  $bus.on('user-logged-out', () => {
    user.value = null
  }) // Listen for logout event
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
    user.value = null
  }
})

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null // Reset user state
  router.push('/login')
}

// Cleanup event listeners when component unmounts
onUnmounted(() => {
  $bus.off('user-logged-in', fetchUser)
  $bus.off('user-logged-out')
})
</script>

<style scoped>
.navbar-nav .nav-link {
  cursor: pointer;
}
</style>
