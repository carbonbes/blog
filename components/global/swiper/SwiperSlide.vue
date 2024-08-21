<template>
  <div
    class="swiper-slide"
    v-intersection-observer="[onIntersectionObserver, { threshold: 1 }]"
  >
    <div
      class="origin-top-left"
      :class="{ 'transition-transform duration-300': enabledTransformTransition && !screenIsResizing }"
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
        v-else
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

const {
  width: screenWidth,
  height: screenHeight,
  isResizing: screenIsResizing
} = useWindowResizing()

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

async function onIntersectionObserver([{ isIntersecting }]: IntersectionObserverEntry[]) {
  if (props.item.type === 'image' || screenIsResizing.value) return

  const el = slideContentRef.value as HTMLVideoElement

  await until(isMounted).toBe(true)

  if (isIntersecting) el.play()
  else stopVideo()
}

const currentSlideThumbnailBounding = useElementBounding(props.thumbnail)

const slideContentWidth = computed(() => slideContentRef.value?.offsetWidth!)
const slideContentHeight = computed(() => slideContentRef.value?.offsetHeight!)
const translateX = ref(0)
const translateY = ref(0)
const scaleX = ref(0)
const scaleY = ref(0)

const enabledTransformTransition = ref(false)
const isMounted = ref(false)

const currentSlideContentTransform = computed(() => `transform: translate(${translateX.value}px, ${translateY.value}px) scale(${scaleX.value}, ${scaleY.value})`)

async function close() {
  if (!isMounted.value) return
  
  playCloseAnimation()
  await promiseTimeout(300)
  emits('close')
}

async function playOpenAnimation() {
  translateX.value = currentSlideThumbnailBounding.left.value
  translateY.value = currentSlideThumbnailBounding.top.value
  scaleX.value = currentSlideThumbnailBounding.width.value / props.item.width
  scaleY.value = currentSlideThumbnailBounding.height.value / props.item.height

  await promiseTimeout(0)
  enabledTransformTransition.value = props.isActiveSlide ? true : false

  translateX.value = (screenWidth.value / 2) - (slideContentWidth.value / 2)
  translateY.value = (screenHeight.value / 2) - (slideContentHeight.value / 2)
  scaleX.value = 1
  scaleY.value = 1

  await promiseTimeout(300)

  enabledTransformTransition.value = false
}

function playCloseAnimation() {
  isMounted.value = false
  enabledTransformTransition.value = props.isActiveSlide ? true : false

  translateX.value = currentSlideThumbnailBounding.left.value
  translateY.value = currentSlideThumbnailBounding.top.value
  scaleX.value = currentSlideThumbnailBounding.width.value / props.item.width
  scaleY.value = currentSlideThumbnailBounding.height.value / props.item.height
}

function recalculateSizes() {
  if (!isMounted.value) return

  const {
    width: slideContentWidth,
    height: slideContentHeight
  } = useElementBounding(slideContentRef)

  translateX.value = Math.max(0, (screenWidth.value / 2) - (slideContentWidth.value / 2))
  translateY.value = (screenHeight.value / 2) - (slideContentHeight.value / 2)
}

onMounted(async () => {
  setSlideControlsRefs()
  await playOpenAnimation()
  isMounted.value = true
})

watchEffect(recalculateSizes)
</script>
