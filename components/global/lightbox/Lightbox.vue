<template>
  <div v-bind="$attrs" ref="lightboxRef">
    <slot />
  </div>

  <DialogRoot v-model:open="open">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <DialogContent aria-describedby="" class="absolute inset-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <DialogClose asChild>
          <button class="absolute top-0 right-0 p-4 z-10">
            <ITablerX class="!size-8 text-gray-300" />
          </button>
        </DialogClose>

        <Flex itemsCenter justifyBetween class="absolute inset-0">
          <span class="absolute top-0 left-0 p-4 text-gray-300">
            {{ `${activeItemIndex + 1} / ${items?.length}` }}
          </span>

          <button class="z-10" @click="previousItem">
            <ITablerChevronLeft class="!size-12 text-gray-300" />
          </button>

          <Flex
            itemsCenter
            class="absolute inset-0"
            :class="{ 'transition-transform': !isWindowResizing }"
            :style="{ transform: `translateX(${screenWidth * activeItemIndex * -1}px)` }"
          >
            <LightboxItem
              v-for="(item, i) in items"
              :index="i"
              :item
              :activeItemIndex
              :activeItemThumbnailBounding
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

const els = ref<Element[]>()
const items = ref<Item[]>()

const {
  width: screenWidth,
  height: screenHeight,
  isWindowResizing
} = useWindowResizing()

const activeItemIndex = ref(0)

const currentItem = computed(() => {
  if (!items.value) return

  return items.value[activeItemIndex.value]
})

const currentItemOriginalEl = computed(() => {
  if (!els.value) return

  return els.value[activeItemIndex.value] as HTMLElement
})

const activeItemThumbnailBounding = useElementBounding(currentItemOriginalEl)

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
  els.value = [...lightboxRef.value!.querySelectorAll('[data-lightbox-item]')]

  items.value = els.value.map(
    (item, i) => {
      const itemEl = item as HTMLElement

      useEventListener(itemEl, 'click', () => openItem(i))

      const {
        lightboxSrc: src,
        lightboxAlt: alt,
        lightboxThumbnail: thumbnail,
        lightboxWidth: width,
        lightboxHeight: height,
        lightboxType: type
      } = itemEl.dataset

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
