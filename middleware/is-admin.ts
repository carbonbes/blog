export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    const event = useRequestEvent()

    if (event?.context.user && event?.context.user?.role !== 'admin') {
      return navigateTo('/', { redirectCode: 401 })
    }
  }

  if (import.meta.client) {
    const { isAuthenticated, user } = useUser()

    if (isAuthenticated.value && user.value?.role !== 'admin') {
      return navigateTo('/', { redirectCode: 401 })
    }
  }
})
