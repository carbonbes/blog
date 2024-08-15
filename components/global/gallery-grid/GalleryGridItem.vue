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

  <div
    v-else
    data-lightbox-item
    :data-lightbox-src="item.url"
    data-lightbox-type="video"
    class="row-[1_span]"
    :class
    size="w-full h-full"
  />
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'

defineProps<{
  item: Item
  class?: string | object
}>()
</script>
