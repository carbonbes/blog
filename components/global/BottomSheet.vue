<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

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
  isSwiping: false,
})

function resetState() {
  state.isScrolling = false
  state.isHovered = false
  state.scrollTop = 0
  state.isSwiping = false
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

const dialogScrollableContentRef = ref<HTMLDivElement>()

const canDialogContentScroll = computed(() => {
  if (!dialogScrollableContentRef.value) return false

  const { scrollHeight, clientHeight } = dialogScrollableContentRef.value

  return scrollHeight > clientHeight
})

const translate = useSpring({ y: 0 })

const dialogContentStyles = computed(() => `transform: translateY(${translate.y}px)`)

function initDialogContentHeaderDragGesture() {
  useGesture(dialogContentHeaderRef,
    {
      onDrag(dragState) {
        const {
          movement: [, movementY],
        } = dragState

        translate.y = movementY
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
        const { direction: [, directionY], cancel } = dragState

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

        const { movement: [, movementY] } = dragState

        translate.y = movementY
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
