<template>
  <div ref="lightboxRef">
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
          <button class="absolute top-0 right-0 z-10">
            <ITablerX class="!size-7 text-gray-300" />
          </button>
        </DialogClose>

        <Flex
          itemsCenter
          class="absolute inset-0"
          :style="{ transform: `translateX(${screenWidth * currentItem * -1}px)` }"
        >
          <template v-for="(item, i) in items">
            <Flex
              center
              class="absolute top-0 left-0 inset-0"
              :style="{ transform: `translateX(${screenWidth * i}px)` }"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.src"
                :alt="item.alt"
                loading="lazy"
                class="max-h-full"
              />
            </Flex>
          </template>
        </Flex>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
type Item = {
  src: string
  alt?: string
  thumbnail?: string
  width: number
  height: number
  type: 'image' | 'video' | 'gif'
}

const lightboxRef = ref<HTMLDivElement>()

const open = ref(false)

watch(open, (v) => !v && editor.value?.commands.blur())

const items = ref<Item[]>()

const { width: screenWidth } = useWindowSize()
const { editor } = useEditor()

const currentItem = ref(0)

onKeyStroke(['d', 'D', 'ArrowRight'], () => currentItem.value++)
onKeyStroke(['a', 'A', 'ArrowLeft'], () => currentItem.value--)

function openItem(i: number) {
  currentItem.value = i
  open.value = true
}

onMounted(() => {
  items.value = [...lightboxRef.value!.querySelectorAll('[data-lightbox-item]')].map(
    (item, i) => {
      const itemEl = item as HTMLElement

      itemEl.onclick = () => openItem(i)

      return {
        src: itemEl.dataset.lightboxSrc!,
        alt: itemEl.dataset.lightboxAlt!,
        thumbnail: itemEl.dataset.lightboxThumbnail!,
        width: +itemEl.dataset.lightboxWidth!,
        height: +itemEl.dataset.lightboxHeight!,
        type: itemEl.dataset.lightboxType! as 'image' | 'video' | 'gif'
      }
    }
  )
})
</script>
