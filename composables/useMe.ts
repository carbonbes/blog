import type { Profile } from '~/types'

export default function useMe() {
  const pending = useState('pending', () => false)
  const user = useState<Profile | null>('user', () => null)
  const isAuthenticated = useState('is-authenticated', () => false)

  async function getMe() {
    pending.value = true
    const { data, error } = await useAsyncData('me', me)
    pending.value = false

    if (!data.value || error.value) return

    user.value = data.value.data!
    isAuthenticated.value = true
  }

  async function logoutMe() {
    try {
      await logout()
      user.value = null
      isAuthenticated.value = false
      await navigateTo('/login')
    } catch (error) {
      
    }
  }

  return { pending, user, isAuthenticated, getMe, logoutMe }
}
