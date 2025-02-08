<template>
  <div>
    <!-- Top Bar / Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <NuxtLink to="/">Survey App
        </NuxtLink>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav" v-if="user">
            <ClientOnly>
              <!-- Nav Items --->
              <li v-for="item in filteredNavItems" :key="item.route" class="nav-item">
                <NuxtLink class="nav-link" :to="item.route">
                  {{ item.label }}
                </NuxtLink>
              </li>
              <!-- Welcome message -->
              <li class="nav-item" v-if="user?.name">
                <span>Welcome, {{ user.name }}</span>
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
import navItems from '~/assets/data/navItems.json'
const { $bus } = useNuxtApp() // Use the global event bus

// Reactive user state
const user = ref(null)
const router = useRouter()
// Computed property to filter nav items based on user state
const filteredNavItems = computed(() => {
  return navItems.filter((item) => {
    // If item is admin only, show only if user is admin
    if (item.is_admin && !(user.value && user.value.is_admin)) {
      return false;
    }
    // If the condition is "always" or not provided, show it
    return true;
  })
})
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
  localStorage.removeItem('login_token')
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
.navbar-nav li {
  margin-left: 10px;
}

.navbar-nav .nav-link {
  cursor: pointer;
  border-bottom: 1px solid #ccc;
  padding: 4px;
  padding-left: 7px;
  /* border-radius: 5px; */
  padding-right: 7px;
}

.router-link-active {
  border-bottom-color: #3480ec !important;
  color: #3480ec;
}
</style>
