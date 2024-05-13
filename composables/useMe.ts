import type { Profile } from '~/types'

export default function useMe() {
  const pending = useState('pending', () => false)
  const profile = useState<Profile | null>('profile', () => null)
  const isAuthenticated = computed(() => !!profile.value)

  async function getMe() {
    pending.value = true
    const { data, error } = await useAsyncData('me', me)
    pending.value = false

    if (!data.value || error.value) return

    profile.value = data.value?.data!
  }

  async function logoutMe() {
    await logout()
  }

  return { pending, profile, isAuthenticated, getMe, logoutMe }
}
