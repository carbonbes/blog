import type { Article } from '~/types'

export default function getArticleURL(article: Article) {
  return `/a/${article.id}-${article.title_slug}`
}
