import { ArticleBody } from '~/schema/articleBodySchema'

export default function findTitle(content: ArticleBody) {
  for (const rootNode of content.content) {
    if (rootNode.type === 'rootNode' && rootNode.content) {
      for (const child of rootNode.content) {
        if (child.type === 'heading' || child.type === 'paragraph') {
          if (child.content) {
            for (const innerChild of child.content) {
              if (innerChild.type === 'text' && innerChild.text) {
                return innerChild.text
              }
            }
          }

          return
        }
      }
    }
  }
}
