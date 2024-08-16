<template>
  <Image
    v-if="item.type === 'image'"
    :src="item.url"
    :originalWidth="item.width"
    :originalHeight="item.height"
    lightboxItem
    size="w-full h-full object-cover"
    class="row-[1_span]"
    :class
  />

  <VideoThumbnail
    v-else
    :src="item.url"
    :thumbnail="item.thumbnail!"
    lightboxItem
    :class
  />
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'
import VideoThumbnail from '~/components/global/gallery-grid/VideoThumbnail.vue'

defineProps<{
  item: Item
  class?: string | object
}>()
</script>
