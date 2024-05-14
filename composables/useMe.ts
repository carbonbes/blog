import type { Profile } from '~/types'

export default function useMe() {
  const pending = useState('pending', () => false)
  const profile = useState<Profile | null>('profile', () => null)
  const isAuthenticated = useState('is-authenticated', () => false)

  async function getMe() {
    pending.value = true
    const { data, error } = await useAsyncData('me', me)
    pending.value = false

    if (!data.value || error.value) return

    profile.value = data.value?.data!
    isAuthenticated.value = true
  }

  async function logoutMe() {
    try {
      await logout()
      profile.value = null
      isAuthenticated.value = false
    } catch (error) {
      
    }
    
  }

  return { pending, profile, isAuthenticated, getMe, logoutMe }
}
