<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeTransition>

      <FadeTransition>
        <DialogContent
          aria-describedby=""
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
        >
          <Flex itemsCenter class="pb-2 sm:pb-4">
            <DialogClose class="ml-auto">
              <ITablerX class="hover:opacity-50 transition-opacity" />
            </DialogClose>
          </Flex>

          <slot />

          <Flex v-if="$slots.footer" itemsCenter class="pt-2 sm:pt-4">
            <slot name="footer" />
          </Flex>
        </DialogContent>
      </FadeTransition>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import {
  useEmitAsProps,
  type DialogContentEmits,
  type DialogContentProps
} from 'radix-vue'

const props = defineProps<DialogContentProps & {
  class?: string
}>()

const emits = defineEmits<DialogContentEmits & {
  close: any
}>()

const emitsAsProps = useEmitAsProps(emits)

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
