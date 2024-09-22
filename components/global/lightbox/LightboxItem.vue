<template>
  <SwiperItem
    class="overflow-hidden touch-none"
    v-intersection-observer="onIntersectionObserver"
    ref="slideRef"
  >
    <div
      class="absolute inset-0 overflow-hidden"
      :class="{ 'transition-transform duration-300': enabledTransformTransition && !screenIsResizing }"
      :style="slideWrapper1Transform"
    >
      <div
        class="absolute inset-0 overflow-hidden"
        :class="{ 'transition-transform duration-300': enabledTransformTransition && !screenIsResizing }"
        :style="slideWrapper2Transform"
      >
        <div
          class="absolute origin-top-left"
          :class="{ 'transition-transform duration-300': enabledTransformTransition && !screenIsResizing }"
          :style="slideContentWrapperTransform"
        >
          <NuxtImg
            v-if="isImage"
            :src="item.src"
            :alt="item.alt"
            loading="lazy"
            class="w-full h-full max-h-screen"
            :style="slideContentWrapperItemSize"
            ref="slideContentRef"
          />

          <video
            v-else
            :src="item.src"
            class="w-full h-full bg-black aspect-video"
            :style="slideContentWrapperItemSize"
            controls
            muted
            playsinline
            ref="slideContentRef"
          />
        </div>
      </div>
    </div>
  </SwiperItem>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/global/lightbox/Lightbox.vue'
import { vIntersectionObserver } from '@vueuse/components'
import type Swiper from 'swiper'
import { promiseTimeout } from '@vueuse/core'
import SwiperItem from '~/components/global/swiper/SwiperItem.vue'

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
  calculateSize(
    props.item.width,
    props.item.height,
    Math.min(!isImage.value ? 1000 : props.item.width, screenWidth.value),
    Math.min(props.item.height, screenHeight.value),
    !isImage.value ? 16/9 : undefined
  )
)

const wrapper1TranslateX = ref(0)
const wrapper1TranslateY = ref(0)
const wrapper2TranslateX = ref(0)
const wrapper2TranslateY = ref(0)

const translateX = ref(0)
const translateY = ref(0)
const scaleX = ref(1)
const scaleY = ref(1)

const contentItemWidth = ref(0)
const contentItemHeight = ref(0)

const slideWrapper1Transform = computed(() => `transform: translate3d(${wrapper1TranslateX.value}px, ${wrapper1TranslateY.value}px, 0px)`)
const slideWrapper2Transform = computed(() => `transform: translate3d(${wrapper2TranslateX.value}px, ${wrapper2TranslateY.value}px, 0px)`)
const slideContentWrapperTransform = computed(() => `transform: translate3d(${translateX.value}px, ${translateY.value}px, 0px) scale3d(${scaleX.value}, ${scaleY.value}, 1)`)
const slideContentWrapperItemSize = computed(() => `width: ${contentItemWidth.value}px; height: ${contentItemHeight.value}px`)

const isMounted = ref(false)

function close() {
  if (!isMounted.value) return

  if (props.isActiveSlide) playCloseAnimation()
  emits('close')
}

function setStartStyles() {
  wrapper1TranslateX.value = slideThumbnailBounding.left.value + slideThumbnailBounding.width.value - screenWidth.value
  wrapper1TranslateY.value = slideThumbnailBounding.bottom.value - screenHeight.value
  wrapper2TranslateX.value = slideThumbnailBounding.left.value + Math.abs(wrapper1TranslateX.value)
  wrapper2TranslateY.value = slideThumbnailBounding.top.value + Math.abs(wrapper1TranslateY.value)

  translateX.value = 0
  translateY.value = 0
  scaleX.value = slideThumbnailBounding.width.value / props.item.width
  scaleY.value = slideThumbnailBounding.height.value / props.item.height

  contentItemWidth.value = slideThumbnailBounding.width.value
  contentItemHeight.value = slideThumbnailBounding.height.value
}

function setEndStyles() {
  wrapper1TranslateX.value = 0
  wrapper1TranslateY.value = 0
  wrapper2TranslateX.value = 0
  wrapper2TranslateY.value = 0

  translateX.value = (screenWidth.value / 2) - (slideContentSize.value.width / 2)
  translateY.value = (screenHeight.value / 2) - (slideContentSize.value.height / 2)
  scaleX.value = 1
  scaleY.value = 1

  contentItemWidth.value = slideContentSize.value.width
  contentItemHeight.value = slideContentSize.value.height
}

const enabledTransformTransition = ref(false)

async function playOpenAnimation() {
  setStartStyles()

  await nextTick()

  enabledTransformTransition.value = true
  setEndStyles()

  await promiseTimeout(300)
  
  enabledTransformTransition.value = false
  isMounted.value = true
}

async function playCloseAnimation() {
  isMounted.value = false

  await nextTick()

  enabledTransformTransition.value = true

  setStartStyles()
}

function recalculateTransform() {
  if (!isMounted.value) return

  setEndStyles()
}

onMounted(() => {
  setSlideControlsRefs()
  if (props.isActiveSlide) playOpenAnimation()
})

watchEffect(recalculateTransform)

const slideRef = ref()

useGesture(slideRef,
  {
    async onDrag(state) {
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
    }
  },
  {
    drag: {
      axis: 'y'
    },
    onlyTouchDevices: true
  }
)
</script>