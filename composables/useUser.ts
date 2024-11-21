import type { Profile } from '~/types'

export default function useUser() {
  const pending = useState('pending', () => false)
  const user = useState<Profile | null>('user', () => null)
  const isAuthenticated = useState('is-authenticated', () => false)

  const { $api } = useNuxtApp()

  async function getMe() {
    pending.value = true
    const r = await $api.me()
    pending.value = false

    if (!r) return

    user.value = r
    isAuthenticated.value = true
  }

  async function logout() {
    try {
      await $api.logout()
      user.value = null
      isAuthenticated.value = false
      await navigateTo('/login')
    } catch (error) {}
  }

  return { pending, user, isAuthenticated, getMe, logout }
}
