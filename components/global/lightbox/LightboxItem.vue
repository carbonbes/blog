<template>
  <div
    class="absolute top-0 left-0 inset-0"
    :style="currentItemTransform"
    :data-active-item="index === activeItemIndex"
  >
    <img
      v-if="item.type === 'image'"
      :src="item.src"
      :alt="item.alt"
      loading="lazy"
      class="max-h-full select-none no-drag"
      :style="activeItemImgTransform"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/lightbox/Lightbox.vue'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
  index: number
  item: Item
  activeItemIndex: number
  activeItem: Item
  thumbnail: HTMLElement
}>()

const emits = defineEmits<{
  close: [void]
}>()

const { width: screenWidth, height: screenHeight } = useWindowResizing()

const currentItemThumbnailBounding = useElementBounding(props.thumbnail)

const currentItemTransform = computed(() => {
  return `transform: translateX(${(screenWidth.value * props.index)}px)`
})

const activeItemImgTransform = computed(() => {
  const { width: thumbnailWidth, height: thumbnailHeight } = currentItemThumbnailBounding

  const translateX = (screenWidth.value / 2) - (props.item.width / 2)
  const translateY = (screenHeight.value / 2) - (props.item.height / 2)
  const relativeScaleX = thumbnailWidth.value / props.item.width
  const relativeScaleY = thumbnailHeight.value / props.item.height

  return `transform: translate3d(${translateX}px, ${translateY}px, 0px)`
})

function onClickOutside(e: PointerEvent) {
  const { dataset: { activeItem } } = e.target as HTMLElement
  
  if (!activeItem) return

  emits('close')
}
</script>
