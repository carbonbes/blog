<template>
  <div
    class="absolute top-0 left-0 inset-0"
    :style="{ transform: `translateX(${screenWidth * index}px)` }"
    :data-active-item="index === activeItemIndex"
  >
    <NuxtImg
      v-if="item.type === 'image'"
      :src="item.src"
      :alt="item.alt"
      loading="lazy"
      class="max-h-full"
      :style="currentItemImgTransform"
      v-on-click-outside="onClickOutside"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/lightbox/Lightbox.vue'
import { vOnClickOutside } from '@vueuse/components'
import { DragGesture } from '@use-gesture/vanilla'

const props = defineProps<{
  index: number
  item: Item
  activeItemIndex: number
  activeItem: Item
  activeItemThumbnailBounding: DOMRect
}>()

const emits = defineEmits<{
  close: [void]
}>()

const {
  width: screenWidth,
  height: screenHeight,
} = useWindowResizing()

const currentItemImgTransform = computed(() => {
  const { width: originalWidth, height: originalHeight } = props.activeItemThumbnailBounding

  const translateX = (screenWidth.value / 2) - (props.activeItem.width / 2)
  const translateY = (screenHeight.value / 2) - (props.activeItem.height / 2)
  const relativeScaleX = originalWidth / props.activeItem.width
  const relativeScaleY = originalHeight / props.activeItem.height

  return `transform: translate3d(${translateX}px, ${translateY}px, 0px)`
})

const dragState = useDrag(({ delta, movement: [x, y] }) => {
  console.log(delta)
})

function onClickOutside(e: PointerEvent) {
  const { dataset: { activeItem } } = e.target as HTMLElement
  
  if (!activeItem) return

  emits('close')
}
</script>
