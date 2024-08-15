<template>
  <div
    data-lightbox-item
    :data-lightbox-src="video.url"
    :data-lightbox-thumbnail="video.thumbnail"
    data-lightbox-type="video"
  >
    
  </div>
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'

const props = defineProps<{
  video: Item
}>()
</script>
