<template>
  <div class="-ml-6 w-[calc(100%+3rem)]">
    <Flex v-if="singleImage" center class="bg-gray-200">
      <Image
        :src="singleImage.url"
        :alt="singleImage.alt"
        :originalWidth="singleImage.width"
        :originalHeight="singleImage.height"
        zoomable
        class="w-fit max-h-80"
      />
    </Flex>

    <Video
      v-else-if="singleVideo"
      :src="singleVideo.url"
      :description="singleVideo.alt"
      :thumbnail="singleVideo.thumbnail!.url"
      :originalWidth="singleVideo.width"
      :originalHeight="singleVideo.height"
      autoplay
      controls
      classes="w-full h-80 bg-gray-200"
    />

    <GalleryGrid v-else :items />
  </div>
</template>

<script lang="ts" setup>
import GalleryGrid from '~/components/global/gallery-grid/GalleryGrid.vue'
import type { GalleryNode } from '~/types'

const props = defineProps<{
  mark?: number
  node: GalleryNode
}>()

const items = computed(() => props.node.attrs.items.map((item) => item.media))

const singleImage = computed(() => {
  if (
    items.value.length === 1 &&
    getFileTypeFromMimeType(items.value[0].mime_type) === 'image'
  ) {
    const { name, url, width, height, description: alt } = items.value[0]

    return {
      name,
      url,
      alt,
      width,
      height,
    }
  }
})

const singleVideo = computed(() => {
  if (
    items.value.length === 1 &&
    getFileTypeFromMimeType(items.value[0].mime_type) === 'video'
  ) {
    const { url, thumbnail, width, height, description: alt } = items.value[0]

    return {
      url,
      alt,
      thumbnail,
      width,
      height,
    }
  }
})
</script>
