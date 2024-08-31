<template>
  <Transition
    :enterActiveClass
    :leaveActiveClass
    @onBeforeEnter="emits('onBeforeEnter')"
    @onEnter="emits('onEnter')"
    @onAfterEnter="emits('onAfterEnter')"
    @onEnterCancelled="emits('onEnterCancelled')"
    @onBeforeLeave="emits('onBeforeLeave')"
    @onLeave="emits('onLeave')"
    @onAfterLeave="emits('onAfterLeave')"
    @onLeaveCancelled="emits('onLeaveCancelled')"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    index: number
    duration?: number
  }>(),
  {
    duration: 200
  }
)

const emits = defineEmits<{
  onBeforeEnter: [void]
  onEnter: [void]
  onAfterEnter: [void]
  onEnterCancelled: [void]
  onBeforeLeave: [void]
  onLeave: [void]
  onAfterLeave: [void]
  onLeaveCancelled: [void]
}>()

watchEffect(() => {
  if (process.server) return

  const html = document.querySelector('html')
  html?.style.setProperty('--slideTransitionDuration', `${props.duration}ms`)
})

const name = ref('')

watch(
  () => props.index,
  (n, o) => {
    if (n > o) name.value = 'next'
    else name.value = 'previous'
  }
)

const enterActiveClass = computed(() =>
  name.value === 'next'
    ? '!absolute animate-[next_var(--slideTransitionDuration)]'
    : '!absolute animate-[previous-reverse_var(--slideTransitionDuration)]'
)

const leaveActiveClass = computed(() =>
  name.value === 'next'
    ? '!absolute animate-[previous_var(--slideTransitionDuration)]'
    : '!absolute animate-[next-reverse_var(--slideTransitionDuration)]'
)
</script>
