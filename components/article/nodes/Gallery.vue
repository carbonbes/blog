<template>
  <Image
    v-if="singleImage && singleImage.type === 'image'"
    :src="singleImage.src"
    :originalWidth="singleImage.width"
    :originalHeight="singleImage.height"
    zoomable
    class="-ml-6 w-[calc(100%+3rem)] max-w-[unset]"
  />

  <Video
    v-else-if="singleVideo && singleVideo.type === 'video'"
    :src="singleVideo.src"
    :thumbnail="singleVideo.thumbnail"
    :originalWidth="singleVideo.width"
    :originalHeight="singleVideo.height"
    autoplay
    controls
    class="-ml-6 w-[calc(100%+3rem)] max-w-[unset]"
  />
</template>

<script lang="ts" setup>
import GalleryGrid from '~/components/global/gallery-grid/GalleryGrid.vue'
import type { GalleryNode } from '~/schema/articleBodySchema'

const props = defineProps<{
  mark?: number
  node: GalleryNode
}>()

const singleImage = computed(() => {
  const items = props.node.attrs.items

  if (items.length !== 1) return

  const [item] = items

  if (item.type !== 'image') return

  return item
})

const singleVideo = computed(() => {
  const items = props.node.attrs.items

  if (items.length !== 1) return

  const [item] = items

  if (item.type !== 'video') return

  return item
})
</script>
