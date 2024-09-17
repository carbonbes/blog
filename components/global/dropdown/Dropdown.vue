<template>
  <DropdownMenuRoot :modal v-model:open="isOpen">
    <DropdownMenuTrigger asChild>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <FadeInOpacityTransition>
        <DropdownMenuContent v-bind="forwarded" asChild>
          <DropdownBody :items="items" :maxHeight />
        </DropdownMenuContent>
      </FadeInOpacityTransition>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script lang="ts" setup>
import {
  useForwardPropsEmits,
  type DropdownMenuContentEmits,
  type DropdownMenuContentProps,
} from 'radix-vue'
import type { DropdownItem } from '~/types'

const props = withDefaults(
  defineProps<
    DropdownMenuContentProps & {
      class?: string | object
      modal?: boolean
      maxHeight?: string
      items: DropdownItem[]
    }
  >(),
  {
    modal: false,
    maxHeight: '275px',
  }
)
const emits = defineEmits<
  DropdownMenuContentEmits & {
    isOpen: [boolean]
  }
>()

const forwarded = useForwardPropsEmits(props, emits)

const isOpen = ref(false)

watch(isOpen, (v) => {
  emits('isOpen', v)
})

function setOpen(value: boolean) {
  isOpen.value = value
}

defineExpose({ setOpen })
</script>
