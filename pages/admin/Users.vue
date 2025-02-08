<template>
    <div class="container">
      <h1 class="mb-4">User List</h1>
      <div class="mb-3">
        <strong>Total Users:</strong> {{ total }}
      </div>
      <div class="card">
        <!-- Table with fade transition -->
        <transition name="fade" mode="out-in">
          <div class="table-responsive" key="users-table">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="user.id">
                  <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
  
        <!-- Pagination Controls -->
        <div class="d-flex justify-content-between align-items-center p-3">

<span>Page {{ currentPage }} of {{ totalPages }}</span>
<div>
    <button class="btn btn-primary mx-2" :disabled="currentPage === 1" @click="prevPage">
        Previous
    </button>
    <button class="btn btn-primary" :disabled="currentPage === totalPages" @click="nextPage">
        Next
    </button>
</div>

</div>
  
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="text-center py-3">
          <span class="spinner-border spinner-border-sm"></span> Loading...
        </div>
  
        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useNuxtApp } from '#imports'
  
  const users = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)
  const perPage = 10 // Adjust if necessary
  const isLoading = ref(false)
  const error = ref('')
  
  const router = useRouter()
  const { $axios } = useNuxtApp()
  
  // Middleware is applied via definePageMeta in Nuxt 3:
  definePageMeta({
    middleware: ['auth', 'admin']
  })
  
  // Function to fetch paginated users from the API
  const fetchUsers = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const response = await $axios.get(`/admin/users?page=${currentPage.value}`)
      // Update reactive values based on the API response
      users.value = response.data.users || []
      currentPage.value = response.data.current_page || currentPage.value
      totalPages.value = response.data.total_pages || 1
      total.value = response.data.total || 0
    } catch (err) {
      error.value = 'Failed to load users.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
  
  // Pagination navigation functions
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchUsers()
    }
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchUsers()
    }
  }
  
  // Fetch the initial page of users when the component is mounted
  onMounted(() => {
    fetchUsers()
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  
  /* Fade transition for table */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  