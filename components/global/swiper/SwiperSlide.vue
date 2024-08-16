<template>
  <div
    class="swiper-slide"
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
  >
    <img
      v-if="item.type === 'image'"
      :src="item.src"
      :alt="item.alt"
      loading="lazy"
      class="max-h-full origin-top-left touch-none"
      :class="{ 'transition-transform duration-300': enabledTransformTransition }"
      :style="currentSlideContentTransform"
      ref="slideContentRef"
    />

    <video
      v-else-if="item.type === 'video'"
      :src="item.src"
      class="origin-top-left touch-none"
      :class="{ 'transition-transform duration-300': enabledTransformTransition }"
      :style="currentSlideContentTransform"
      controls
      muted
      playsinline
      ref="slideContentRef"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/Lightbox.vue'
import { vIntersectionObserver } from '@vueuse/components'
import type Swiper from 'swiper'
import { promiseTimeout } from '@vueuse/core'

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

const enabledTransformTransition = ref(false)
const currentSlideContentTransform = ref<string>()

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

  const { movement: [, y] } = state

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

function getCroppedBoundsByElement(el: HTMLElement, imageWidth: number, imageHeight: number) {
  const thumbAreaRect = el.getBoundingClientRect()

  const hRatio = thumbAreaRect.width / imageWidth
  const vRatio = thumbAreaRect.height / imageHeight
  const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio

  const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2
  const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2

  const bounds = {
    x: thumbAreaRect.left + offsetX,
    y: thumbAreaRect.top + offsetY,
    w: imageWidth * fillZoomLevel
  }

  bounds.innerRect = {
    w: thumbAreaRect.width,
    h: thumbAreaRect.height,
    x: offsetX,
    y: offsetY
  }

  return bounds
}

const currentSlideThumbnailBounding = useElementBounding(props.thumbnail)

async function setTransform() {
  const {
    top: thumbnailTop,
    left: thumbnailLeft,
    width: thumbnailWidth,
    height: thumbnailHeight
  } = currentSlideThumbnailBounding

  const startScaleX = thumbnailWidth.value / props.item.width
  const startScaleY = thumbnailHeight.value / props.item.height
  const startTranslateX = thumbnailLeft.value
  const startTranslateY = thumbnailTop.value
  const endTranslateX = (screenWidth.value / 2) - (props.item.width / 2)
  const endTranslateY = (screenHeight.value / 2) - (props.item.height / 2)

  if (!props.active) {
    currentSlideContentTransform.value = `transform: translate(${endTranslateX}px, ${endTranslateY}px) scale(1, 1)`

    return
  }

  currentSlideContentTransform.value = `transform: translate(${startTranslateX}px, ${startTranslateY}px) scale(${startScaleX}, ${startScaleY})`

  await promiseTimeout(0)

  enabledTransformTransition.value = true
  currentSlideContentTransform.value = `transform: translate(${endTranslateX}px, ${endTranslateY}px) scale(1, 1)`
}

onMounted(setTransform)
</script>
