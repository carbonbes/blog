<template>
  <textarea
    :disabled
    :autofocus
    :placeholder
    :class="classes"
    v-model="model"
    ref="textArea"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  autofocus?: boolean
  placeholder?: string
}>()

const model = defineModel()

const textArea = ref<HTMLTextAreaElement>()

const classes = computed(() => 'outline-none resize-none rounded-lg placeholder:text-gray-400 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 disabled:opacity-25 disabled:pointer-events-none transition')

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