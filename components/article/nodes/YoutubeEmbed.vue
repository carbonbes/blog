<template>
  <YoutubeVideo :video-id="node.attrs.video_id" />
</template>

<script lang="ts" setup>
import type { YoutubeEmbedNode } from '~/types'

const props = defineProps<{
  mark?: number
  node: YoutubeEmbedNode
}>()
</script>
