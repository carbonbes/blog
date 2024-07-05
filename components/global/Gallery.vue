<template>
  <div
    class="grid gap-1"
    :class="{
      'grid-rows-[250px] grid-cols-[repeat(2,_1fr)]': items.length === 2,
      'grid-rows-[repeat(2,_125px)] grid-cols-[2fr_1fr]': items.length > 2
    }"
  >
    <template v-for="(item, i) in items">
      <Image
        v-if="item.type === 'image'"
        :src="item.url"
        :srcWidth="item.width"
        :srcHeight="item.height"
        galleryItem
        zoomable
        size="w-full h-full object-cover"
        class="row-[1_span]"
        :class="{ 'row-[2_span]': i === 0 && items.length > 2 }"
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
        :class="{ 'row-[2_span]': i === 0 && items.length > 2 }"
        size="w-full h-full"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  items: {
    url: string,
    thumbnail?: string
    width: number
    height: number
    type: 'image' | 'video' | 'gif'
  }[]
}>()
</script>
