import { Editor, type Extensions, type JSONContent } from '@tiptap/vue-3'
import Document from '~/tiptap-extensions/document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Focus from '@tiptap/extension-focus'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import InlineSpoiler from '~/tiptap-extensions/inline-spoiler'
import GlobalAttrs from '~/tiptap-extensions/global-attrs'
import Gallery from '~/tiptap-extensions/gallery'

const extensions: Extensions = [
  Document,
  Heading.extend({
    levels: [2, 3],
    marks: 'italic underline strike link inlineSpoiler',
    addAttributes() {
      return {
        level: {
          default: 2,
          rendered: false,
        },
      }
    },
  }),
  Paragraph,
  Text,
  ListItem.extend({
    content: 'paragraph',
  }),
  BulletList,
  OrderedList,
  Bold,
  Italic,
  Strike,
  Underline,
  Link,
  Focus.configure({
    className: 'focused',
    mode: 'shallowest',
  }),
  History,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'Заголовок'
      }

      return 'Текст'
    },
  }),
  Dropcursor,
  InlineSpoiler,
  GlobalAttrs,
  Gallery,
]

export default function useEditor() {
  const editor = useState<Editor | undefined>('editor')
  const data = useState<JSONContent | undefined>('data')
  const selectionIsEmpty = useState('empty-selection', () => true)
  const selectionRect = useState('selection-rect')

  const { rects } = useTextSelection()

  function initEditor(content?: JSONContent) {
    editor.value = new Editor({
      content,

      extensions,

      onUpdate({ editor }) {
        const content = editor.getJSON() as JSONContent[]
        data.value = processContent(content)
      },

      onSelectionUpdate({
        editor: {
          state: {
            selection: { empty },
          },
        },
      }) {
        selectionIsEmpty.value = !empty

        selectionRect.value = {
          getBoundingClientRect() {
            return rects.value[0]
          },
        }
      },
    })
  }

  function destroyEditor() {
    editor.value?.destroy()
  }

  function processContent(content: JSONContent) {
    const arr = content.content?.filter((node) => {
      if (node.type !== 'gallery') return Object.hasOwn(node, 'content')
      else if (node.type === 'gallery') return !!node.attrs?.images.length
    })

    if (!arr?.length) return

    return { type: 'doc', content: arr }
  }

  return {
    initEditor,
    destroyEditor,
    processContent,
    editor,
    extensions,
    data,
    selectionIsEmpty,
    selectionRect,
  }
}
