<template>
  <PinInputRoot
    placeholder="○"
    otp
    class="flex gap-3 items-center"
    @complete="(e) => emit('complete', +e.join(''))"
  >
    <PinInputInput
      v-for="(id, index) in length"
      :key="id"
      :index="index"
      :class="pinInputInputClasses"
      ref="pinInputs"
    />
  </PinInputRoot>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  length?: number
  disabled?: boolean
}>(), {
  length: 6
})

const emit = defineEmits<{
  complete: [number]
}>()

const error = ref(false)

const pinInputInputClasses = computed(() => ({
  'w-8 h-8 bg-white text-center rounded placeholder:text-gray-400 hover:outline-blue-300 focus:outline-blue-500 outline-none transition-all': true,
  'outline-red-500': error.value
}))

function triggerError() {
  
}

defineExpose({ triggerError })
</script>
