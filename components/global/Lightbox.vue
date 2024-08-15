<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1]" />
      </FadeInOpacityTransition>

      <DialogContent
        aria-describedby=""
        class="absolute inset-0 overflow-hidden"
        @closeAutoFocus="(e) => e.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <DialogClose asChild>
          <button class="absolute top-0 right-0 p-4 z-10">
            <ITablerX class="!size-8 text-white/30 hover:text-white transition-colors" />
          </button>
        </DialogClose>

        <Flex itemsCenter justifyBetween class="absolute inset-0">
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
            :options="{
              initialSlide: activeItemIndex,
              spaceBetween: 100,
              loop: true,
              zoom: true,
            }"
            class="!absolute inset-0"
            ref="swiperRef"
            @realIndexChange="(value) => activeItemIndex = value"
          >
            <SwiperSlide
              v-for="(item, i) in items"
              :key="i"
              :item
              :thumbnail="thumbnails![i]"
              :active="activeItemIndex === i"
              :swiper
              @close="open = false"
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
import type SwiperSlide from '~/components/global/swiper/SwiperSlide.vue'

export type Item = {
  src: string
  alt?: string
  thumbnail?: string
  width: number
  height: number
  type: 'image' | 'video' | 'gif'
}

const { images } = useLightboxDialog()

const open = ref(false)

const swiperRef = ref<InstanceType<typeof Swiper>>()
const swiper = computed(() => {
  if (!swiperRef.value) return

  return swiperRef.value.swiper
})

const thumbnails = ref<HTMLElement[]>()

const items = ref<Item[]>()
const isSingleItem = computed(() => items.value?.length === 1)
const activeItemIndex = ref(0)

onKeyStroke(['d', 'D', 'ArrowRight'], nextItem)
onKeyStroke(['a', 'A', 'ArrowLeft'], previousItem)

function openItem(i: number) {
  activeItemIndex.value = i
  open.value = true
}

function nextItem() {
  swiper.value?.slideNext()
}

function previousItem() {
  swiper.value?.slidePrev()
}

function initLightbox() {
  if (!images.value) return

  thumbnails.value = images.value

  items.value = thumbnails.value?.map((item, i): Item => {
    const thumbnailEl = item as HTMLElement

    useEventListener(item, 'click', () => openItem(i))

    if (item.dataset.clicked === 'true') {
      openItem(i)
      delete item.dataset.clicked
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
    } as unknown as Item
  })
}

watchEffect(initLightbox)
</script>
