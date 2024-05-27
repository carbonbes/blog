<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInSideTransition>
        <DialogContent
          aria-describedby=""
          class="fixed bottom-0 p-4 w-full max-h-[75vh] flex flex-col bg-white rounded-t-xl"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
        >
          <VisuallyHidden>
            <DialogTitle />
          </VisuallyHidden>

          <Flex itemsCenter class="pb-4">
            <DialogClose class="ml-auto">
              <ITablerX class="hover:opacity-50 transition-opacity" />
            </DialogClose>
          </Flex>

          <slot />
        </DialogContent>
      </FadeInSideTransition>
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
