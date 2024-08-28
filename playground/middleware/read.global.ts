export default defineNuxtRouteMiddleware(() => {
  const cookieStore = useCookieStore()

  // eslint-disable-next-line no-console
  console.log(`From middleware: '${cookieStore.username}'`)
})
