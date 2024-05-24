import { Extension } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
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
      togglePin: () => ReturnType
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
    }
  },

  addCommands() {
    return {
      togglePin:
        () =>
        ({ tr, state: { selection }, editor: { view } }) => {
          const nodeSelection = selection as NodeSelection | null

          if (!nodeSelection) return false

          const node = nodeSelection.node

          const value = node.attrs.pin ? false : true

          if (value && this.storage.pinned === 2) return false

          node.attrs.pin = value

          tr.replaceWith(selection.from, selection.to, node)
          view.dispatch(tr)

          if (value) this.storage.pinned += 1
          else this.storage.pinned -= 1

          return true
        },

      toggleSpoiler:
        () =>
        ({ tr, state: { selection }, editor: { view } }) => {
          const nodeSelection = selection as NodeSelection | null

          if (!nodeSelection) return false

          const node = nodeSelection.node

          node.attrs.spoiler = !node.attrs.spoiler

          tr.replaceWith(selection.from, selection.to, node)
          view.dispatch(tr)

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

            state.doc.descendants((node, pos) => {
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

                const decos = Decoration.widget(pos + 1, () => {
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
