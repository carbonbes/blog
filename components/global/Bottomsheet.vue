<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInSideTransition>
        <DialogContent
          aria-describedby=""
          class="fixed bottom-0 after:content-[''] after:absolute after:top-full after:right-0 after:left-0 after:h-screen p-4 w-full h-[75vh] max-h-full flex flex-col bg-white rounded-t-2xl"
          :class="{ 'transition-transform': !state.isSwiping }"
          :style="{ transform: state.translateY }"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
          @touchstart="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="onTouchEnd"
          :data-state-scrolling="state.isScrolling"
          :data-state-swiping="state.isSwiping"
          ref="dialogContentRef"
        >
          <div class="absolute left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-400 rounded-full" />

          <VisuallyHidden>
            <DialogTitle />
          </VisuallyHidden>

          <Flex itemsCenter class="pb-4 h-12">
            <slot name="header" />
          </Flex>

          <ScrollArea
            :disableScroll="state.isSwiping"
            ref="scrollAreaRef"
            @onScroll="onScroll"
            @onScrollEnd="onScrollEnd"
            @isScrollable="(value) => state.isScrollable = value"
            @scrollTop="(value) => state.scrollTop = value"
          >
            <slot />
          </ScrollArea>
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
import type ScrollArea from '~/components/global/ScrollArea.vue'

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

const state: {
  isScrollable: boolean
  isScrolling: boolean
  scrollTop: number
  isSwiping: boolean
  touchStartY: number
  touchEndY: number
  touchDeltaY: number
  translateY: string
} = reactive({
  isScrollable: false,
  isScrolling: false,
  scrollTop: 0,
  isSwiping: false,
  touchStartY: 0,
  touchEndY: 0,
  touchDeltaY: 0,
  translateY: ''
})

function resetState() {
  state.isScrollable = false
  state.isScrolling = false
  state.scrollTop = 0
  state.isSwiping = false
  state.touchStartY = 0
  state.touchEndY = 0
  state.touchDeltaY = 0
  state.translateY = ''
}

const dialogContentRef = ref<InstanceType<typeof DialogContent>>()
const scrollAreaRef = ref<InstanceType<typeof ScrollArea>>()

function onTouchStart(e: TouchEvent) {
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
}

const isOpen = ref(false)

function setOpen(value: boolean) {
  isOpen.value = value
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

watch(isOpen, (v) => {
  if (!v) {
    emits('close')
    resetState()
  }
})

defineExpose({ setOpen, toggleOpen })
</script>
