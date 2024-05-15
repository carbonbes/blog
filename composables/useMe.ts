import type { Profile } from '~/types'

export default function useMe() {
  const pending = useState('pending', () => false)
  const profile = useState<Profile | null>('profile', () => null)
  const isAuthenticated = useState('is-authenticated', () => false)

  async function getMe() {
    pending.value = true

    try {
      const { data } = await me()

      profile.value = data!
      isAuthenticated.value = true
    } catch (error) {

    } finally {
      pending.value = false
    }
  }

  async function logoutMe() {
    try {
      await logout()
      profile.value = null
      isAuthenticated.value = false
      await navigateTo('/login')
    } catch (error) {
      
    }
    
  }

  return { pending, profile, isAuthenticated, getMe, logoutMe }
}
