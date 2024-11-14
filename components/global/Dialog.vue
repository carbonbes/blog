<template>
  <DialogRoot v-model:open="open">
    <DialogPortal to="#teleports">
      <FadeInOpacityTransition>
        <DialogOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </FadeInOpacityTransition>

      <FadeInScaleTransition>
        <DialogContent
          aria-describedby=""
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col bg-white rounded-xl"
          v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
        >
          <VisuallyHidden>
            <DialogTitle />
          </VisuallyHidden>

          <Flex itemsCenter class="pb-4" :class="[headerClass]">
            <slot name="header" />

            <button class="ml-auto" @click="onCloseDown">
              <ITablerX class="hover:opacity-50 transition-opacity" />
            </button>
          </Flex>

          <slot />

          <Flex
            v-if="$slots.footer"
            itemsCenter
            class="pt-4"
            :class="[footerClass]"
          >
            <slot name="footer" />
          </Flex>
        </DialogContent>
      </FadeInScaleTransition>
    </DialogPortal>
  </DialogRoot>
</template>

<script lang="ts" setup>
import {
  useEmitAsProps,
  type DialogContentEmits,
  type DialogContentProps,
} from 'radix-vue'

const props = defineProps<
  DialogContentProps & {
    class?: string | object
    headerClass?: string | object
    footerClass?: string | object
    closeCallback?: () => void
  }
>()

const emits = defineEmits<DialogContentEmits>()

const emitsAsProps = useEmitAsProps(emits)

const open = defineModel('open', { type: Boolean, default: false })

function onCloseDown() {
  if (props.closeCallback) props.closeCallback()
  else open.value = false
}
</script>
