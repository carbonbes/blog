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
            {{ `${currentItemIndex + 1} / ${items?.length}` }}
          </span>

          <button class="z-10" @click="previousItem">
            <ITablerChevronLeft class="!size-12 text-gray-300" />
          </button>

          <Flex
            itemsCenter
            class="absolute inset-0"
            :class="{ 'transition-transform': !isWindowResizing }"
            :style="{ transform: `translateX(${screenWidth * currentItemIndex * -1}px)` }"
          >
            <template v-for="(item, i) in items">
              <div
                class="absolute top-0 left-0 inset-0"
                :style="{ transform: `translateX(${screenWidth * i}px)` }"
                :data-active-item="i === currentItemIndex"
              >
                <img
                  v-if="item.type === 'image'"
                  :src="item.src"
                  :alt="item.alt"
                  loading="lazy"
                  class="max-h-full"
                  :style="currentItemImgTransform"
                  v-on-click-outside="onClickOutside"
                />
              </div>
            </template>
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
import { vOnClickOutside } from '@vueuse/components'
import { useSpring, useMotionProperties } from '@vueuse/motion'
import { dragDirective as vDrag } from '@vueuse/gesture'

type Item = {
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

const { width: screenWidth, height: screenHeight } = useWindowSize()

const isWindowResizing = ref(false)

const debouncedWindowResize = useDebounceFn(() => {
  isWindowResizing.value = false
}, 500)

useEventListener(window, 'resize', () => {
  isWindowResizing.value = true
  debouncedWindowResize()
})

const currentItemIndex = ref(0)

const currentItem = computed(() => {
  if (!items.value) return

  return items.value[currentItemIndex.value]
})

const currentItemOriginalEl = computed(() => {
  if (!els.value) return

  return els.value[currentItemIndex.value] as HTMLElement
})

const currentItemOriginalElBounding = useElementBounding(currentItemOriginalEl)

const currentItemImgTransform = computed(() => {
  const { width: originalWidth, height: originalHeight } = currentItemOriginalElBounding

  const translateX = (screenWidth.value / 2) - (currentItem.value!.width / 2)
  const translateY = (screenHeight.value / 2) - (currentItem.value!.height / 2)
  const relativeScaleX = originalWidth.value / currentItem.value!.width
  const relativeScaleY = originalHeight.value / currentItem.value!.height

  return `transform: translate3d(${translateX}px, ${translateY}px, 0px)`
})

onKeyStroke(['d', 'D', 'ArrowRight'], nextItem)
onKeyStroke(['a', 'A', 'ArrowLeft'], previousItem)

function openItem(i: number) {
  currentItemIndex.value = i
  open.value = true
}

function nextItem() {
  currentItemIndex.value++
}

function previousItem() {
  currentItemIndex.value--
}

function onClickOutside(e: PointerEvent) {
  const { dataset: { activeItem } } = e.target as HTMLElement
  
  if (!activeItem) return

  open.value = false
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
