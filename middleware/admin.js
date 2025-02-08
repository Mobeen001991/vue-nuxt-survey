// middleware/admin.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) {
    console.log('[Admin Middleware] -Running on server.');
  }
  if (import.meta.client) {
    console.log('[Admin Middleware] Running on client.');
    const userStr = localStorage.getItem('user');
    console.log(userStr)
    let user = null;
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('[Admin Middleware] Error parsing user data:', error);
      //return navigateTo('/');
    }
    console.log(user)
    // If no user or not an admin, redirect to home.
    if (!user || !user.is_admin) {
      console.log('[Admin Middleware] User is not admin or not logged in. Redirecting...');
      // return navigateTo('/');
    }
  }
});
