<template>
  <div v-bind="$attrs" ref="lightboxRef">
    <slot />
  </div>

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
          <span class="absolute top-0 left-0 p-4 text-gray-300 z-10">
            {{ `${activeItemIndex + 1} / ${items?.length}` }}
          </span>

          <button class="z-10" @click="previousItem">
            <ITablerChevronLeft class="!size-12 text-gray-300" />
          </button>

          <Flex
            itemsCenter
            class="absolute inset-0 touch-none"
            :class="{ 'transition-transform': !(isWindowResizing || state?.active) }"
            :style="{ transform: `translateX(${((screenWidth * activeItemIndex) + (state?.active ? (state?.movement[0]! * -1) : 0)) * -1}px)` }"
            ref="itemsRef"
          >
            <LightboxItem
              v-for="(item, i) in items"
              :index="i"
              :isLast="i + 1 === items?.length"
              :item
              :activeItemIndex
              :activeItem
              :thumbnail="thumbnails![i]"
              @close="open = false"
            />
          </Flex>

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

const emits = defineEmits<{ onOpen: [boolean] }>()

const lightboxRef = ref<HTMLDivElement>()

const open = ref(false)

watch(open, (v) => emits('onOpen', v))

const thumbnails = ref<Element[]>()
const items = ref<Item[]>()

const itemsRef = ref<InstanceType<typeof Flex>>()

const state = useDragGesture(itemsRef, (dragState) => {
  const { active, movement: [x] } = dragState

  if (active) return

  if (x <= -150) nextItem()
  if (x >= 150) previousItem()
})

const { width: screenWidth, isWindowResizing } = useWindowResizing()

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
  activeItemIndex.value++
}

function previousItem() {
  activeItemIndex.value--
}

onMounted(() => {
  thumbnails.value = [...lightboxRef.value!.querySelectorAll('[data-lightbox-item]')]

  items.value = thumbnails.value.map(
    (item, i) => {
      const thumbnailEl = item as HTMLElement

      useEventListener(item, 'click', () => openItem(i))

      const {
        lightboxSrc: src,
        lightboxAlt: alt,
        lightboxThumbnail: thumbnail,
        lightboxWidth: width,
        lightboxHeight: height,
        lightboxType: type
      } = thumbnailEl.dataset

      return {
        src,
        alt,
        thumbnail,
        width,
        height,
        type
      }
    }
  )
})
</script>
