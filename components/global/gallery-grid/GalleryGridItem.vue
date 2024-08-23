<template>
  <Image
    v-if="['image', 'gif'].includes(item.type) && !dataResidue"
    :src="item.url"
    :alt="item.alt"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :zoomable="isSingleItem"
    :lightboxItem="!isSingleItem"
    :parent
    size="w-full h-full object-cover"
    class="row-[1_span]"
    :class
  />

  <Video
    v-else-if="item.type === 'video' && !dataResidue"
    :src="item.url"
    :alt="item.alt"
    :thumbnail="item.thumbnail!"
    :originalWidth="item.width"
    :originalHeight="item.height"
    :lightboxItem="!isSingleItem"
    :parent
    :autoplay="isSingleItem"
    :controls="isSingleItem"
    class="row-[1_span]"
    :class
    :aspectRatio="isSingleItem ? 'aspect-video' : undefined"
    size="w-full h-full"
  />

  <div
    v-else-if="dataResidue"
    :class
    :data-residue="dataResidue"
  >
    <Image
      v-if="['image', 'gif'].includes(item.type)"
      :src="item.url"
      :alt="item.alt"
      :originalWidth="item.width"
      :originalHeight="item.height"
      :zoomable="isSingleItem"
      :lightboxItem="!isSingleItem"
      :parent
      size="w-full h-full object-cover"
      class="row-[1_span]"
    />

    <Video
      v-else
      :src="item.url"
      :alt="item.alt"
      :thumbnail="item.thumbnail!"
      :originalWidth="item.width"
      :originalHeight="item.height"
      :lightboxItem="!isSingleItem"
      :parent
      :autoplay="isSingleItem"
      :controls="isSingleItem"
      class="row-[1_span]"
      :aspectRatio="isSingleItem ? 'aspect-video' : undefined"
      size="w-full h-full"
    />
  </div>
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'

defineProps<{
  parent: HTMLElement
  item: Item
  isSingleItem?: boolean
  class?: string | object
  dataResidue?: string
}>()
</script>
