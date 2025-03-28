<template>
  <PinInputRoot
    placeholder="○"
    otp
    type="number"
    v-model="code"
    class="flex gap-3"
    :class="[state]"
    @complete="(e) => emit('complete', e.join(''))"
  >
    <PinInputInput
      v-for="(id, index) in length"
      :key="id"
      :index="index"
      class="rounded-lg placeholder:text-gray-400 text-center outline-none border-2 border-gray-200 hover:border-blue-500/50 focus:border-blue-500 disabled:opacity-25 disabled:pointer-events-none transition"
      :class="[pinInputInputClasses, size, rounded]"
      :disabled
      ref="pinInputs"
    />
  </PinInputRoot>
</template>

<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import type { PinInputInput } from 'radix-vue'

const props = withDefaults(
  defineProps<{
    length?: number
    disabled?: boolean
    autofocus?: boolean
    size?: string | object
    rounded?: string | object
  }>(),
  {
    size: 'size-10',
    length: 6,
  }
)

const emit = defineEmits<{
  complete: [string]
}>()

const code = ref<string[]>([])
const pinInputs = ref<(typeof PinInputInput)[]>()

const state = reactive({
  success: false,
  error: false,
})

const pinInputInputClasses = computed(() => ({
  '!border-green-500': state.success,
  '!border-red-500 animate-shake': state.error,
}))

async function showSuccess() {
  state.success = true
  await promiseTimeout(3000)
  state.success = false
}

async function showError() {
  state.error = true
  await promiseTimeout(3000)
  state.error = false
  code.value = []
  pinInputs.value![0].$el.focus()
}

function focus() {
  pinInputs.value![0].$el.focus()
}

onMounted(() => {
  if (!props.autofocus) return

  focus()
})

defineExpose({ focus, showSuccess, showError })
</script>
