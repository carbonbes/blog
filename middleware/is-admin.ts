export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    const event = useRequestEvent()

    if (event?.context.user && event?.context.user?.role !== 'admin') {
      return navigateTo('/login', { redirectCode: 401 })
    }
  }

  if (import.meta.client) {
    const { isAuthenticated, user } = useUser()

    if (isAuthenticated.value && user.value?.role !== 'admin') {
      return navigateTo('/login', { redirectCode: 401 })
    }
  }
})
