<template>
  <div
    class="grid gap-1"
    :class="{
      'auto-rows-[250px] grid-cols-[repeat(2,_1fr)]': items.length === 2,
      'auto-rows-[125px] grid-cols-[2fr_1fr]': items.length === 3,
      'auto-rows-[125px] grid-cols-[repeat(3,_1fr)]': items.length >= 4
    }"
  >
    <GalleryGridItem
      v-for="(item, i) in items"
      :item
      :isSingleItem="items.length === 1"
      :class="{
        'row-[2_span]': i === 0 && items.length > 2,
        'col-[3_span]': i === 0 && items.length > 3,
        'hidden': i >= 4
      }"
    />
  </div>
</template>

<script lang="ts" setup>
export type Item = {
  url: string,
  alt?: string
  thumbnail?: string
  width: number
  height: number
  type: 'image' | 'video' | 'gif'
}

defineProps<{
  items: Item[]
}>()
</script>
