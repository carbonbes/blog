import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RootNode from '~/components/editor/nodes/root-node/RootNode.vue'

const rootNode = Node.create({
  name: 'rootNode',

  priority: 1000,

  group: 'rootNode',

  content: 'block',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      pin: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.getAttribute('data-pin'),
        renderHTML: (attributes) => {
          if (!attributes.pin) return

          return { 'data-pin': 'true' }
        },
      },

      spoiler: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => element.getAttribute('data-spoiler'),
        renderHTML: (attributes) => {
          if (!attributes.spoiler) return

          return { 'data-spoiler': 'true' }
        },
      },
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

  addStorage() {
    return {
      pinned: 0,
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(RootNode, {
      stopEvent(props) {
        if (
          isTouchDevice() &&
          (props.event.target as HTMLElement).closest(
            '[data-prevent-focus="true"]'
          )
        ) {
          const selection = window.getSelection()

          if (selection) {
            selection.empty()
          }

          props.event.preventDefault()

          return true
        }

        return false
      },
    })
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const {
          selection: { $head, from, to },
          doc,
        } = editor.state

        const parent = $head.node($head.depth - 1)

        if (parent.type.name !== 'rootNode') return false

        const isHeading = $head.parent.type.name.startsWith('heading')
        const isCursorAtEnd = from === to && to === $head.end()

        if (isHeading) {
          const contentAfterCursor = $head.parent.textBetween(
            $head.parentOffset,
            $head.parent.content.size
          )

          if (isCursorAtEnd) {
            return editor
              .chain()
              .insertContentAt({ from, to }, { type: 'paragraph', content: [] })
              .scrollIntoView()
              .focus(to)
              .run()
          } else if (contentAfterCursor.length > 0) {
            const contentBeforeCursor = $head.parent.textBetween(
              0,
              $head.parentOffset
            )

            return editor
              .chain()
              .deleteRange({ from, to: $head.end() })
              .insertContentAt(
                { from, to },
                {
                  type: $head.parent.type.name,
                  attrs: { level: $head.parent.attrs.level },
                  content: [{ type: 'text', text: contentAfterCursor }],
                }
              )
              .scrollIntoView()
              .focus(from + contentBeforeCursor.length)
              .run()
          }
        }

        if ($head.parent.textContent.trim() === '') return false

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
          .scrollIntoView()
          .focus(from + 4)
          .run()
      },
    }
  },
})

export default rootNode
