<template>
  <ScrollAreaRoot
    class="overflow-hidden w-full h-full"
    style="--scrollbar-size: 10px"
  >
    <ScrollAreaViewport class="w-full h-full rounded" :class="{ '!overflow-hidden': ignoreScroll }" asChild>
      <slot />
    </ScrollAreaViewport>
    <FadeTransition>
      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
        v-if="direction === 'vertical'"
      >
        <ScrollAreaThumb
          class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] bg-gray-300 hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
        v-else
      >
        <ScrollAreaThumb
          class="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] bg-gray-300 hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>
    </FadeTransition>
  </ScrollAreaRoot>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  ignoreScroll?: boolean
  class?: string
}>(), {
  direction: 'vertical',
  ignoreScroll: false
})
</script>
