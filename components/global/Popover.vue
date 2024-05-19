<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger v-if="$slots.trigger" asChild>
      <template name="trigger">
        <slot />
      </template>
    </PopoverTrigger>

    <PopoverPortal>
      <FadeTransition>
        <PopoverContent v-bind="{ ...forwarded, ...$attrs }" asChild>
          <slot />
        </PopoverContent>
      </FadeTransition>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script lang="ts" setup>
import {
  useForwardPropsEmits,
  type PopoverContentEmits,
  type PopoverContentProps
} from 'radix-vue'

const props = defineProps<PopoverContentProps & {
  class?: string
}>()
const emits = defineEmits<PopoverContentEmits & {
  close: any
}>()

const forwarded = useForwardPropsEmits(props, emits)

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
