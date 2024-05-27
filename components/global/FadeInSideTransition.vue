<template>
  <Transition
    :enterActiveClass
    :leaveActiveClass
    :enterFromClass
    :leaveToClass
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
}>(), {
  side: 'bottom'
})

const enterActiveClass = computed(() => {
  if (props.side === 'top') return 'animate-fade-in-top-side origin-top'
  if (props.side === 'right') return 'animate-fade-in-right-side origin-right'
  if (props.side === 'bottom') return 'animate-fade-in-bottom-side origin-bottom'
  if (props.side === 'left') return 'animate-fade-in-left-side origin-left'
})
const leaveActiveClass = computed(() => 'transition-transform')
const enterFromClass = computed(() => 'transition-transform')
const leaveToClass = computed(() => {
  if (props.side === 'top') return '-translate-y-full'
  if (props.side === 'right') return 'translate-x-full'
  if (props.side === 'bottom') return 'translate-y-full'
  if (props.side === 'left') return '-translate-x-full'
})
</script>