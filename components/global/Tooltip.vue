<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger asChild>
        <slot />
      </TooltipTrigger>

      <TooltipPortal>
        <FadeInOpacityTransition>
          <TooltipContent
            class="px-[15px] py-[10px] bg-black border border-gray-700 text-white text-[15px] leading-none select-none rounded-2xl will-change-[opacity]"
            :side-offset="2.5"
            :collision-padding="10"
            v-bind="forward"
          >
            {{ tooltip }}

            <TooltipArrow asChild>
              <div class="size-2 bg-black border-b border-r border-gray-700 -translate-y-1 rotate-45"></div>
            </TooltipArrow>
          </TooltipContent>
        </FadeInOpacityTransition>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import {
  useForwardPropsEmits,
  type TooltipRootEmits,
  type TooltipRootProps,
} from 'radix-vue'

const props = defineProps<
  TooltipRootProps & {
    tooltip?: string
    class?: string
  }
>()
const emits = defineEmits<TooltipRootEmits>()

const forward = useForwardPropsEmits(props, emits)
</script>
