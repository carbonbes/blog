import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { Plugin } from 'prosemirror-state'
import { TextSelection } from 'prosemirror-state'

const trailingNode = Extension.create({
  name: 'trailing-node',

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)
    const nodeType = this.editor.schema.nodes.paragraph

    return [
      new Plugin({
        key: plugin,

        props: {
          handleClick: (view, pos, event) => {
            const { state, dispatch } = view
            const { doc } = state
            const lastNode = doc.lastChild

            if (!lastNode) return false

            const lastNodeDOM = view.nodeDOM(
              doc.content.size - lastNode.nodeSize
            ) as HTMLElement | null

            if (!lastNodeDOM) return false

            if (lastNodeDOM) {
              const lastNodeRect = lastNodeDOM.getBoundingClientRect()
              const clickY = event.clientY

              if (clickY > lastNodeRect.bottom) {
                console.log(lastNode)

                if (
                  (lastNode.content.content[0].isTextblock &&
                    lastNode.content.content[0].textContent.trim() !== '') ||
                  !lastNode.content.content[0].isTextblock
                ) {
                  const tr = state.tr.insert(
                    doc.content.size,
                    nodeType.create()
                  )
                  const newPos = tr.doc.content.size - 1
                  tr.setSelection(TextSelection.near(tr.doc.resolve(newPos)))
                  dispatch(tr)

                  return true
                }
              }
            }

            return false
          },
        },
      }),
    ]
  },
})

export default trailingNode
