import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import YoutubeEmbed from '~/components/editor/nodes/YoutubeEmbed.vue'

const YoutubeEmbedNode = Node.create({
  name: 'youtube-embed',

  priority: 1000,

  group: 'block',

  content: 'block*',

  atom: true,

  addAttributes() {
    return {
      video_id: {
        default: null,
      },
      thumbnail: {
        defult: null
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

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'youtube-embed' })]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z-_0-9]+)/gi,
        type: this.type,
        getAttributes: (match) => {
          return {
            video_id: match[1],
            thumbnail: `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
          }
        },
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(YoutubeEmbed)
  },
})

export default YoutubeEmbedNode
