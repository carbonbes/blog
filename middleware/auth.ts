export default defineNuxtRouteMiddleware(async (to) => {
  if (to.name === 'LoginPage') return

  const event = useRequestEvent()
  const { isAuthenticated } = useUser()

  if (!(event?.context.user || isAuthenticated.value))
    return navigateTo('/login', { redirectCode: 401 })
})
