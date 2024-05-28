<template>
  <ScrollAreaRoot
    class="w-full h-full overflow-hidden"
    v-bind="$attrs"
  >
    <ScrollAreaViewport
      class="w-full h-full"
      :class="{ '!overflow-hidden': disableScroll }"
      asChild
    >
      <slot />
    </ScrollAreaViewport>

    <FadeInOpacityTransition>
      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
        v-if="direction === 'vertical'"
      >
        <ScrollAreaThumb
          class="relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] flex-1 rounded-[10px] bg-gray-300 hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>

      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
        v-else
      >
        <ScrollAreaThumb
          class="relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] flex-1 rounded-[10px] bg-gray-300 hover:bg-gray-400 transition-colors"
        />
      </ScrollAreaScrollbar>
    </FadeInOpacityTransition>
  </ScrollAreaRoot>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  direction?: 'horizontal' | 'vertical'
  class?: string
  disableScroll?: boolean
}>(), {
  direction: 'vertical',
  disableScroll: false
})
</script>
