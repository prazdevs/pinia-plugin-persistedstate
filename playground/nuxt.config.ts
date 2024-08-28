export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true,
  },
  modules: [
    '@pinia/nuxt',
    '../src/module',
  ],
})
