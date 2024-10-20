<template>
  <Dialog
    class="fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @close="setOpen(false)"
    @interactOutside="onInteractOutside"
    ref="dialogRef"
  >
    <Editor />

    <template #footer>
      <EditorPanel />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen } = useEditorDialog(dialogRef)

const { isOpen } = useDrawer()

function onInteractOutside(e: Event) {
  if (!isOpen.value) return

  dialogRef.value?.dialogContentRef?.$el.focus()

  return e.preventDefault()
}
</script>
