import type { Article } from '~/types'

export default function getArticleEditorURL(article: Article) {
  return `?dialog=editor&id=${article.id}&title=${article.title_slug}`
}
