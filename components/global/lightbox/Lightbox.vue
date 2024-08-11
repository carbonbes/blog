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
            {{ `${activeItemIndex + 1} / ${items?.length}` }}
          </span>

          <button v-if="!isSingleItem" class="z-10" @click="previousItem">
            <ITablerChevronLeft class="!size-12 text-gray-300" />
          </button>

          <Flex
            itemsCenter
            class="absolute inset-0 touch-none"
            :class="{
              'transition-transform': !(isResizing || gestureState?.active),
            }"
            :style="itemsWrapperStyles"
            ref="itemsWrapperRef"
          >
            <LightboxItem
              v-for="(item, i) in items"
              :index="i"
              :item
              :activeItemIndex
              :activeItem
              :isLast="i + 1 === items?.length"
              :thumbnail="thumbnails![i]"
              @close="open = false"
            />
          </Flex>

          <button v-if="!isSingleItem" class="z-10" @click="nextItem">
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

const thumbnails = ref<HTMLElement[]>()

const itemsWrapperRef = ref<InstanceType<typeof Flex>>()

const itemsWrapperStyles = computed(() => ({
  transform: `translateX(${
    (screenWidth.value * activeItemIndex.value +
      (gestureState.value?.active && !isSingleItem.value
        ? gestureState.value?.movement[0]! * -1
        : 0)) *
    -1
  }px)`,
}))

const gestureState = useDragGesture(itemsWrapperRef, (dragState) => {
  const {
    active,
    movement: [x],
  } = dragState

  if (active || isSingleItem.value) return

  if (x <= -250) nextItem()
  if (x >= 250) previousItem()
})

const { width: screenWidth, isResizing } = useWindowResizing()

const items = ref<Item[]>()
const isSingleItem = computed(() => items.value?.length === 1)
const activeItemIndex = ref(0)

const activeItem = computed(() => {
  if (!items.value) return

  return items.value[activeItemIndex.value]
})

onKeyStroke(['d', 'D', 'ArrowRight'], nextItem)
onKeyStroke(['a', 'A', 'ArrowLeft'], previousItem)

function openItem(i: number) {
  activeItemIndex.value = i
  open.value = true
}

function nextItem() {
  activeItemIndex.value = (activeItemIndex.value + 1) % items.value!.length
}

function previousItem() {
  activeItemIndex.value =
    (activeItemIndex.value - 1 + items.value!.length) % items.value!.length
}

watchEffect(() => {
  if (!images.value) return

  thumbnails.value = images.value

  items.value = thumbnails.value?.map((item, i) => {
    const thumbnailEl = item as HTMLElement

    useEventListener(item, 'click', () => openItem(i))

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
    }
  })
})
</script>
