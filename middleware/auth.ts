export default defineNuxtRouteMiddleware(async (to) => {
  if (to.name === 'LoginPage') return

  const event = useRequestEvent()
  const { isAuthenticated } = useMe()

  if (!(event?.context.user || isAuthenticated.value))
    return navigateTo('/login', { redirectCode: 401 })
})
