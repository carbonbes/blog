<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0" :style="dialogOverlayStyles" />

      <DialogContent
        aria-describedby=""
        class="fixed bottom-0 after:content-[''] after:absolute after:top-full after:right-0 after:left-0 after:h-screen w-full h-3/4 max-h-full flex flex-col bg-white rounded-t-3xl will-change-transform"
        :style="dialogContentStyles"
        v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
        @closeAutoFocus="(e) => e.preventDefault()"
        @pointerDownOutside="
          (e) => {
            e.preventDefault()
            setOpen(false)
          }
        "
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <Flex
          center
          class="py-4 pb-8 touch-none"
          ref="dialogContentHeaderRef"
        >
          <div class="w-10 h-1 bg-gray-400 rounded-full" />
        </Flex>

        <div
          class="w-full h-full touch-pan-y overflow-y-auto"
          :class="[contentClass, { 'overflow-y-hidden': state.isSwiping }]"
          ref="dialogScrollableContentRef"
          @touchstart="state.isHovered = true"
          @touchend="state.isHovered = false"
        >
          <Component
            :is="withSlideTransition ? 'SlideTransition' : 'div'"
            :index="withSlideTransition ? slideTransitionIndex : undefined"
            class="px-4"
          >
            <slot />
          </Component>
        </div>

        <Flex
          v-if="$slots.footer"
          class="p-4 h-20"
          :class="[footerClass]"
        >
          <slot name="footer" />
        </Flex>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import {
  DialogContent,
  useEmitAsProps,
  type DialogContentEmits,
  type DialogContentProps,
} from 'radix-vue'
import { useSpring } from 'vue-use-spring'
import type { DragGestureState } from '~/composables/useGesture'
import { promiseTimeout } from '@vueuse/core'

const props = defineProps<
  DialogContentProps & {
    class?: string
    contentClass?: string
    footerClass?: string
    withSlideTransition?: boolean
    slideTransitionIndex?: number
  }
>()

const emits = defineEmits<
  DialogContentEmits & {
    onOpen: [boolean]
  }
>()

const emitsAsProps = useEmitAsProps(emits)

const isOpen = ref(false)

async function setOpen(value: boolean) {
  if (!value) {
    playCloseAnimation()
    await promiseTimeout(150)
    isOpen.value = false
  } else {
    playOpenAnimation()
    isOpen.value = true
  }
}

watch(isOpen, (v) => {
  emits('onOpen', v)
  if (v) {
    playOpenAnimation()
    initDialogContentHeaderDragGesture()
    initDialogContentGestures()
  }
})

const state = reactive({
  isScrolling: false,
  isHovered: false,
  scrollTop: 0,
  isSwiping: false,
})

const dialogContentHeaderRef = ref<HTMLDivElement>()
const dialogScrollableContentRef = ref<HTMLDivElement>()

const canDialogContentScroll = computed(() => {
  const contentRef = dialogScrollableContentRef.value
  return contentRef ? contentRef.scrollHeight > contentRef.clientHeight : false
})

const translate = useSpring(
  { y: 0 },
  {
    mass: 1.75,
    tension: 500,
    friction: 40,
  }
)

const { height: screenHeight } = useWindowResizing()

watch(screenHeight, () => translate.y = -screenHeight.value * 0.75)

const dialogOverlayBgOpacity = ref(0)
const dialogOverlayBlurSize = ref(0)

function setDialogOverlayStyles() {
  const thresholdHeight = screenHeight.value * 0.75
  const maxBlur = 4
  const maxOpacity = 0.5

  const scrollPercentage = Math.min(
    1,
    Math.max(0, (translate.y + thresholdHeight) / thresholdHeight)
  )

  dialogOverlayBgOpacity.value = maxOpacity * (1 - scrollPercentage)
  dialogOverlayBlurSize.value = maxBlur * (1 - scrollPercentage)
}

watch(() => translate.y, setDialogOverlayStyles)

function playOpenAnimation() {
  translate.y = -screenHeight.value * 0.75
}

function playCloseAnimation() {
  translate.y = 0
  dialogOverlayBgOpacity.value = 0
  dialogOverlayBlurSize.value = 0
}

const dialogOverlayStyles = computed(
  () =>
    `background-color: rgba(0, 0, 0, ${dialogOverlayBgOpacity.value}); backdrop-filter: blur(${dialogOverlayBlurSize.value}px)`
)

const dialogContentStyles = computed(
  () => `transform: translate3d(0, ${translate.y}px, 0)`
)

function getGestureDirection(value: number) {
  return value > 0 ? 'down' : value < 0 ? 'top' : undefined
}

async function onDragEndHandler(dragState: DragGestureState) {
  state.isSwiping = false

  const {
    movement: [, movementY],
    direction: [, directionY],
  } = dragState

  const direction = getGestureDirection(directionY)

  if (direction === 'down') {
    if (Math.abs(movementY) <= 150) {
      playOpenAnimation()
    } else {
      setOpen(false)
    }
  } else {
    playOpenAnimation()
  }
}

function initDialogContentHeaderDragGesture() {
  useGesture(
    dialogContentHeaderRef,
    {
      onDrag({ movement: [, movementY] }) {
        translate.y = -screenHeight.value * 0.75 + movementY
      },

      onDragEnd: onDragEndHandler,
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

function initDialogContentGestures() {
  useGesture(
    dialogScrollableContentRef,
    {
      onScrollStart() {
        state.isScrolling = true
      },

      onScroll({ offset: [, offsetY] }) {
        state.scrollTop = offsetY
      },

      async onScrollEnd() {
        await until(() => state.isHovered).toBe(false)
        state.isScrolling = false
      },

      onDrag(dragState) {
        const {
          movement: [, movementY],
          direction: [, directionY],
          cancel,
        } = dragState

        const direction = getGestureDirection(directionY)

        if (
          (canDialogContentScroll.value &&
            state.scrollTop === 0 &&
            direction === 'top') ||
          (canDialogContentScroll.value &&
            state.scrollTop > 0 &&
            direction === 'down')
        ) {
          cancel()
          return
        }

        state.isSwiping = true
        translate.y = -screenHeight.value * 0.75 + movementY
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
        eventOptions: {
          passive: false
        }
      },
    }
  )
}

defineExpose({ setOpen })
</script>
