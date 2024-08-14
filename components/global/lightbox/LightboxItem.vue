<template>
  <SwiperSlide class="!flex items-center justify-center">
    <div class="swiper-zoom-container">
      <NuxtImg
        v-if="item.type === 'image'"
        :src="item.src"
        :alt="item.alt"
        loading="lazy"
        class="max-h-full"
        v-on-click-outside="onClickOutside"
      />
    </div>
  </SwiperSlide>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/lightbox/Lightbox.vue'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps<{
  item: Item
  thumbnail: HTMLElement
}>()

const emits = defineEmits<{
  close: [void]
}>()

const { width: screenWidth, height: screenHeight } = useWindowResizing()

const currentItemThumbnailBounding = useElementBounding(props.thumbnail)

const currentItemImgTransform = computed(() => {
  const { width: thumbnailWidth, height: thumbnailHeight } = currentItemThumbnailBounding

  const translateX = (screenWidth.value / 2) - (props.item.width / 2)
  const translateY = (screenHeight.value / 2) - (props.item.height / 2)
  const scaleX = thumbnailWidth.value / props.item.width
  const scaleY = thumbnailHeight.value / props.item.height

  return `transform: translate3d(${translateX}px, ${translateY}px, 0px) scale3d(${scaleX}, ${scaleY}, 1)`
})

function onClickOutside(e: PointerEvent) {
  const { dataset: { activeItem } } = e.target as HTMLElement
  
  if (!activeItem) return

  emits('close')
}
</script>
