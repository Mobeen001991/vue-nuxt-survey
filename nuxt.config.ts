// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  runtimeConfig: {
    public: {
      // Set your Laravel API base URL here (or via an environment variable)
      axiosBaseURL: process.env.API_BASE_URL || 'https://ainewsblog.org/public/api'
    }
  }
})
