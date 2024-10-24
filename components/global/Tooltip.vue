<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger asChild>
        <slot />
      </TooltipTrigger>

      <TooltipPortal to="#teleports">
        <FadeInOpacityTransition>
          <TooltipContent
            class="py-2 px-3 bg-black border border-gray-700 text-white text-[14px] leading-none select-none rounded-xl will-change-[opacity]"
            :sideOffset="2.5"
            :collisionPadding="10"
            v-bind="forward"
          >
            {{ tooltip }}

            <TooltipArrow asChild>
              <div
                class="size-2 bg-black border-b border-r border-gray-700 -translate-y-1 rotate-45"
              ></div>
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
