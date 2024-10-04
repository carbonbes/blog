<template>
  <img v-if="!item.uploaded" :src="item.src" alt="" loading="lazy" />

  <Image
    v-else-if="item.uploaded"
    :src="item.name!"
    :alt="item.alt"
    :width="500"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :parent
    :zoomable="isSingle"
    :lightboxItem="isGallery"
  />
</template>

<script lang="ts" setup>
import type { GalleryItem } from '~/components/editor/nodes/gallery/Gallery.vue'

defineProps<{
  class?: string | object
  item: GalleryItem
  parent?: HTMLElement
  isSingle?: boolean
  isGallery?: boolean
}>()
</script>
