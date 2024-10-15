import type { Article } from '~/types'

export function useArticle() {
  const pending = useState(() => false)
  const article = useState<Article | null | undefined>()

  async function requestArticle(id: number) {
    try {
      pending.value = true

      article.value = await getArticle(id)
    } catch (error) {
    } finally {
      pending.value = false
    }
  }

  return { pending, article, requestArticle }
}
