<template>
  <PinInputRoot
    placeholder="○"
    otp
    type="number"
    v-model="code"
    class="flex gap-3 items-center"
    :class="[state]"
    @complete="(e) => emit('complete', e.join(''))"
  >
    <PinInputInput
      v-for="(id, index) in length"
      :key="id"
      :index="index"
      :class="pinInputInputClasses"
      ref="pinInputs"
    />
  </PinInputRoot>

  <Label
    for="pin-input"
    class="text-red-500 text-center hidden"
    :class="{ '!block': state.error.value }"
  >
    {{ state.error.text }}
  </Label>
</template>

<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'
import type { PinInputInput } from 'radix-vue'

withDefaults(defineProps<{
  length?: number
  disabled?: boolean
}>(), {
  length: 6
})

const emit = defineEmits<{
  complete: [string]
}>()

const code = ref<string[]>([])
const pinInputs = ref<typeof PinInputInput[]>()

const state: {
  success: boolean
  error: {
    value: boolean
    text?: string
  }
} = reactive({
  success: false,
  error: {
    value: false,
    text: ''
  }
})

const pinInputInputClasses = computed(() => ({
  'w-10 h-10 sm:w-8 sm:h-8 rounded-lg placeholder:text-gray-400 text-center outline-none border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors': true,
  '!border-green-500': state.success,
  'animate-shake !border-red-500': state.error.value
}))

async function showSuccess() {
  state.success = true
  await promiseTimeout(3000)
  state.success = false
}

async function showError(text?: string) {
  state.error.value = true
  state.error.text = text
  await promiseTimeout(3000)
  state.error.value = false
  state.error.text = ''
  code.value = []
  pinInputs.value![0].$el.focus()
}

onMounted(() => pinInputs.value![0].$el.focus())

defineExpose({ showSuccess, showError })
</script>
