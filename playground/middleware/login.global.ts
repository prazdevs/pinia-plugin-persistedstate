export default defineNuxtRouteMiddleware((to) => {
  const tokenStore = useTokenStore()

  if (!tokenStore.token && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (tokenStore.token && to.path === '/login') {
    return navigateTo('/page')
  }
})
