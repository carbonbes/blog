import { Editor, Node, mergeAttributes } from '@tiptap/core'
import type { ResolvedPos } from '@tiptap/pm/model'
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
    function handleHeadingEnter(
      $head: ResolvedPos,
      from: number,
      to: number,
      editor: Editor
    ): boolean {
      const isHeading = $head.parent.type.name.startsWith('heading')
      const isCursorAtEnd = from === to && to === $head.end()

      if (!isHeading) return false

      const contentAfterCursor = $head.parent.textBetween(
        $head.parentOffset,
        $head.parent.content.size
      )

      if (isCursorAtEnd) {
        editor
          .chain()
          .insertContentAt({ from, to }, { type: 'paragraph', content: [] })
          .scrollIntoView()
          .focus(to)
          .run()

        return true
      } else if (contentAfterCursor.length > 0) {
        const contentBeforeCursor = $head.parent.textBetween(
          0,
          $head.parentOffset
        )

        editor
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

        return true
      }

      return false
    }

    function moveCursorToNextEmptyNode(
      doc: Editor['state']['doc'],
      from: number,
      editor: Editor
    ): boolean {
      let nextNodePos: number | null = null

      doc.descendants((node, pos) => {
        if (pos > from && node.type.name === 'rootNode') {
          nextNodePos = pos

          return false
        }
        return true
      })

      if (nextNodePos !== null) {
        const nextNode = doc.nodeAt(nextNodePos)

        if (nextNode && nextNode.textContent.trim() === '') {
          editor
            .chain()
            .focus(nextNodePos + 2)
            .run()

          return true
        }
      }

      return false
    }

    const insertContentAfterCurrentNode = (
      doc: Editor['state']['doc'],
      from: number,
      to: number,
      editor: Editor
    ) => {
      let currentActiveNodeTo = -1

      doc.descendants((node, pos) => {
        if (currentActiveNodeTo !== -1) return false

        if (node.type.name === this.name) return false

        const [nodeFrom, nodeTo] = [pos, pos + node.nodeSize]

        if (nodeFrom <= from && to <= nodeTo) currentActiveNodeTo = nodeTo

        return false
      })

      const content = doc.slice(from, currentActiveNodeTo)?.toJSON().content

      editor
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

      return true
    }

    return {
      Enter: ({ editor }) => {
        const {
          selection: { $head, from, to },
          doc,
        } = editor.state

        const parent = $head.node($head.depth - 1)
        if (parent?.type.name !== 'rootNode') return false

        if ($head.parent.textContent.trim() === '') return false

        if (handleHeadingEnter($head, from, to, editor)) {
          return true
        }

        if (moveCursorToNextEmptyNode(doc, from, editor)) {
          return true
        }

        return insertContentAfterCurrentNode(doc, from, to, editor)
      },
    }
  },
})

export default rootNode
