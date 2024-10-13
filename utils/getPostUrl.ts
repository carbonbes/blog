import type { Article } from '~/types'

export default function getArticleURL(article: Article) {
  if (article.status === 'draft' || article.status === 'scheduled') {
    return `?dialog=editor&id=${article.id}&title=${article.title_slug}`
  }

  return `/article/${article.id}-${article.title_slug}`
}
