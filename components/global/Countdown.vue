<template>
  <div>
    {{ state.countdown }}
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  initial: number,
  updateInterval?: number
  format?: string
}>(), {
  updateInterval: 1000,
  format: 'mm:ss'
})

const emit = defineEmits<{
  complete: any
}>()

const dayjs = useDayjs()

const state: {
  interval: ReturnType<typeof setTimeout> | undefined
  countdown: string
  delta: number
} = reactive({
  interval: undefined,
  countdown: '',
  delta: 0
})

function setCountdown() {
  state.delta = props.initial - Date.now()
  state.countdown = dayjs(state.delta).format(props.format)

  if (Math.floor(state.delta / 1000) === 0) {
    clearInterval(state.interval)
    emit('complete')

    return
  }
}

function startCounting() {
  setCountdown()
  state.interval = setInterval(setCountdown, props.updateInterval)
}

onMounted(startCounting)

onUnmounted(() => clearInterval(state.interval))

defineExpose({ startCounting })
</script>
