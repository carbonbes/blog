<template>
  <NodeViewWrapper data-prevent-focus="true">
    <YoutubeVideo :videoId="node.attrs.video_id" />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>
