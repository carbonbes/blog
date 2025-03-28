<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal to="#teleports">
      <DialogOverlay
        class="fixed inset-0 z-[1] transition-[background-color,backdrop-filter] duration-[333ms] will-change-[background-color,backdrop-filter]"
        :style="dialogOverlayStyles"
      />

      <DialogContent
        aria-describedby=""
        class="fixed inset-0 overflow-hidden z-[1]"
        @closeAutoFocus="(e) => e.preventDefault()"
        @escapeKeyDown="(e) => e.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <button class="absolute top-0 right-0 p-4 z-[2]">
          <ITablerX
            class="!size-8 text-white/30 hover:text-white transition-colors"
          />
        </button>

        <Flex
          itemsCenter
          justifyBetween
          class="absolute inset-0"
        >
          <span
            v-if="!isSingleItem"
            class="absolute top-0 left-0 p-4 text-gray-300 z-10"
          >
            {{ `${activeItemIndex + 1} / ${items?.length}` }}
          </span>

          <button
            v-if="!isSingleItem"
            id="lightbox-prev-slide-control"
            class="z-10"
            @click="previousItem"
          >
            <ITablerChevronLeft class="!size-12 text-white/30 hover:text-white transition-colors" />
          </button>

          <Swiper
            :initialSlide="activeItemIndex"
            :loop="thumbnails?.length! > 1"
            :spaceBetween="100"
            @swiperrealindexchange="onSwiperRealIndexChange"
            class="absolute inset-0"
            ref="swiperRef"
          >
            <LightboxItem
              v-for="(item, i) in items"
              :key="i"
              :item
              :thumbnail="thumbnails![i]"
              :isActiveSlide="activeItemIndex === i"
              :swiper
              @close="close"
            />
          </Swiper>

          <button
            v-if="!isSingleItem"
            id="lightbox-next-slide-control"
            class="z-10"
            @click="nextItem"
          >
            <ITablerChevronRight class="!size-12 text-white/30 hover:text-white transition-colors" />
          </button>
        </Flex>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import Flex from '~/components/global/Flex.vue'
import type Swiper from '~/components/global/swiper/Swiper.vue'
import { promiseTimeout } from '@vueuse/core'

export type LightboxItem = {
  src: string
  alt?: string
  thumbnail?: string
  width: number
  height: number
  type: 'image' | 'video'
}

const { thumbnails } = useLightboxDialog()

const isOpen = ref(false)

const overlayBg = ref('')
const overlayBlurSize = ref(0)
const overlayPointerEvents = ref('auto')
const dialogOverlayStyles = computed(() => `background-color: ${overlayBg.value}; backdrop-filter: blur(${overlayBlurSize.value}px); pointer-events: ${overlayPointerEvents.value}`)

async function open() {
  isOpen.value = true
  await nextTick()
  overlayBg.value = 'rgba(0, 0, 0, 0.5)',
  overlayBlurSize.value = 4
}

async function close() {
  overlayBg.value = 'rgba(0, 0, 0, 0)'
  overlayBlurSize.value = 0
  overlayPointerEvents.value = 'none'
  await promiseTimeout(300)
  isOpen.value = false
}

const swiperRef = ref<InstanceType<typeof Swiper>>()
  
const swiper = computed(() => {
  if (!swiperRef.value) return

  return swiperRef.value.swiper
})

const items = ref<LightboxItem[]>()
const isSingleItem = computed(() => items.value?.length === 1)
const activeItemIndex = ref(0)

onKeyStroke(['d', 'D', 'ArrowRight'], nextItem)
onKeyStroke(['a', 'A', 'ArrowLeft'], previousItem)

function openItem(i: number) {
  activeItemIndex.value = i
  open()
}

function nextItem() {
  swiper.value?.slideNext()
}

function previousItem() {
  swiper.value?.slidePrev()
}

function initLightbox() {
  if (!thumbnails.value) return

  items.value = thumbnails.value?.map((item, i): LightboxItem => {
    const thumbnailEl = item as HTMLElement

    useEventListener(item, 'click', () => openItem(i))

    if (item.dataset.wasClicked === '') {
      openItem(i)

      delete item.dataset.wasClicked
    }

    const {
      lightboxSrc: src,
      lightboxAlt: alt,
      lightboxThumbnail: thumbnail,
      lightboxWidth: width,
      lightboxHeight: height,
      lightboxType: type,
    } = thumbnailEl.dataset

    return {
      src,
      alt,
      thumbnail,
      width,
      height,
      type,
    } as unknown as LightboxItem
  })
}

watchEffect(initLightbox)

function onSwiperRealIndexChange(e) {
  const [swiper] = e.detail

  activeItemIndex.value = swiper.realIndex
}
</script>
