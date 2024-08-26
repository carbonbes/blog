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

        <Flex itemsCenter class="p-4 h-12">
          <div class="absolute left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-400 rounded-full" />
          <slot name="header" />
        </Flex>

        <div
          class="px-4 touch-pan-x overflow-auto"
          ref="dialogScrollableContentRef"
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

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  isOpen: [boolean]
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

const state = reactive({
  isScrollable: false,
  isScrolling: false,
  scrollTop: 0,
  scrollDirection: null,
  isSwiping: false,
  touchStartY: 0,
  touchEndY: 0,
  touchDeltaY: 0,
})

function resetState() {
  state.isScrollable = false
  state.isScrolling = false
  state.scrollTop = 0
  state.isSwiping = false
  state.touchStartY = 0
  state.touchEndY = 0
  state.touchDeltaY = 0
  translate.y = 0
}

const dialogScrollableContentRef = ref<HTMLDivElement>()

const {
  y,
  isScrolling,
  directions,
} = useScroll(dialogScrollableContentRef, {
  onScroll() {
    console.log('scrolling')
    state.isScrolling = true
    state.scrollTop = y.value
    state.scrollDirection = directions.top ? 'top' : directions.bottom ? 'bottom' : undefined

    console.log(state.isScrolling)
  },

  onStop() {
    state.isScrolling = false
  },
})

const translate = useSpring({ y: 0 })

const dialogContentStyles = computed(() => `transform: translateY(${translate.y}px)`)

const { init: dragGestureInit } = useDragGesture(dialogScrollableContentRef,
  {
    onDrag(gestureState) {
      if (
        state.isScrolling && state.scrollTop === 0 && state.scrollDirection === 'top'
        || state.isScrolling && state.scrollTop > 0 && state.scrollDirection === 'bottom'
        || state.isScrolling
      ) return

      console.log('dragging')

      const { movement: [, movementY] } = gestureState

      translate.y = movementY
      state.isSwiping = true
    },

    onDragEnd(gestureState) {
      console.log('drag end')

      state.isSwiping = false

      const { movement: [, movementY], direction: [, yDirection] } = gestureState

      const dir = yDirection > 0 ? 'down' : yDirection < 0 ? 'top' : undefined

      if (dir === 'down') {
        translate.y = 0
      }
    }
  },
  {
    axis: 'y',
    bounds: { top: 0 },
    rubberband: true,
    from: [0, 0],
    manualInit: true,
  }
)

/* function onTouchStart(e: TouchEvent) {
  if (state.isScrolling) return

  state.touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  const direction = Math.abs(e.touches[0].clientY) - Math.abs(state.touchStartY) > 0 ? 'down' : 'up'

  if ((state.isScrollable && state.scrollTop === 0 && direction === 'up') ||
    (state.isScrollable && state.scrollTop > 0 && direction === 'down') ||
    state.isScrolling
  ) return

  state.isSwiping = true
  state.touchDeltaY = state.touchStartY - e.touches[0].clientY
  state.touchEndY = e.touches[0].clientY

  state.translateY = `translateY(${state.touchDeltaY * -1}px)`
}

function onTouchEnd() {
  state.isSwiping = false

  const direction = Math.abs(state.touchEndY) - Math.abs(state.touchStartY) > 0 ? 'down' : 'up'

  if (direction === 'down') {
    if (Math.abs(state.touchDeltaY) <= 150) {
      state.translateY = ''
    } else {
      setOpen(false)
      state.translateY = ''
    }
  } else {
    state.translateY = ''
  }
}

function onScroll() {
  state.isScrolling = true
}

function onScrollEnd() {
  state.isScrolling = false
} */

const isOpen = ref(false)

watch(isOpen, (v) => {
  emits('isOpen', v)

  if (v) dragGestureInit()

  if (!v) {
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
