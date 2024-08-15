<template>
  <div
    class="swiper-slide !flex items-center justify-center"
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
  >
    <div :class="{ 'swiper-zoom-container': item.type === 'image' }">
      <img
        v-if="item.type === 'image'"
        :src="item.src"
        :alt="item.alt"
        loading="lazy"
        class="max-h-full touch-none"
        ref="slideContentRef"
      />

      <video
        v-else-if="item.type === 'video'"
        :src="item.src"
        class="touch-none"
        controls
        muted
        playsinline
        ref="slideContentRef"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/Lightbox.vue'
import { vIntersectionObserver } from '@vueuse/components'
import type Swiper from 'swiper'

const props = defineProps<{
  item: Item
  thumbnail: HTMLElement
  active: boolean
  swiper: Swiper
}>()

const emits = defineEmits<{
  close: [void]
}>()

const { width: screenWidth, height: screenHeight, isResizing } = useWindowResizing()

const slideContentRef = ref<HTMLImageElement | HTMLVideoElement>()

const currentItemThumbnailBounding = useElementBounding(props.thumbnail)
const currentItemContentBounding = useElementBounding(slideContentRef)

const currentItemContentTransform = computed(() => {
  const { width: thumbnailWidth, height: thumbnailHeight } = currentItemThumbnailBounding

  const translateX = (screenWidth.value / 2) - (props.item.width / 2)
  const translateY = (screenHeight.value / 2) - (props.item.height / 2)
  const scaleX = thumbnailWidth.value / props.item.width
  const scaleY = thumbnailHeight.value / props.item.height

  return `transform: translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`
})

const prevSlideControlRef = ref<HTMLElement>()
const nextSlideControlRef = ref<HTMLElement>()

onMounted(() => {
  prevSlideControlRef.value = document.querySelector('#lightbox-prev-slide-control') as HTMLElement
  nextSlideControlRef.value = document.querySelector('#lightbox-next-slide-control') as HTMLElement
})

onClickOutside(
  slideContentRef,
  () => {
    if (!props.active || props.swiper.animating) return

    emits('close')
  },
  { ignore: [prevSlideControlRef, nextSlideControlRef] }
)

useDragGesture(slideContentRef, (state) => {
  if (!slideContentRef.value || props.swiper.animating) return

  const { active, movement: [, y] } = state

  slideContentRef.value.style.transform = `translateY(${y}px)`
}, { axis: 'y', delay: true })

function stopVideo() {
  if (!slideContentRef.value) return

  const el = slideContentRef.value as HTMLVideoElement
  
  el.pause()
  el.currentTime = 0
}

function onIntersectionObserver([{ isIntersecting }]: IntersectionObserverEntry[]) {
  if (props.item.type === 'image' || isResizing.value) return

  const el = slideContentRef.value as HTMLVideoElement

  if (isIntersecting) el.play()
  else stopVideo()
}
</script>
