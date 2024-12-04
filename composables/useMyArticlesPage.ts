import type { Article } from '~/types'

export default function useMyArticlesPage() {
  const pending = useState(() => false)
  const articles = useState<Article[]>(() => [])
  const total = useState(() => 0)

  const { $api } = useNuxtApp()

  const { user } = useUser()

  async function getArticles(page = 1) {
    try {
      pending.value = true

      const r = await $api.getProfileArticles(user.value!.id, page)

      if (!r) return

      articles.value.push(...r.articles)
      total.value = r.total || 0
    } catch (error) {
    } finally {
      pending.value = false
    }
  }

  onUnmounted(() => {
    articles.value = []
    total.value = 0
  })

  return { pending, articles, total, getArticles }
}
