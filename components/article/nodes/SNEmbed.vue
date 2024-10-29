<template>
  <SNEmbed :embed="node.attrs.embed" />
</template>

<script lang="ts" setup>
import SNEmbed from '~/components/global/embeds/SNEmbed.vue'
import type { SNEmbedNode } from '~/types'

const props = defineProps<{
  mark?: number
  node: SNEmbedNode
}>()
</script>
