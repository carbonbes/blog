<template>
  <textarea
    :disabled
    :autofocus
    :placeholder
    :class="classes"
    v-model="model"
    ref="textArea"
    @paste="(e) => emits('paste', e)"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  autofocus?: boolean
  placeholder?: string
}>()

const emits = defineEmits<{
  paste: [ClipboardEvent]
}>()

const model = defineModel<string>()

const textArea = ref<HTMLTextAreaElement>()

const classes = computed(() => 'p-2 rounded-lg placeholder:text-gray-400 border-2 border-gray-200 outline-none resize-none no-scrollbar hover:border-blue-500/50 focus:border-blue-500 disabled:opacity-25 disabled:pointer-events-none transition')

async function focus() {
  await nextTick()
  textArea.value?.focus()
}

function adjustHeight() {
  textArea.value!.style.height = 'auto'
  textArea.value!.style.height = textArea.value?.scrollHeight + 'px'
}

watch(model, () => adjustHeight())

onMounted(async () => {
  adjustHeight()

  if (props.autofocus) await focus()
})
</script>