<template>
  <NodeViewWrapper data-prevent-focus="true">
    <Video
      :videoId="node.attrs.video_id"
      :thumbnail="node.attrs.thumbnail"
      type="youtube"
    />
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>
