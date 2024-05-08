export default defineNuxtRouteMiddleware((to) => {
  if (to.name === 'signInPage') return
})
