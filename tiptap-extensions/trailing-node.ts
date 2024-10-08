import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Plugin } from 'prosemirror-state'

const trailingNode = Extension.create({
  name: 'trailing-node',

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const nodeType = this.editor.schema.nodes.paragraph

    return [
      new Plugin({
        key: plugin,

        appendTransaction(transactions, oldState, newState) {
          const { doc, tr } = newState
          const lastNode = doc.lastChild

          if (!lastNode) return

          const lastNodeIsNotTextBlock = !lastNode.content.content[0].isTextblock
          const lastNodeIsTextBlock = lastNode.content.content[0].isTextblock
          const lastNodeIsNotEmpty = lastNode.content.content[0].textContent.trim() !== ''

          if ((lastNodeIsTextBlock && lastNodeIsNotEmpty) || lastNodeIsNotTextBlock) {
            return tr.insert(doc.content.size, nodeType.create())
          }

          return
        },
      }),
    ]
  },
})

export default trailingNode
