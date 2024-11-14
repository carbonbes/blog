<template>
  <Dialog class="w-80" v-model:open="open">
    <UITextArea
      autofocus
      placeholder="Ссылка"
      class="max-h-80"
      v-model.trim="link"
    />

    <template #footer>
      <Flex itemsCenter class="ml-auto gap-2">
        <UIButton variant="secondary" @click="setOpen(false)">
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
}>()

const open = defineModel('open', { type: Boolean, default: false })

const link = ref('')

function complete() {
  open.value = false
  emit('complete', link.value)
  link.value = ''
}

function setOpen(value: boolean) {
  if (value) {
    open.value = true
  } else {
    open.value = false
    link.value = ''
  }
}
</script>
