<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInSideTransition>
        <DialogContent
          aria-describedby=""
          class="fixed bottom-0 after:content-[''] after:absolute after:top-full after:right-0 after:left-0 after:h-screen w-full h-[75vh] max-h-full flex flex-col bg-white rounded-t-2xl"
          :style="dialogContentStyles"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
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
            class="px-4 touch-pan-y overflow-auto overscroll-y-none"
            ref="dialogScrollableContentRef"
            @touchstart="dialogScrollableContentIsHovered = true"
            @touchend="dialogScrollableContentIsHovered = false"
          >
            <slot />
          </div>
        </DialogContent>
      </FadeInSideTransition>
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
import type { DragState } from '~/composables/useDragGesture'

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  isOpen: [boolean]
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

const state = reactive({
  isScrolling: false,
  scrollTop: 0,
  scrollDirection: null,
  isSwiping: false,
})

function resetState() {
  state.isScrolling = false
  state.scrollTop = 0
  state.isSwiping = false
  translate.y = 0
}

async function onDragEndHandler(dragState: DragState) {
  state.isSwiping = false

  const {
    movement: [, movementY],
    direction: [, directionY],
  } = dragState

  const direction =
    directionY > 0 ? 'down' : directionY < 0 ? 'top' : undefined

  if (direction === 'down') {
    if (Math.abs(movementY) <= 150) {
      translate.y = 0
    } else {
      setOpen(false)
      translate.y = 0
    }
  } else {
    translate.y = 0
  }
}

const dialogContentHeaderRef = ref<HTMLDivElement>()

const { init: dialogContentHeaderDragGestureInit } = useDragGesture(
  dialogContentHeaderRef,
  {
    onDrag(gestureState) {
      const {
        movement: [, movementY],
      } = gestureState

      translate.y = movementY
    },

    onDragEnd(gestureState) {
      onDragEndHandler(gestureState)
    },
  },
  {
    axis: 'y',
    bounds: { top: 0 },
    rubberband: [0, 0.125],
    from: [0, 0],
    filterTaps: true,
    pointer: { touch: true },
    manualInit: true,
  }
)

const dialogScrollableContentRef = ref<HTMLDivElement>()

const dialogScrollableContentIsHovered = ref(false)

const canDialogContentScroll = computed(() => {
  if (!dialogScrollableContentRef.value) return false

  const { scrollHeight, clientHeight } = dialogScrollableContentRef.value

  return scrollHeight > clientHeight
})

const dialogContentScrollTop = ref(0)

const { y } = useScroll(dialogScrollableContentRef, {
  onScroll() {
    console.log('scrolling')
    state.isScrolling = true
    dialogContentScrollTop.value = y.value
  },

  async onStop() {
    await until(dialogScrollableContentIsHovered).toBe(false)
    console.log('scroll end')
    state.isScrolling = false
  },
})

const translate = useSpring({ y: 0 })

const dialogContentStyles = computed(() => `transform: translateY(${translate.y}px)`)

const { init: dialogContentDragGestureInit } = useDragGesture(dialogScrollableContentRef,
  {
    onDrag(gestureState) {
      state.isSwiping = true

      const { direction: [, yDirection] } = gestureState

      const direction =
        yDirection > 0 ? 'down' : yDirection < 0 ? 'top' : undefined

      if (
        (canDialogContentScroll.value && dialogContentScrollTop.value === 0 && direction === 'top')
        || (canDialogContentScroll.value && dialogContentScrollTop.value > 0 && direction === 'down')
        || state.isScrolling
      ) return

      console.log('dragging')

      const { movement: [, movementY] } = gestureState

      translate.y = movementY
    },

    onDragEnd(gestureState) {
      console.log('drag end')

      onDragEndHandler(gestureState)
    }
  },
  {
    axis: 'y',
    bounds: { top: 0 },
    rubberband: [0, 0.125],
    from: [0, 0],
    filterTaps: true,
    pointer: { touch: true },
    manualInit: true,
  }
)

const isOpen = ref(false)

watch(isOpen, (v) => {
  emits('isOpen', v)

  if (v) {
    dialogContentHeaderDragGestureInit()
    dialogContentDragGestureInit()
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
