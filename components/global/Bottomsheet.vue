<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInSideTransition>
        <DialogContent
          aria-describedby=""
          class="fixed bottom-0 p-4 w-full h-[75vh] flex flex-col bg-white rounded-t-2xl"
          :class="{ 'transition-[height]': !state.isSwiping }"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          ref="dialogContentRef"
        >
          <div class="absolute left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-400 rounded-full" />

          <VisuallyHidden>
            <DialogTitle />
          </VisuallyHidden>

          <Flex itemsCenter class="pb-4 h-12">
            <slot name="header" />
          </Flex>

          <ScrollArea
            @onScrollStart="onScrollStart"
            @onScroll="onScroll"
            @onScrollEnd="onScrollEnd"
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

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

const dialogContentRef = ref<InstanceType<typeof DialogContent>>()

const state: {
  isScrolling: boolean
  isSwiping: boolean
  touchStartY: number
  touchEndY: number
  touchDeltaY: number
  elInitialHeight: number
} = reactive({
  isScrolling: false,
  isSwiping: false,
  touchStartY: 0,
  touchEndY: 0,
  touchDeltaY: 0,
  elInitialHeight: 0
})

function onTouchStart(e: TouchEvent) {
  if (state.isScrolling) return

  const el = dialogContentRef.value?.$el as HTMLElement

  state.isSwiping = true
  state.touchStartY = e.touches[0].clientY
  state.elInitialHeight = el.clientHeight
}

function onTouchMove(e: TouchEvent) {
  if (state.isScrolling) return

  state.touchDeltaY = state.touchStartY - e.touches[0].clientY

  const el = dialogContentRef.value?.$el as HTMLElement
  el.style.height = `${state.elInitialHeight - (state.touchDeltaY * -1)}px`
}

function onTouchEnd(e: TouchEvent) {
  state.isSwiping = false

  if (Math.abs(state.touchDeltaY) <= 100) {
    const el = dialogContentRef.value?.$el as HTMLElement
    el.style.height = `${state.elInitialHeight}px`
  } else {
    setOpen(false)
  }
}

function onScrollStart(e: Event) {
  const target = e.target as HTMLElement
  
  state.isScrolling = target.scrollTop === 0 ? false : true
}

function onScroll(e: Event) {
  const target = e.target as HTMLElement

  state.isScrolling = target.scrollTop === 0 ? false : true
}

function onScrollEnd(e: Event) {
  state.isScrolling = false
}

const isOpen = ref(false)

function setOpen(value: boolean) {
  isOpen.value = value
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

watch(isOpen, (v) => !v && emits('close'))

defineExpose({ setOpen, toggleOpen })
</script>
