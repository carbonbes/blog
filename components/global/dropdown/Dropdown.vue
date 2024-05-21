<template>
  <DropdownMenuRoot :modal v-model:open="open">
    <DropdownMenuTrigger asChild>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <FadeTransition>
        <DropdownMenuContent v-bind="forwarded" asChild>
          <DropdownBody :items="items" :maxHeight />
        </DropdownMenuContent>
      </FadeTransition>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script lang="ts" setup>
import { useForwardPropsEmits, type DropdownMenuContentEmits, type DropdownMenuContentProps } from 'radix-vue'
import type { DropdownItem } from '~/types'

const props = withDefaults(
  defineProps<DropdownMenuContentProps & {
    modal?: boolean
    maxHeight?: string
    items: DropdownItem[]
  }>(),
  {
    modal: false,
    maxHeight: '250px',
  }
)
const emits = defineEmits<DropdownMenuContentEmits & {
  isOpen: [boolean]
}>()

const forwarded = useForwardPropsEmits(props, emits)

const open = ref(false)

watch(open, (v) => {
  emits('isOpen', v)
})
</script>
