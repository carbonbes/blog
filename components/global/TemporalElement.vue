<template>
  <Primitive v-if="condition" asChild>
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'

const props = defineProps<{
  timeout: number
}>()

const emits = defineEmits<{
  unmounted: [void]
}>()

const condition = ref(true)

onMounted(async () => {
  await promiseTimeout(props.timeout)
  condition.value = false
  emits('unmounted')
})
</script>
