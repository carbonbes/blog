export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    const event = useRequestEvent()

    if (!event?.context.user) {
      return navigateTo('/login', { redirectCode: 401 })
    }
  }

  if (import.meta.client) {
    const { isAuthenticated } = useUser()

    if (!isAuthenticated.value) {
      return navigateTo('/login', { redirectCode: 401 })
    }
  }
})
