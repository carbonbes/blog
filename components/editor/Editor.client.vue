<template>
  <ScrollArea scrollAreaClass="editor-scrollable-container">
    <EditorContent :editor class="editor h-full" />
  </ScrollArea>

  <EditorInlineToolsPopover />
</template>

<script lang="ts" setup>
import { EditorContent, type JSONContent } from '@tiptap/vue-3'
import type { ArticleBody } from '~/types'

const props = defineProps<{
  data: ArticleBody | undefined
}>()

const emit = defineEmits<{
  update: [body: ArticleBody]
}>()

const { initEditor, destroyEditor, editor, data } = useEditor()

onMounted(() => initEditor(props.data))
onUnmounted(destroyEditor)

function filterEmptyNodes(
  content: JSONContent[] | undefined
): JSONContent[] | undefined {
  if (!content) return

  return content
    .map((node) => {
      if (
        ['heading', 'paragraph'].includes(node.type!) &&
        (!node.content || !node.content[0].text.trim())
      )
        return
      if (node.type === 'gallery' && !node.attrs!.items) return

      return node
    })
    .filter((node) => node !== undefined)
}

watch(data, () => {
  console.log(filterEmptyNodes(data.value.content))

  if (
    !filterEmptyNodes(data.value.content) ||
    filterEmptyNodes(data.value.content)?.length === 0
  )
    return

  emit('update', data.value!)
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
