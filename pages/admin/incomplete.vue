<template>
  <div class="row justify-content-center">
    <h1 class="mb-5">Users Without Complete Survey Submission</h1>
    <div class="card">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="goToUserSurvey(user.id)">
                  Complete Survey
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="d-flex justify-content-between align-items-center p-3">
        <button class="btn btn-primary" :disabled="currentPage === 1" @click="prevPage">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="btn btn-primary" :disabled="currentPage === totalPages" @click="nextPage">
          Next
        </button>
      </div>

      <!-- Optional loading indicator -->
      <div v-if="isLoading" class="text-center py-3">
        <span class="spinner-border spinner-border-sm"></span> Loading...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useNuxtApp } from '#imports'

// Attach the 'admin' middleware so only admin users can access this page.
definePageMeta({
  middleware: ['auth', 'admin']
})

const users = ref([]) // Holds users data
const currentPage = ref(1) // Current page number
const totalPages = ref(1) // Total pages from API
const isLoading = ref(false) // Loading state

const router = useRouter()
const { $axios } = useNuxtApp()

// Function to navigate to the survey detail page
const goToUserSurvey = (userId) => {
  router.push(`/admin/survey/${userId}`)
}

// Fetch paginated users with incomplete survey submissions
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await $axios.get(`/admin/incomplete-users?page=${currentPage.value}`)
    
    users.value = response.data.users || []
    totalPages.value = response.data.total_pages || 1 // Ensure correct pagination logic
  } catch (error) {
    console.error('Error fetching incomplete users:', error)
  } finally {
    isLoading.value = false
  }
}

// Pagination functions
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

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.table th {
  background-color: #f8f9fa;
}
.btn-sm {
  padding: 5px 10px;
  font-size: 14px;
}
.text-center {
  text-align: center;
}
</style>
