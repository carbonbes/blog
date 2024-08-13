<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <DialogContent
        aria-describedby=""
        class="absolute inset-0 overflow-hidden"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <DialogClose asChild>
          <button class="absolute top-0 right-0 p-4 z-10">
            <ITablerX class="!size-8 text-gray-300" />
          </button>
        </DialogClose>

        <Flex itemsCenter justifyBetween class="absolute inset-0">
          <span
            v-if="!isSingleItem"
            class="absolute top-0 left-0 p-4 text-gray-300 z-10"
          >
            {{ `${swiper?.index} / ${items?.length}` }}
          </span>

          <button class="z-10" @click="previousItem">
            <ITablerChevronLeft class="!size-12 text-gray-300" />
          </button>

          <Swiper
            :slidesPerView="1"
            :spaceBetween="100"
            loop
            zoom
            :initialSlide="activeItemIndex"
            class="!absolute inset-0"
          >
            <SwiperSlide
              v-for="(item, i) in items"
              :key="i"
              class="!flex items-center justify-center"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.src"
                :alt="item.alt"
                loading="lazy"
                class="max-h-full select-none no-drag"
              />
            </SwiperSlide>
          </Swiper>

          <button class="z-10" @click="nextItem">
            <ITablerChevronRight class="!size-12 text-gray-300" />
          </button>
        </Flex>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import Flex from '~/components/global/Flex.vue'

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

const swiper = useSwiper()

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
  swiper?.slideNext()
}

function previousItem() {
  swiper?.slidePrev()
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
