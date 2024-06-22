import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import SNEmbed from '~/components/editor/nodes/SNEmbed.vue'

const SNEmbedNode = Node.create({
  name: 'sn-embed',

  priority: 1000,

  group: 'block',

  content: 'block*',

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
      },
      embed: {
        default: null,
      },
      type: {
        default: null
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="sn-embed"]',
      },
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/(?:[0-9]{19})/gi,
        type: this.type,
        getAttributes: (match) => {
          return { url: match[0], type: 'x' }
        },
      }),

      nodePasteRule({
        find: /(?:https?:\/\/)?(?:www\.)?(?:telegram|t)\.me\/(?:[a-zA-Z0-9_-]+)\/?(?:\d+)?\/?/gi,
        type: this.type,
        getAttributes: (match) => {
          return { url: match[0], type: 'telegram' }
        },
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(SNEmbed)
  },
})

export default SNEmbedNode
