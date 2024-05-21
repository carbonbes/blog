<template>
  <ScrollArea v-bind="$attrs">
    <EditorContent :editor class="editor" />
  </ScrollArea>
  <EditorInlineToolsPopover />
  <EditorNodeControls />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type { ArticleContent } from '~/types'
import EditorNodeControls from '~/components/editor/node-controls/EditorNodeControls.vue'

const props = defineProps<{ data?: ArticleContent }>()

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
    margin: 0 1rem
    padding-bottom: 50vh
    outline: none

    @media (min-width: 780px)
      margin: 0 6rem
      padding-bottom: 25vh

    > *
      position: relative

      .indicators
        position: absolute
        top: 0
        left: 100%
        margin-left: 1rem
        display: flex
        align-items: center
        gap: 5px

        .icon
          padding: 4px
          width: 18px
          height: 18px
          color: theme('textColor.blue.700')
          border: 1px solid theme('borderColor.gray.200')
          border-radius: 8px
          box-shadow: theme('boxShadow.sm')
          box-sizing: content-box

    h1
      @apply text-2xl font-bold

    h2
      @apply text-xl font-bold

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

    ol, ul
      @apply pl-4

    ol
      @apply list-decimal

    ul
      @apply list-disc

    > p, ol, ul
      margin-top: .5rem

    > h1, h2
      &:not(:first-child)
        margin-top: 1.5rem
</style>