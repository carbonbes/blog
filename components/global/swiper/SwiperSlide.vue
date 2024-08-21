<template>
  <div
    class="swiper-slide"
    v-intersection-observer="onIntersectionObserver"
  >
    <div
      class="max-w-fit origin-top-left"
      :class="{ 'transition-[transform,width,height] duration-300': enabledTransformTransition && !screenIsResizing }"
      :style="[slideContentWrapperTransform, croppedSize]"
    >
      <img
        v-if="isImage"
        :src="item.src"
        :alt="item.alt"
        loading="lazy"
        class="w-full h-full max-h-screen object-cover object-center touch-none"
        ref="slideContentRef"
      />

      <video
        v-else
        :src="item.src"
        class="w-full h-full max-w-[1000px] max-h-screen bg-black aspect-video touch-none"
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

const {
  width: screenWidth,
  height: screenHeight,
  isResizing: screenIsResizing
} = useWindowResizing()

const isImage = computed(() => ['image', 'gif'].includes(props.item.type))

const prevSlideControlRef = ref<HTMLElement>()
const nextSlideControlRef = ref<HTMLElement>()

function setSlideControlsRefs() {
  prevSlideControlRef.value = document.querySelector('#lightbox-prev-slide-control') as HTMLElement
  nextSlideControlRef.value = document.querySelector('#lightbox-next-slide-control') as HTMLElement
}

const slideContentRef = ref<HTMLImageElement | HTMLVideoElement>()

onClickOutside(
  slideContentRef,
  () => {
    if (!props.isActiveSlide || props.swiper.animating) return

    close()
    playCloseAnimation()
  },
  { ignore: [prevSlideControlRef, nextSlideControlRef] }
)

onKeyStroke('Escape', close)

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

const onIntersectionObserver = [async ([{ isIntersecting }]: IntersectionObserverEntry[]) => {
  if (isImage.value || screenIsResizing.value) return

  const el = slideContentRef.value as HTMLVideoElement

  await until(isMounted).toBe(true)

  if (isIntersecting) el.play()
  else stopVideo()
}, { threshold: 1 }]

const slideThumbnailTop = computed(() => props.thumbnail.getBoundingClientRect().top)
const slideThumbnailLeft = computed(() => props.thumbnail.getBoundingClientRect().left)
const slideThumbnailWidth = computed(() => props.thumbnail.getBoundingClientRect().width)
const slideThumbnailHeight = computed(() => props.thumbnail.getBoundingClientRect().height)
const slideContentWidth = computed(() => slideContentRef.value?.offsetWidth!)
const slideContentHeight = computed(() => slideContentRef.value?.offsetHeight!)
const slideContentRealSizes = computed(() =>
  calculateMaxSize(
    props.item.width,
    props.item.height,
    Math.min(props.item.width, screenWidth.value),
    Math.min(props.item.height, screenHeight.value)
  )
)

const translateX = ref(0)
const translateY = ref(0)
const croppedWidth = ref(0)
const croppedHeight = ref(0)

const enabledTransformTransition = ref(false)
const isMounted = ref(false)

const slideContentWrapperTransform = computed(() => `transform: translate(${translateX.value}px, ${translateY.value}px)`)
const croppedSize = computed(() => {
  if (enabledTransformTransition.value) {
    return `width: ${croppedWidth.value}px; height: ${croppedHeight.value}px`
  } else return `width: auto; height: auto`
})

async function close() {
  if (!isMounted.value) return

  playCloseAnimation()
  await promiseTimeout(300)
  emits('close')
}

async function playOpenAnimation() {
  translateX.value = slideThumbnailLeft.value
  translateY.value = slideThumbnailTop.value
  croppedWidth.value = slideThumbnailWidth.value
  croppedHeight.value = slideThumbnailHeight.value

  await nextTick()

  enabledTransformTransition.value = props.isActiveSlide ? true : false

  translateX.value = (screenWidth.value / 2) - (slideContentWidth.value / 2)
  translateY.value = (screenHeight.value / 2) - (slideContentHeight.value / 2)
  croppedWidth.value = Math.max(slideThumbnailWidth.value, slideContentRealSizes.value.width)
  croppedHeight.value = Math.max(slideThumbnailHeight.value, slideContentRealSizes.value.height)

  // await promiseTimeout(300)
  
  // enabledTransformTransition.value = false
}

async function playCloseAnimation() {
  isMounted.value = false

  await nextTick()

  enabledTransformTransition.value = props.isActiveSlide ? true : false

  translateX.value = slideThumbnailLeft.value
  translateY.value = slideThumbnailTop.value
  croppedWidth.value = slideThumbnailWidth.value
  croppedHeight.value = slideThumbnailHeight.value
}

function recalculateTransform() {
  if (!isMounted.value) return

  const {
    width: slideContentWidth,
    height: slideContentHeight
  } = useElementBounding(slideContentRef)

  translateX.value = Math.max(0, (screenWidth.value / 2) - (slideContentWidth.value / 2))
  translateY.value = Math.max(0, (screenHeight.value / 2) - (slideContentHeight.value / 2))

}

onMounted(async () => {
  setSlideControlsRefs()
  await playOpenAnimation()
  isMounted.value = true
})

watchEffect(recalculateTransform)
</script>
