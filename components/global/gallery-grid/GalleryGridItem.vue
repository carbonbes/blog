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
      v-if="type === 'image'"
      :src="item.url"
      :alt="item.description"
      class="w-full h-full object-cover"
    />

    <Video
      v-else-if="type === 'video'"
      :src="item.url"
      :description="item.description"
      :thumbnail="item.thumbnail?.url"
      ignoreThumbnailClick
      :autoplay="isSingleItem"
      :controls="isSingleItem"
      :aspectRatio="isSingleItem ? 'aspect-video' : undefined"
      classes="w-full h-full"
    />
  </div>
</template>

<script lang="ts" setup>
import type { StorageMedia } from '~/types'

const props = defineProps<{
  parent: HTMLElement | undefined
  item: StorageMedia
  isSingleItem?: boolean
  class?: string | object
  dataResidue?: string
}>()

const type = computed(() => getFileTypeFromMimeType(props.item.mime_type))

const lightboxItemRef = ref<HTMLDivElement>()

const lightboxAttrs = computed(() => ({
  'data-lightbox-item': true,
  'data-lightbox-src': props.item.url,
  'data-lightbox-alt': props.item.description,
  'data-lightbox-width': props.item.width,
  'data-lightbox-height': props.item.height,
  'data-lightbox-type': type.value,
}))

const { setItems } = useLightboxDialog()
</script>
