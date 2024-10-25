import { ArticleBody } from '~/schema/articleBodySchema'

export default function getArticleTitle(body: ArticleBody) {
  const firstRootChild = body.content[0]

  const [node] = firstRootChild.content

  if (node.type === 'heading' || node.type === 'paragraph') {
    return node.content.map((textNode) => textNode.text).join('')
  }
}
