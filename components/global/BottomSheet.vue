<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0"
        :style="dialogOverlayStyles"
      />

      <DialogContent
        aria-describedby=""
        class="fixed bottom-0 after:content-[''] after:absolute after:top-full after:right-0 after:left-0 after:h-screen w-full h-[75vh] max-h-full flex flex-col bg-white rounded-t-2xl"
        :style="dialogContentStyles"
        v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
        @closeAutoFocus="(e) => e.preventDefault()"
        @pointerDownOutside="(e) => e.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <Flex
          itemsCenter
          class="p-4 h-12 touch-none"
          ref="dialogContentHeaderRef"
        >
          <div class="absolute left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-400 rounded-full" />
          <slot name="header" />
        </Flex>

        <div
          class="px-4 w-full h-full touch-pan-y overflow-y-auto"
          :class="{ 'overflow-y-hidden': state.isSwiping }"
          ref="dialogScrollableContentRef"
          @touchstart="state.isHovered = true"
          @touchend="state.isHovered = false"
        >
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import {
  DialogContent,
  useEmitAsProps,
  type DialogContentEmits,
  type DialogContentProps
} from 'radix-vue'
import { useSpring } from 'vue-use-spring'
import type { DragGestureState } from '~/composables/useGesture'
import { promiseTimeout } from '@vueuse/core'

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  isOpen: [boolean]
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

const isOpen = ref(false)

const state = reactive({
  isScrolling: false,
  isHovered: false,
  scrollTop: 0,
  scrollDirection: null,
  dragMovementY: 0,
  isSwiping: false,
})

function resetState() {
  state.isScrolling = false
  state.isHovered = false
  state.scrollTop = 0
  state.isSwiping = false
  state.dragMovementY = 0
  translate.y = 0
}

async function onDragEndHandler(dragState: DragGestureState) {
  state.isSwiping = false

  const {
    movement: [, movementY],
    direction: [, directionY],
  } = dragState

  const direction =
    directionY > 0 ? 'down' : directionY < 0 ? 'top' : undefined

  if (direction === 'down') {
    if (Math.abs(movementY) <= 150) {
      playOpenAnimation()
    } else {
      playCloseAnimation()
    }
  } else {
    playOpenAnimation()
  }
}

const dialogContentHeaderRef = ref<HTMLDivElement>()

const dialogScrollableContentRef = ref<HTMLDivElement>()

const canDialogContentScroll = computed(() => {
  if (!dialogScrollableContentRef.value) return false

  const { scrollHeight, clientHeight } = dialogScrollableContentRef.value

  return scrollHeight > clientHeight
})

const translate = useSpring({ y: 0 }, {
  mass: 1.75,
  tension: 500,
  friction: 40,
})

const { height: screenHeight } = useWindowResizing()

const dialogOverlayBgOpacity = ref(0)
const dialogOverlayBlurSize = ref(0)

function setDialogOverlayStyles() {
  const thresholdHeight = (screenHeight.value / 100) * 75
  const maxBlur = 4
  const maxOpacity = 0.5

  if (translate.y <= -thresholdHeight) {
    dialogOverlayBgOpacity.value = maxOpacity
    dialogOverlayBlurSize.value = maxBlur
  } else {
    const scrollPercentage = Math.min(1, Math.max(0, (translate.y + thresholdHeight) / thresholdHeight))
    
    dialogOverlayBgOpacity.value = maxOpacity * (1 - scrollPercentage)
    dialogOverlayBlurSize.value = maxBlur * (1 - scrollPercentage)
  }
}

watch(() => translate.y, setDialogOverlayStyles)

function playOpenAnimation() {
  translate.y = ((screenHeight.value / 100) * 75 ) * -1
}

function playCloseAnimation() {
  translate.y = 0
  dialogOverlayBgOpacity.value = 0
  dialogOverlayBlurSize.value = 0

  setOpen(false)
}

watch(isOpen, (v) => {
  if (v) {
    playOpenAnimation()
  } else {
    playCloseAnimation()
  }
})

const dialogOverlayStyles = computed(() => `background-color: rgba(0, 0, 0, ${dialogOverlayBgOpacity.value}); backdrop-filter: blur(${dialogOverlayBlurSize.value}px)`)

const dialogContentStyles = computed(() => `transform: translateY(${translate.y}px)`)

function initDialogContentHeaderDragGesture() {
  useGesture(dialogContentHeaderRef,
    {
      onDrag(dragState) {
        const {
          movement: [, movementY],
        } = dragState

        state.dragMovementY = movementY

        translate.y = (((screenHeight.value / 100) * 75) * -1) + movementY
      },

      onDragEnd(dragState) {
        onDragEndHandler(dragState)
      },
    },
    {
      drag: {
        axis: 'y',
        bounds: { top: 0 },
        rubberband: true,
        from: [0, 0],
        filterTaps: true,
        pointer: { touch: true },
      }
    }
  )
}

function initDialogContentGestures() {
  useGesture(dialogScrollableContentRef,
    {
      onScrollStart() {
        state.isScrolling = true
      },

      onScroll(scrollState) {
        const { offset: [, offsetY] } = scrollState

        state.scrollTop = offsetY
      },

      async onScrollEnd() {
        await until(() => state.isHovered).toBe(false)
        state.isScrolling = false
      },

      onDrag(dragState) {
        const { movement: [, movementY], direction: [, directionY], cancel } = dragState

        state.dragMovementY = movementY

        const direction =
          directionY > 0 ? 'down' : directionY < 0 ? 'top' : undefined

        if (
          (canDialogContentScroll.value && state.scrollTop === 0 && direction === 'top')
          || (canDialogContentScroll.value && state.scrollTop > 0 && direction === 'down')
          || state.isScrolling
        ) {
          cancel()
          return
        }

        state.isSwiping = true

        translate.y = (((screenHeight.value / 100) * 75 ) * -1) + movementY
      },

      onDragEnd(dragState) {
        state.isHovered = true
        onDragEndHandler(dragState)
      }
    },
    {
      drag: {
        axis: 'y',
        bounds: { top: 0 },
        rubberband: true,
        from: [0, 0],
        filterTaps: true,
        pointer: { touch: true },
      },
    }
  )
}

watch(isOpen, (v) => {
  emits('isOpen', v)
  if (v) {
    initDialogContentHeaderDragGesture()
    initDialogContentGestures()
  } else if (!v) {
    emits('close')
    resetState()
  }
})

function setOpen(value: boolean) {
  isOpen.value = value
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

defineExpose({ setOpen, toggleOpen })
</script>
