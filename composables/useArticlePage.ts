import type { Article } from '~/types'
import { getArticle as _getArticle } from '~/utils/api'

export default function useArticlePage() {
  const article = useState<Article | null | undefined>()
  const pending = useState(() => false)

  async function getArticle(id: number) {
    try {
      pending.value = true

      article.value = await _getArticle(id)
    } catch (error) {
    } finally {
      pending.value = false
    }
  }

  return { article, pending, getArticle }
}
