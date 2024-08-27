<template>
  <Transition
    :enterActiveClass
    leaveActiveClass="transition-transform"
    enterFromClass="transition-transform"
    :leaveToClass
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
}>(), {
  side: 'bottom',
})

const enterActiveClass = computed(() => {
  if (props.side === 'top') return `animate-[fade-in-top-side_600ms] origin-top`
  if (props.side === 'right') return `animate-[fade-in-right-side_600ms] origin-right`
  if (props.side === 'bottom') return `animate-[fade-in-bottom-side_600ms] origin-bottom`
  if (props.side === 'left') return `animate-[fade-in-left-side_600ms] origin-left`
})
const leaveToClass = computed(() => {
  if (props.side === 'top') return '-translate-y-full'
  if (props.side === 'right') return 'translate-x-full'
  if (props.side === 'bottom') return 'translate-y-full'
  if (props.side === 'left') return '-translate-x-full'
})
</script>