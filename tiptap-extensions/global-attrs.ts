import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { NodeType } from '~/types'
import Pin from '~icons/tabler/pin?raw'
import EyeOff from '~icons/tabler/eye-off?raw'

export interface GlobalAttrsOptions {
  types: NodeType[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      pin: () => ReturnType
      unpin: () => ReturnType
      togglePin: () => ReturnType
      setSpoiler: () => ReturnType
      unsetSpoiler: () => ReturnType
      toggleSpoiler: () => ReturnType
    }
  }
}

const globalAttrs = Extension.create<GlobalAttrsOptions>({
  name: 'globalAttrs',

  addOptions() {
    return {
      types: [
        'heading',
        'paragraph',
        'orderedList',
        'bulletList',
        'gallery',
        'socialNetworkEmbed',
        'delimiter',
      ],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,

        attributes: {
          pin: {
            default: false,
            keepOnSplit: false,
            renderHTML: (attributes) => {
              if (!attributes.pinned) return {}

              return { 'data-pin': 'true' }
            },
            parseHTML: (element) => element.getAttribute('data-pin'),
          },

          spoiler: {
            default: false,
            keepOnSplit: false,
            renderHTML: (attributes) => {
              if (!attributes.spoiler) return {}

              return { 'data-spoiler': 'true' }
            },
            parseHTML: (element) => element.getAttribute('data-spoiler'),
          },
        },
      },
    ]
  },

  addStorage() {
    return {
      pinned: 0,
      spoilered: 0,
    }
  },

  addCommands() {
    return {
      pin:
        () =>
        ({ editor, tr, state }) => {
          const { anchor } = state.selection

          const node = tr.doc.nodeAt(anchor)

          if (!node) return false

          const attrs = {
            ...node.attrs,
            pin: true,
          }

          tr.setNodeMarkup(anchor, undefined, attrs)
          editor.view.dispatch(tr)

          return true
        },

      unpin:
        () =>
        ({ editor, tr, state }) => {
          const { anchor } = state.selection

          const node = tr.doc.nodeAt(anchor)

          if (!node) return false

          const attrs = {
            ...node.attrs,
            pin: false,
          }

          tr.setNodeMarkup(anchor, undefined, attrs)
          editor.view.dispatch(tr)

          return true
        },

      togglePin:
        () =>
        ({ commands, editor, tr, state }) => {
          // const { anchor } = state.selection

          // const node = tr.doc.nodeAt(anchor - 1)

          // if (!node) return false

          // return editor.chain()
          //   .focus()
          //   .updateAttributes({
          //     pin: true
          //   })
          //   .run()

          return this.options.types.every((type) =>
            commands.updateAttributes(type, { pin: true })
          )
        },

      setSpoiler:
        () =>
        ({ editor, tr, state }) => {
          const { anchor } = state.selection

          const node = tr.doc.nodeAt(anchor)

          if (!node) return false

          const attrs = {
            ...node.attrs,
            spoiler: true,
          }

          tr.setNodeMarkup(anchor, undefined, attrs)
          editor.view.dispatch(tr)

          return true
        },

      unsetSpoiler:
        () =>
        ({ editor, tr, state }) => {
          const { anchor } = state.selection

          const node = tr.doc.nodeAt(anchor)

          if (!node) return false

          const attrs = {
            ...node.attrs,
            spoiler: false,
          }

          tr.setNodeMarkup(anchor, undefined, attrs)
          editor.view.dispatch(tr)

          return true
        },

      toggleSpoiler:
        () =>
        ({ editor, tr, state }) => {
          const { anchor } = state.selection

          const node = tr.doc.nodeAt(anchor)

          if (!node) return false

          const attrs = {
            ...node.attrs,
            spoiler: !node.attrs.spoiler,
          }

          tr.setNodeMarkup(anchor, undefined, attrs)
          editor.view.dispatch(tr)

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name)

    return [
      new Plugin({
        key: plugin,

        props: {
          decorations(state) {
            const decorations: Decoration[] = []

            state.doc.descendants((node) => {
              if (node.attrs.pin || node.attrs.spoiler) {
                const indicators = document.createElement('div')
                indicators.className = 'indicators'

                if (node.attrs.pin) {
                  const container = document.createElement('div')
                  container.innerHTML = Pin as unknown as string
                  indicators.appendChild(container.firstElementChild as Node)
                }

                if (node.attrs.spoiler) {
                  const container = document.createElement('div')
                  container.innerHTML = EyeOff as unknown as string
                  indicators.appendChild(container.firstElementChild as Node)
                }

                const decos = Decoration.widget(node.nodeSize - 1, () => {
                  return indicators
                })

                decorations.push(decos)
              }
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})

export default globalAttrs
