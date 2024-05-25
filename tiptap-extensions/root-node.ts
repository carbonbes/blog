import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RootNode from '~/components/editor/nodes/root-node/RootNode.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    rootNode: {
      setRootNode: (pos?: number) => ReturnType
    }
  }
}

const rootNode = Node.create({
  name: 'rootNode',

  priority: 1000,

  group: 'rootNode',

  content: 'block',

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="root-node"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setRootNode:
        (pos) =>
        ({ state, chain }) => {
          const {
            selection: { from },
          } = state

          const position = pos !== undefined || pos !== null ? from : pos

          return chain()
            .insertContentAt(position, {
              type: this.name,
              content: [
                {
                  type: 'paragraph',
                },
              ],
            })
            .focus(position + 2)
            .run()
        },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(RootNode)
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setRootNode(),

      Enter: ({ editor }) => {
        const {
          selection: { $head, from, to },
          doc,
        } = editor.state

        const parent = $head.node($head.depth - 1)

        if (parent.type.name !== 'rootNode') return false

        let currentActiveNodeTo = -1

        doc.descendants((node, pos) => {
          if (currentActiveNodeTo !== -1) return false
          if (node.type.name === this.name) return

          const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

          if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo

          return false
        })

        const content = doc.slice(from, currentActiveNodeTo)?.toJSON().content

        return editor
          .chain()
          .insertContentAt(
            { from, to: currentActiveNodeTo },
            {
              type: this.name,
              content,
            }
          )
          .focus(from + 4)
          .run()
      },
    }
  },
})

export default rootNode
