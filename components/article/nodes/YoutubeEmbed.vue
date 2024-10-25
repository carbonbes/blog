<template>
  <YoutubeVideo :video-id="node.attrs.video_id" />
</template>

<script lang="ts" setup>
import type { YoutubeEmbedNode } from '~/schema/articleBodySchema'

const props = defineProps<{
  mark?: number
  node: YoutubeEmbedNode
}>()
</script>
