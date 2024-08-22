<template>
  <div
    class="swiper-slide touch-none"
    v-intersection-observer="onIntersectionObserver"
    ref="slideRef"
  >
    <div
      class="origin-top-left"
      :class="{ 'transition-[transform,width,height] duration-300': enabledTransformTransition && !screenIsResizing }"
      :style="[slideContentWrapperTransform, slideContentWrapperSize]"
    >
      <img
        v-if="isImage"
        :src="item.src"
        :alt="item.alt"
        loading="lazy"
        class="w-full h-full max-h-screen object-cover object-center"
        ref="slideContentRef"
      />

      <video
        v-else
        :src="item.src"
        class="w-full h-full max-w-[1000px] max-h-screen bg-black aspect-video"
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

const slideThumbnailBounding = useElementBounding(props.thumbnail)
const slideContentSize = computed(() =>
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
const slideContentWrapperSize = computed(() => `width: ${croppedWidth.value}px; height: ${croppedHeight.value}px`)

async function close() {
  if (!isMounted.value) return

  playCloseAnimation()
  emits('close')
}

function setStartStyles() {
  translateX.value = slideThumbnailBounding.left.value
  translateY.value = slideThumbnailBounding.top.value
  croppedWidth.value = slideThumbnailBounding.width.value
  croppedHeight.value = slideThumbnailBounding.height.value
}

function setEndStyles() {
  translateX.value = (screenWidth.value / 2) - (slideContentSize.value.width / 2)
  translateY.value = (screenHeight.value / 2) - (slideContentSize.value.height / 2)
  croppedWidth.value = slideContentSize.value.width
  croppedHeight.value = slideContentSize.value.height
}

async function playOpenAnimation() {
  setStartStyles()

  await nextTick()

  enabledTransformTransition.value = props.isActiveSlide ? true : false
  setEndStyles()

  await promiseTimeout(300)
  
  enabledTransformTransition.value = false
  isMounted.value = true
}

async function playCloseAnimation() {
  isMounted.value = false

  await nextTick()

  enabledTransformTransition.value = props.isActiveSlide ? true : false
  setStartStyles()
}

function recalculateTransform() {
  if (!isMounted.value) return

  setEndStyles()
}

onMounted(async () => {
  setSlideControlsRefs()
  playOpenAnimation()
})

watchEffect(recalculateTransform)

const slideRef = ref()

useDragGesture(slideRef, async (state) => {
  if (!(slideRef.value || props.isActiveSlide) || props.swiper.animating) return

  const { active, movement: [, y] } = state

  const initialTranslateY = (screenHeight.value / 2) - (slideContentSize.value.height / 2)
  translateY.value = initialTranslateY + y

  if (!active) {
    if (Math.abs(y) >= 100) {
      close()
    } else {
      enabledTransformTransition.value = true
      translateY.value = initialTranslateY
      await promiseTimeout(300)
      enabledTransformTransition.value = false
    }
  }
}, { axis: 'y', delay: true })
</script>
