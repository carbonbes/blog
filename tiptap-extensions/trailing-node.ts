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

          const lastNodeIsTextBlock = lastNode.content.content[0].isTextblock
          const lastNodeIsEmpty = lastNode.content.content[0].textContent.trim() === ''

          if ((lastNodeIsTextBlock && !lastNodeIsEmpty) || !lastNodeIsTextBlock) {
            return tr.setMeta('addToHistory', false).insert(doc.content.size, nodeType.create())
          }

          return
        },
      }),
    ]
  },
})

export default trailingNode
