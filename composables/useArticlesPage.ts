import type { Article } from '~/types'

export default function useArticlesPage() {
  const pending = useState(() => false)
  const articles = useState<Article[]>(() => [])

  const { $api } = useNuxtApp()

  const { user } = useUser()

  async function getProfileArticles(page = 1) {
    try {
      pending.value = true

      const r = await $api.getProfileArticles(user.value!.id, page)

      if (!r) return

      articles.value.push(...r)
    } catch (error) {
    } finally {
      pending.value = false
    }
  }

  onUnmounted(() => (articles.value = []))

  return { pending, articles, getProfileArticles }
}
