<template>
  <div
    class="cursor-zoom-in"
    :class
    v-bind="lightboxAttrs"
    :data-residue="dataResidue"
    ref="lightboxItemRef"
    @click="setItems({ parent, target: lightboxItemRef, lightboxItem: true })"
  >
    <Image
      v-if="['image', 'gif'].includes(item.type)"
      :src="item.url"
      :alt="item.alt"
      size="w-full h-full object-cover"
    />

    <Video
      v-else-if="item.type === 'video'"
      :src="item.url"
      :alt="item.alt"
      :thumbnail="item.thumbnail!"
      ignoreThumbnailClick
      :autoplay="isSingleItem"
      :controls="isSingleItem"
      :aspectRatio="isSingleItem ? 'aspect-video' : undefined"
      size="w-full h-full"
    />
  </div>
</template>

<script lang="ts" setup>
import { type Item } from '~/components/global/gallery-grid/GalleryGrid.vue'

const props = defineProps<{
  parent: HTMLElement | undefined
  item: Item
  isSingleItem?: boolean
  class?: string | object
  dataResidue?: string
}>()

const lightboxItemRef = ref<HTMLDivElement>()

const lightboxAttrs = computed(() => ({
  'data-lightbox-item': true,
  'data-lightbox-src': props.item.url,
  'data-lightbox-alt': props.item.alt,
  'data-lightbox-width': props.item.width,
  'data-lightbox-height': props.item.height,
  'data-lightbox-type': props.item.type,
}))

const { setItems } = useLightboxDialog()
</script>
