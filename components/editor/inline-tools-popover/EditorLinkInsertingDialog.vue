<template>
  <Dialog ref="dialogRef">
    <UITextArea autofocus v-model="link" />

    <template #footer>
      <UIButton variant="secondary" @click="close">Отменить</UIButton>
      <UIButton>Вставить</UIButton>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'

const emit = defineEmits<{
  complete: [string]
  cancel: any
}>()

const dialogRef = ref<typeof Dialog>()

const link = ref('')

function open() {
  dialogRef.value?.setOpen(true)
}

function close() {
  dialogRef.value?.setOpen(false)
}

defineExpose({ open })
</script>
