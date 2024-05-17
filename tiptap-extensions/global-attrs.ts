import { Extension } from '@tiptap/core'
import type { NodeType } from '~/types'

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
      types: ['heading', 'paragraph', 'orderedList', 'bulletList'],
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
              if (!attributes.pinned) {
                return {}
              }

              return { 'data-pinned': 'true' }
            },
            parseHTML: (element) => element.getAttribute('data-pinned'),
          },

          spoiler: {
            default: false,
            keepOnSplit: false,
            renderHTML: (attributes) => {
              if (!attributes.spoiler) {
                return {}
              }

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
})

export default globalAttrs
