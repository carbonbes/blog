<template>
  <Dialog
    class="fixed inset-0 w-full h-full max-w-[780px] sm:max-h-[800px] !rounded-none sm:!rounded-xl"
    @close="setOpen(false)"
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
import type Editor from '~/components/editor/Editor.client.vue'

const dialogRef = ref<InstanceType<typeof Dialog>>()

const { setOpen } = useEditorDialog(dialogRef)
</script>
