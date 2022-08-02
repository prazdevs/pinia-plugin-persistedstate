import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore'] }],
  ],
})
