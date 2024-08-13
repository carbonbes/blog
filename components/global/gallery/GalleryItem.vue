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

  <Video
    v-else
    :src="item.url"
    :thumbnail="item.thumbnail"
    :type="item.type"
    autoplay
    :loop="item.type === 'gif'"
    :controls="item.type === 'video'"
    class="flex justify-center bg-gray-100/50 row-[1_span]"
    :class
    size="w-full h-full"
  />
</template>

<script lang="ts" setup>
import type Item from '~/components/global/gallery/Gallery.vue'

const props = defineProps<{
  item: Item
  class?: string
}>()
</script>
