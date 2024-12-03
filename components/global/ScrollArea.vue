<template>
  <ScrollAreaRoot
    class="w-full h-full overflow-hidden"
    v-bind="$attrs"
  >
    <ScrollAreaViewport
      class="w-full h-full"
      :class="[scrollAreaClass, { '!overflow-hidden': disableScroll }]"
      @scroll.passive="onScroll"
      @scrollcancel="onScrollCancel"
      ref="scrollAreaViewportRef"
      asChild
    >
      <slot />
    </ScrollAreaViewport>

    <FadeInOpacityTransition>
      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="vertical"
        v-if="direction === 'vertical'"
      >
        <ScrollAreaThumb
          class="relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[20px] before:min-h-[20px] flex-1 rounded-[10px] bg-gray-300 cursor-grab active:cursor-grabbing hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>

      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="horizontal"
        v-else
      >
        <ScrollAreaThumb
          class="relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[20px] before:min-h-[20px] flex-1 rounded-[10px] bg-gray-300 cursor-grab hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>
    </FadeInOpacityTransition>
  </ScrollAreaRoot>
</template>

<script lang="ts" setup>
import { ScrollAreaViewport } from 'radix-vue'

withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  class?: string | object
  scrollAreaClass?: string | object
  disableScroll?: boolean
}>(), {
  direction: 'vertical',
  disableScroll: false
})

const emit = defineEmits<{
  onScroll: [Event]
  onScrollEnd: [void]
  onScrollCancel: [Event]
  isScrollable: [boolean]
  scrollTop: [number]
}>()

function onScroll(e: Event) {
  emit('onScroll', e)

  onScrollEnd()

  const { scrollTop } = e.target as HTMLElement
  emit('scrollTop', scrollTop)
}

const onScrollEnd = useDebounceFn(() => {
  emit('onScrollEnd')
}, 100)

function onScrollCancel(e: Event) {
  emit('onScrollCancel', e)
}

const scrollAreaViewportRef = ref<InstanceType<typeof ScrollAreaViewport>>()

const isScrollable = computed(() => {
  const el = scrollAreaViewportRef.value?.$el as HTMLElement | undefined
  const parentEl = el?.parentNode as HTMLElement | undefined

  if (!(el && parentEl)) return false

  return el.scrollHeight > parentEl.clientHeight
})

watch(isScrollable, (v) => emit('isScrollable', v))
</script>
