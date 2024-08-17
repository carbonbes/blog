<template>
  <Image
    v-if="['image', 'gif'].includes(item.type)"
    :src="item.url"
    :alt="item.alt"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :zoomable="isSingleItem"
    :lightboxItem="!isSingleItem"
    size="w-full h-full object-cover"
    class="row-[1_span]"
    :class
  />

  <Video
    v-else
    :src="item.url"
    :alt="item.alt"
    :thumbnail="item.thumbnail!"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :lightboxItem="!isSingleItem"
    :autoplay="isSingleItem"
    :controls="isSingleItem"
    class="row-[1_span]"
    :class
    :aspectRatio="isSingleItem ? 'aspect-video' : undefined"
    size="w-full h-full"
  />
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'

defineProps<{
  item: Item
  isSingleItem?: boolean
  class?: string | object
}>()
</script>
