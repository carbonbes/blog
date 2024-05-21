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
      pinned: () => ReturnType
      unpinned: () => ReturnType
      setSpoiler: () => ReturnType
      unsetSpoiler: () => ReturnType
    }
  }
}

const globalAttrs = Extension.create<GlobalAttrsOptions>({
  name: 'globalAttrs',

  addOptions() {
    return {
      types: ['heading', 'paragraph', 'orderedList', 'bulletList', 'gallery', 'socialNetworkEmbed'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,

        attributes: {
          pinned: {
            default: false,
            keepOnSplit: false,
            renderHTML: (attributes) => {
              if (!attributes.pinned) return {}

              return { 'data-pinned': 'true' }
            },
            parseHTML: (element) => element.getAttribute('data-pinned'),
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

  addCommands() {
    return {
      pinned:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { pinned: true })
          )
        },

      unpinned:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { pinned: false })
          )
        },

      setSpoiler:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { spoiler: true })
          )
        },

      unsetSpoiler:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { spoiler: false })
          )
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
              if (node.attrs.pinned || node.attrs.spoiler) {
                const indicators = document.createElement('div')
                indicators.className = 'indicators'

                if (node.attrs.pinned) {
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
      })
    ]
  },
})

export default globalAttrs
