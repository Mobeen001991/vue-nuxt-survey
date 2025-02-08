import mitt from 'mitt'

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt() // Create a new event emitter
  nuxtApp.provide('bus', emitter) // Inject it globally
})
