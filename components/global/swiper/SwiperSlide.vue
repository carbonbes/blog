<template>
  <div
    class="swiper-slide"
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
  >
    <div
      class="absolute origin-top-left"
      :class="{ 'transition-transform duration-300': enabledTransformTransition }"
      :style="currentSlideContentTransform"
    >
      <img
        v-if="['image', 'gif'].includes(item.type)"
        :src="item.src"
        :alt="item.alt"
        loading="lazy"
        class="max-h-screen touch-none"
        ref="slideContentRef"
      />

      <video
        v-else-if="item.type === 'video'"
        :src="item.src"
        class="w-full h-full max-w-[1000px] bg-black aspect-video touch-none"
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
import { promiseTimeout } from '@vueuse/core'

const props = defineProps<{
  index: number
  item: Item
  thumbnail: HTMLElement
  isActiveSlide: boolean
  swiper: Swiper
}>()

const emits = defineEmits<{
  close: [void]
}>()

const { width: screenWidth, height: screenHeight, isResizing } = useWindowResizing()

const enabledTransformTransition = ref(false)
const currentSlideContentTransform = ref<string>()

const prevSlideControlRef = ref<HTMLElement>()
const nextSlideControlRef = ref<HTMLElement>()

onMounted(() => {
  prevSlideControlRef.value = document.querySelector('#lightbox-prev-slide-control') as HTMLElement
  nextSlideControlRef.value = document.querySelector('#lightbox-next-slide-control') as HTMLElement
})

const slideContentRef = ref<HTMLImageElement | HTMLVideoElement>()

onClickOutside(
  slideContentRef,
  () => {
    if (!props.isActiveSlide || props.swiper.animating) return

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

const currentSlideThumbnailBounding = useElementBounding(props.thumbnail)
const currentSlideContentBounding = useElementBounding(slideContentRef)

const startScaleX = computed(() => currentSlideThumbnailBounding.width.value / props.item.width)
const startScaleY = computed(() => currentSlideThumbnailBounding.height.value / props.item.height)
const endTranslateX = computed(() => (screenWidth.value / 2) - (props.item.width / 2))
const endTranslateY = computed(() => (screenHeight.value / 2) - (props.item.height / 2))

async function setTransform() {
  const {
    top: thumbnailTop,
    left: thumbnailLeft,
  } = currentSlideThumbnailBounding

  const startTranslateX = thumbnailLeft.value
  const startTranslateY = thumbnailTop.value

  if (!props.isActiveSlide) {
    currentSlideContentTransform.value = `transform: translate(${endTranslateX.value}px, ${endTranslateY.value}px) scale(1, 1)`

    return
  }

  currentSlideContentTransform.value = `transform: translate(${startTranslateX}px, ${startTranslateY}px) scale(${startScaleX.value}, ${startScaleY.value})`

  await promiseTimeout(0)

  enabledTransformTransition.value = true
  currentSlideContentTransform.value = `transform: translate(${endTranslateX.value}px, ${endTranslateY.value}px) scale(1, 1)`
}

onMounted(setTransform)
</script>
