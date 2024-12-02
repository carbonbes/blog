<template>
  <ScrollArea scrollAreaClass="editor-scrollable-container">
    <EditorContent
      :editor
      class="editor [&_.tiptap]:sm:pt-4 [&_.tiptap]:pb-[15vh] [&_.tiptap]:h-full [&_.tiptap]:min-[780px]:mx-8 [&_.tiptap_h1.is-empty]:before:content-[attr(data-placeholder)] [&_.tiptap_h1.is-empty]:before:h-0 [&_.tiptap_h1.is-empty]:before:text-gray-300 [&_.tiptap_h1.is-empty]:before:float-left [&_.tiptap_h1.is-empty]:before:pointer-events-none [&_.tiptap_h2.is-empty]:before:content-[attr(data-placeholder)] [&_.tiptap_h2.is-empty]:before:h-0 [&_.tiptap_h2.is-empty]:before:text-gray-300 [&_.tiptap_h2.is-empty]:before:float-left [&_.tiptap_h2.is-empty]:before:pointer-events-none [&_.tiptap_p.is-empty]:before:content-[attr(data-placeholder)] [&_.tiptap_p.is-empty]:before:h-0 [&_.tiptap_p.is-empty]:before:text-gray-300 [&_.tiptap_p.is-empty]:before:float-left [&_.tiptap_p.is-empty]:before:pointer-events-none [&_.tiptap_a]:text-blue-500 [&_.tiptap_a]:underline [&_.tiptap_[data-type=inline-spoiler]]:blur-sm [&_.tiptap_[data-type=inline-spoiler]]:transition-[filter] [&_.tiptap_[data-type=inline-spoiler]:hover]:blur-0"
    />
  </ScrollArea>

  <EditorInlineToolsPopover />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type { ArticleBody } from '~/types'

const props = defineProps<{
  data: ArticleBody | undefined
  manualInit?: boolean
}>()

const emits = defineEmits<{
  ready: [void]
  update: [body: ArticleBody]
}>()

function onReady() {
  emits('ready')
}

const { initEditor, destroyEditor, editor, data } = useEditor()

onMounted(() => {
  if (props.manualInit) return

  initEditor({ content: props.data, readyCallback: onReady })
})

onUnmounted(destroyEditor)

watch(data, (v) => emits('update', v))

function manualInit() {
  initEditor({ content: props.data, readyCallback: onReady })
}

defineExpose({ manualInit })
</script>
