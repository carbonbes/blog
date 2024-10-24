<template>
  <SNEmbed :embed="node.attrs.embed" />
</template>

<script lang="ts" setup>
import SNEmbed from '~/components/global/embeds/SNEmbed.vue'
import type { SNEmbedNode } from '~/schema/articleBodySchema'

const props = defineProps<{
  mark?: number
  node: SNEmbedNode
}>()
</script>
