import { Mark, mergeAttributes } from '@tiptap/core'

interface InlineSpoilerOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineSpoiler: {
      toggleInlineSpoiler: () => ReturnType
    }
  }
}

const inlineSpoiler = Mark.create<InlineSpoilerOptions>({
  name: 'inlineSpoiler',

  priority: 1000,

  group: 'inline',

  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="inline-spoiler"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'inline-spoiler',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      toggleInlineSpoiler:
        () =>
        ({ chain }) => {
          return chain().focus().toggleMark(this.name).run()
        },
    }
  },
})

export default inlineSpoiler
