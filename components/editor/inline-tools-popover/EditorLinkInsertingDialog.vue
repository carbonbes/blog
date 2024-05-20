<template>
  <Dialog class="w-80" ref="dialogRef">
    <UITextArea autofocus placeholder="Ссылка" v-model.trim="link" />

    <template #footer>
      <Flex itemsCenter class="ml-auto gap-2">
        <UIButton variant="secondary" @click="close">
          Отменить
        </UIButton>
        <UIButton :disabled="!isValidURL(link)" @click="complete">
          Вставить
        </UIButton>
      </Flex>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type Dialog from '~/components/global/Dialog.vue'

const emit = defineEmits<{
  complete: [string]
  cancel: any
  close: any
}>()

const dialogRef = ref<typeof Dialog>()

const link = ref('')

function complete() {
  emit('complete', link.value)
  dialogRef.value?.setOpen(false)
}

function open() {
  emit('cancel')
  dialogRef.value?.setOpen(true)
}

function close() {
  emit('close')
  dialogRef.value?.setOpen(false)
}

defineExpose({ open })
</script>
