// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
 
  if (import.meta.client) { 
    const userStr = localStorage.getItem('user'); 
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('[Admin Middleware] Error parsing user data:', error);
      return navigateTo('/');
    } 
    // If no user or not an admin, redirect to home.
    if (!user || !user.is_admin) { 
      return navigateTo('/');
    }
  }
});
