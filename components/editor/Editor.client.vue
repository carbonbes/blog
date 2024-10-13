<template>
  <ScrollArea scrollAreaClass="editor-scrollable-container">
    <EditorContent :editor class="editor h-full" />
  </ScrollArea>

  <EditorInlineToolsPopover />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type {
  ArticleBody,
  GalleryNode,
  HeadingNode,
  ListNode,
  ParagraphNode,
} from '~/types'

const props = defineProps<{
  data: ArticleBody | undefined
}>()

const emit = defineEmits<{
  update: [body: ArticleBody]
}>()

const { initEditor, destroyEditor, editor, data } = useEditor()

onMounted(() => initEditor(props.data))
onUnmounted(destroyEditor)

function filterEmptyNodes(content: ArticleBody['content']) {
  return content.filter((rootNode) => {
    const [rootChild] = rootNode.content

    if (['heading', 'paragraph'].includes(rootChild.type)) {
      const [textNode] = (rootChild as HeadingNode | ParagraphNode).content

      if (!textNode || !textNode.text?.trim()) return
    }

    if (['bulletList', 'orderedList'].includes(rootChild.type)) {
      const listItem = (rootChild as ListNode).content
    }

    if (rootChild.type === 'gallery') {
      const items = (rootChild as GalleryNode).attrs.items

      if (!items.length) return
    }

    return rootNode
  })
}

watch(data, () => {
  const content = filterEmptyNodes(data.value.content)

  if (!content || content.length === 0) return

  emit('update', { type: 'doc', content })
})
</script>

<style lang="sass" scoped>
:deep()
  .tiptap
    padding-bottom: 15vh
    height: 100%
    outline: none

    @media (min-width: 780px)
      margin: 0 2rem

    h1, h2, p
      &.is-empty::before
        content: attr(data-placeholder)
        height: 0
        color: lightgray
        float: left
        pointer-events: none

    [data-type='inline-spoiler']
      filter: blur(4px)
      transition: filter .25s

    a
      @apply text-blue-600 underline
</style>
