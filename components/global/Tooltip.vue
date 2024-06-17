<template>
  <TooltipProvider>
    <TooltipRoot v-bind="forward">
      <TooltipTrigger asChild>
        <slot />
      </TooltipTrigger>
      
      <TooltipPortal>
        <FadeInOpacityTransition>
          <TooltipContent
            class="px-[15px] py-[10px] bg-black text-white text-[15px] leading-none select-none rounded-lg will-change-[opacity]"
            :side-offset="5"
          >
            {{ tooltip }}
            <TooltipArrow class="fill-black" :width="8" />
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
