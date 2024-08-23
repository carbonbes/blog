<template>
  <div
    class="grid gap-1"
    :class="{
      'auto-rows-[250px] grid-cols-[repeat(2,_1fr)]': items.length === 2,
      'auto-rows-[125px] grid-cols-[2fr_1fr]': items.length === 3,
      'auto-rows-[125px] grid-cols-[repeat(3,_1fr)]': items.length >= 4
    }"
    ref="galleryGridRef"
  >
    <GalleryGridItem
      v-for="(item, i) in items"
      :parent="galleryGridRef"
      :item
      :isSingleItem="items.length === 1"
      :class="{
        'row-[2_span]': i === 0 && items.length > 2,
        'col-[3_span]': i === 0 && items.length > 3,
        'relative hover:after:opacity-0 [@media(hover)]:after:pointer-events-none after:content-[attr(data-residue)] after:absolute after:inset-0 after:w-full after:h-full after:backdrop-blur-sm after:flex after:items-center after:justify-center after:text-white after:font-medium after:bg-black/75 after:transition-[opacity,backdrop-filter]': i === 3 && items.length > 3,
        'hidden': i >= 4
      }"
      :data-residue="i === 3 && items.length > 3 ? `Еще ${items.length - (i + 1)}` : undefined"
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

const galleryGridRef = ref<HTMLDivElement>()
</script>
