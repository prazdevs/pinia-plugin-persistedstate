export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '../src/module',
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: true,
    },
  },
})
