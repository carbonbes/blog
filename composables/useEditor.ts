import { Editor, type Extensions, type JSONContent } from '@tiptap/vue-3'
import { NodeSelection } from '@tiptap/pm/state'
import type { HeadingLevel, NodeType } from '~/types'
import Document from '~/tiptap-extensions/document'
import RootNode from '~/tiptap-extensions/root-node'
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
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import InlineSpoiler from '~/tiptap-extensions/inline-spoiler'
import Gallery from '~/tiptap-extensions/gallery'
import TrailingNode from '~/tiptap-extensions/trailing-node'
import Delimiter from '@tiptap/extension-horizontal-rule'
import SNEmbed from '~/tiptap-extensions/social-network-embed'
import YoutubeEmbed from '~/tiptap-extensions/youtube-embed'

const extensions: Extensions = [
  Document,
  RootNode,
  Heading.extend({
    levels: [1, 2],
    marks: 'italic underline strike link inlineSpoiler',
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
  Gallery,
  TrailingNode,
  Delimiter,
  SNEmbed,
  YoutubeEmbed,
]

export default function useEditor() {
  const editor = useState<Editor | undefined>('editor')
  const data = useState<JSONContent | undefined>('data')
  const selectedNode = useState<NodeSelection['node'] | null>('selected-node', () => null)
  const selectionIsEmpty = useState('empty-selection', () => true)
  const selectionRect = useState('selection-rect')

  const selectedNodeAttrs = computed(() => selectedNode.value?.attrs)
  const selectedNodeType = computed(() => selectedNode.value?.content.content[0].type.name as NodeType)

  const selectedNodePos = computed(() => {
    if (!selectedNode.value) return null
  
    const { selection } = editor.value?.state!
    
    return {
      from: (selection as NodeSelection).from,
      to: (selection as NodeSelection).to
    }
  })

  const selectedNodeNeighbors = computed(() => {
    if (!selectedNode.value) return null

    const { doc } = editor.value?.state!
  
    const startPos = selectedNodePos.value?.from!
    const endPos = selectedNodePos.value?.to!
  
    let prevNode = null
    let nextNode = null
  
    if (startPos > 0) prevNode = doc.resolve(startPos).nodeBefore
    if (endPos < doc.content.size) nextNode = doc.resolve(endPos).nodeAfter
  
    return { prevNode, nextNode }
  })

  function setNodeSelection(pos: number) {
    editor.value?.commands.setNodeSelection(pos)
    selectedNode.value = (editor.value?.state.selection as NodeSelection).node
  }

  function toggleNodeAttribute(attr: 'pin' | 'spoiler') {
    const tr = editor.value?.view.state.tr!
    const dispatch = editor.value?.view.dispatch!

    tr.setNodeMarkup(selectedNodePos.value?.from!, null, {
      ...selectedNode.value?.attrs,
      [attr]: !selectedNode.value?.attrs[attr]
    })

    dispatch(tr)
  }

  function insertNode(type: NodeType, level?: HeadingLevel) {
    let content: JSONContent[] | undefined
  
    if (['bulletList', 'orderedList'].includes(type)) {
      content = [{ type: 'listItem', content: [{ type: 'paragraph', content: [] }] }]
    }
  
    editor.value?.chain().insertContentAt(selectedNodePos.value!.to, { type, attrs: { level }, content }).focus().run()
  }

  function moveNode(direction: 'up' | 'down') {
    const dispatch = editor.value?.view.dispatch!
    const tr = editor.value!.state.tr

    const { nodeSize: selectedNodeSize } = selectedNode.value!
    const { from: selectedNodeStartPos, to: selectedNodeEndPos } = selectedNodePos.value!
    const { prevNode, nextNode } = selectedNodeNeighbors.value!
    
    if (direction === 'up') {
      if (!prevNode) return

      const prevNodeSize = prevNode.nodeSize
      const previousNodeStartPos = selectedNodeStartPos - prevNodeSize
      const previousNodeEndPos = selectedNodeStartPos

      tr
        .delete(previousNodeStartPos, previousNodeEndPos)
        .insert(selectedNodeStartPos - prevNodeSize + selectedNodeSize, prevNode)
        .scrollIntoView()
    } else {
      if (!nextNode) return

      const nextNodeSize = nextNode.nodeSize
      const nextNodeStartPos = selectedNodeEndPos
      const nextNodeEndPos = selectedNodeEndPos + nextNodeSize

      tr
        .delete(nextNodeStartPos, nextNodeEndPos)
        .insert(selectedNodeStartPos, nextNode)
        .scrollIntoView()
    }

    dispatch(tr)
  }

  function removeNode() {
    const { dispatch } = editor.value?.view!
    const tr = editor.value!.state.tr

    dispatch(tr.delete(selectedNodePos.value?.from!, selectedNodePos.value?.to!))
  }

  function changeNodeType({
    type,
    level = 2,
  }: {
    type: NodeType
    level?: HeadingLevel
  }) {
    if (type === 'heading')
      editor.value?.chain().focus(selectedNodePos.value!.from + 3).toggleHeading({ level }).run()
    
    else if (type === 'paragraph') {
      editor.value?.commands.focus(selectedNodePos.value!.from + 3)
  
      if (editor.value?.isActive('bulletList') || editor.value?.isActive('orderedList')) {
        const { state } = editor.value
        const { doc } = state
        const resolvedPos = doc.resolve(selectedNodePos.value!.from + 1)
  
        resolvedPos.nodeAfter?.descendants((node) => {
          if (node.type.name === 'listItem') {
            editor.value?.chain().focus().liftListItem('listItem').run()
          }
  
          return false
        })
      } else {
        editor.value?.chain().focus(selectedNodePos.value!.from + 3).setParagraph().run()
      }
    }
  
    else if (type === 'bulletList')
      editor.value?.chain().focus(selectedNodePos.value!.from + 3).toggleBulletList().run()
  
    else if (type === 'orderedList')
      editor.value?.chain().focus(selectedNodePos.value!.from + 3).toggleOrderedList().run()
  
    editor.value?.commands.blur()
  }

  const { rects } = useTextSelection()

  function initEditor(content?: JSONContent) {
    editor.value = new Editor({
      content,

      extensions,

      editorProps: {
        handleClickOn(view, pos, node, nodePos, event, direct) {
          if (['sn-embed'].includes(node.type.name)) {
            editor.value?.commands.blur()

            return true
          }

          return false
        },
      },

      onUpdate({ editor }) {
        const content = editor.getJSON() as JSONContent[]
        data.value = processContent(content)
      },

      onSelectionUpdate({
        editor: {
          state: { selection, selection: { from, to } },
        },
      }) {
        selectionIsEmpty.value = from === to || selection instanceof NodeSelection

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
    selectedNode,
    selectedNodeAttrs,
    selectedNodeType,
    selectedNodePos,
    selectedNodeNeighbors,
    setNodeSelection,
    toggleNodeAttribute,
    insertNode,
    moveNode,
    removeNode,
    changeNodeType,
    selectionIsEmpty,
    selectionRect,
  }
}
