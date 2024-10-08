<template>
  <NuxtImg
    v-if="!item.uploaded"
    :src="item.src"
    alt=""
    loading="lazy"
    class="object-contain"
    :class
  />

  <Image
    v-else-if="item.uploaded"
    :src="item.originalSrc"
    :name="item.name"
    :alt="item.alt"
    :options="{ width: isGallery ? 160 : undefined, quality: 50 }"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :parent
    :zoomable="isSingle"
    :lightboxItem="isGallery"
    :class
  />
</template>

<script lang="ts" setup>
import type { GalleryItem } from '~/components/editor/nodes/gallery/Gallery.vue'

defineProps<{
  item: GalleryItem
  parent?: HTMLElement
  isSingle?: boolean
  isGallery?: boolean
  class?: string | object
}>()
</script>
