<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <FadeTransition>
        <DialogOverlay class="fixed inset-0 bg-[rgba(0,_0,_0,_0.5)]" />
      </FadeTransition>

      <FadeTransition>
        <DialogContent
          aria-describedby=""
          class="fixed inset-0 p-4 bg-white rounded-xl"
          v-bind="{ ...props, ...emitsAsProps }"
        >
          <Flex items-center>
            <DialogTitle
              v-if="title"
              :as="titleTag"
            >
              {{ title }}
            </DialogTitle>

            <DialogClose>
              <ITablerX />
            </DialogClose>
          </Flex>

          <slot />
        </DialogContent>
      </FadeTransition>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import { useEmitAsProps, type DialogContentEmits, type DialogContentProps } from 'radix-vue'

const props = withDefaults(
  defineProps<DialogContentProps & {
    title?: string
    titleTag?: 'h2' | 'h3'
  }>(),
  {
    titleTag: 'h3',
  },
)

const emits = defineEmits<DialogContentEmits>()

const emitsAsProps = useEmitAsProps(emits)

const isOpen = ref(false)

function setOpen(value: boolean) {
  isOpen.value = value
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

defineExpose({ setOpen, toggleOpen })
</script>
