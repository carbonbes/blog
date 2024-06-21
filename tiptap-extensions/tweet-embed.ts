import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import TweetEmbed from '~/components/editor/nodes/TweetEmbed.vue'

const Tweet = Node.create({
  name: 'tweet-embed',

  priority: 1000,

  group: 'block',

  content: 'block*',

  atom: true,

  addAttributes() {
    return {
      tweetUrl: {
        default: null,
      },
      tweet: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="tweet-embed"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'tweet-embed' }),
      0,
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /(?:https?:\/\/)?(?:www\.)?(?:twitter|x)\.com\/.+\/(?:[0-9]{19})/gi,
        type: this.type,
        getAttributes: (match) => {
          return { tweetUrl: match[0] }
        },
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(TweetEmbed)
  },
})

export default Tweet
