import type { Article } from '~/types'

export default function useArticlePage() {
  const article = useState<Article | undefined>()
  const pending = useState(() => false)

  const { $api } = useNuxtApp()

  async function getArticle(id: number) {
    try {
      pending.value = true

      article.value = await $api.getArticle(id)
    } catch (error) {
    } finally {
      pending.value = false
    }
  }

  return { article, pending, getArticle }
}
