<template>
  <div
    class="grid gap-1"
    :class="{
      'grid-rows-[250px] grid-cols-[repeat(2,_1fr)]': images.length === 2,
      'grid-rows-[repeat(2, 125px)] grid-cols-[2fr_1fr]': images.length > 2
    }"
  >
    <Image
      v-for="image in images"
      :src="image.url"
      galleryItem
      zoomable
      size="w-full h-full object-cover"
      :class="{  }"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  images: { url: string }[]
}>()
</script>
