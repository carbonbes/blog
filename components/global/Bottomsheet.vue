<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInSideTransition>
        <DialogContent
          aria-describedby=""
          class="fixed bottom-0 p-4 w-full h-[75vh] max-h-full flex flex-col bg-white rounded-t-2xl"
          :class="{ 'transition-[height]': !state.isSwiping && isOpen }"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
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
  isScrolling: boolean
  scrollTop: number
  isSwiping: boolean
  touchStartY: number
  touchEndY: number
  touchDeltaY: number
  elInitialHeight: number
} = reactive({
  isScrolling: false,
  scrollTop: 0,
  isSwiping: false,
  touchStartY: 0,
  touchEndY: 0,
  touchDeltaY: 0,
  elInitialHeight: 0
})

const dialogContentRef = ref<InstanceType<typeof DialogContent>>()
const scrollAreaRef = ref<InstanceType<typeof ScrollArea>>()

const isScrollable = computed(() => {
  const el = scrollAreaRef.value?.$el as HTMLElement
  const parentEl = el.parentNode as HTMLElement

  return el.scrollHeight > parentEl.clientHeight
})

function onTouchStart(e: TouchEvent) {
  const el = dialogContentRef.value?.$el as HTMLElement

  state.touchStartY = e.touches[0].clientY
  state.elInitialHeight = el.clientHeight
}

function onTouchMove(e: TouchEvent) {
  const direction = Math.abs(e.touches[0].clientY) - Math.abs(state.touchStartY) > 0 ? 'down' : 'up'

  if ((isScrollable.value && state.scrollTop >= 0 && direction === 'up') || state.isScrolling) return

  state.isSwiping = true
  state.touchDeltaY = state.touchStartY - e.touches[0].clientY
  state.touchEndY = e.touches[0].clientY

  const dialogEl = dialogContentRef.value?.$el as HTMLElement
  dialogEl.style.height = `${state.elInitialHeight - (state.touchDeltaY * -1)}px`
}

function onTouchEnd() {
  state.isSwiping = false

  const direction = Math.abs(state.touchEndY) - Math.abs(state.touchStartY) > 0 ? 'down' : 'up'

  if (direction === 'down') {
    if (Math.abs(state.touchDeltaY) <= 150) {
      const dialogEl = dialogContentRef.value?.$el as HTMLElement
      dialogEl.style.height = ''
    } else {
      setOpen(false)
    }
  } else {
    const dialogEl = dialogContentRef.value?.$el as HTMLElement
    dialogEl.style.height = ''
  }
}

function onScroll(e: Event) {
  if (state.isSwiping) return

  state.isScrolling = true

  const target = e.target as HTMLElement
  state.scrollTop = target.scrollTop
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

watch(isOpen, (v) => !v && emits('close'))

defineExpose({ setOpen, toggleOpen })
</script>
