import type { Article } from '~/types'

export function useEditorDialogArticle() {
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

  async function newArticle() {

  }

  return { pending, article, requestArticle, newArticle }
}
