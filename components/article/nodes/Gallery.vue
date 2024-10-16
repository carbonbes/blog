<template>
  <!-- <GalleryGrid :items="node.attrs.items" /> -->
</template>

<script lang="ts" setup>
import GalleryGrid from '~/components/global/gallery-grid/GalleryGrid.vue'
import type { GalleryNode } from '~/schema/articleBodySchema'

const props = defineProps<{
  mark?: number
  node: GalleryNode
}>()
</script>
