<template>
  <ScrollArea scrollAreaClass="editor-scrollable-container" :disableScroll>
    <EditorContent :editor class="editor h-full" />
  </ScrollArea>

  <EditorInlineToolsPopover />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type { ArticleContent } from '~/types'

const props = defineProps<{
  data?: ArticleContent
  disableScroll?: boolean
}>()

const emit = defineEmits<{
  update: [body: ArticleContent]
}>()

const { initEditor, destroyEditor, editor, data } = useEditor()

onMounted(() => initEditor(props.data))
onUnmounted(destroyEditor)

watch(data, () => emit('update', data.value!))
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