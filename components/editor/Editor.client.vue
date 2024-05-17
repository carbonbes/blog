<template>
  <EditorContent :editor />
  <EditorInlineToolsPopover />
  <NodeControls />
</template>

<script lang="ts" setup>
import { EditorContent } from '@tiptap/vue-3'
import type { ArticleContent } from '~/types'
import NodeControls from './nodes/NodeControls.vue'

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

</style>