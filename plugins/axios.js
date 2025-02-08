// plugins/axios.js
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  // Access the public runtime config
  const config = useRuntimeConfig();

  // Create an Axios instance
  const axiosInstance = axios.create({
    baseURL: config.public.axiosBaseURL,
    withCredentials: true, // Enable credentials for Laravel Sanctum if needed
  });

  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      // Check if the request URL is NOT for login or register.
      if (
        requestConfig.url &&
        !requestConfig.url.includes('/login') &&
        !requestConfig.url.includes('/register')
      ) {
        // Retrieve the token from localStorage (adjust if you use a different storage method)
        const token = localStorage.getItem('login_token');
        if (token) {
          // Attach the token to the Authorization header.
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );
  // Optional: Add an interceptor for response errors
  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      console.error('Axios error:', error);
      return Promise.reject(error);
    }
  );

  // Inject the Axios instance so it can be accessed as $axios in your components
  nuxtApp.provide('axios', axiosInstance);
});
