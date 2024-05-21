<template>
  <Dialog class="w-80" @close="emit('close')" ref="dialogRef">
    <UITextArea autofocus placeholder="Ссылка" class="max-h-80" v-model.trim="link" />

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
  close: any
}>()

const dialogRef = ref<InstanceType<typeof Dialog>>()

const link = ref('')

function complete() {
  dialogRef.value?.setOpen(false)
  emit('complete', link.value)
  link.value = ''
}

function open() {
  dialogRef.value?.setOpen(true)
}

function close() {
  dialogRef.value?.setOpen(false)
  emit('close')
  link.value = ''
}

defineExpose({ open })
</script>
