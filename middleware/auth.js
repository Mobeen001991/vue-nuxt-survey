// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
  // Check if the route requires auth via meta property.
  // Since this code runs on the client, check localStorage
  if (import.meta.client) {
    const token = localStorage.getItem('login_token');
    if (!token) {
      return navigateTo('/login')
    }
  }
})
