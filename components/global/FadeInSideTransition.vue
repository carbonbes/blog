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
  duration?: string
}>(), {
  side: 'bottom',
  duration: '250ms'
})

const enterActiveClass = computed(() => {
  if (props.side === 'top') return `animate-[fade-in-top-side_var(--fadeInSideTransitionDuration)] origin-top`
  if (props.side === 'right') return `animate-[fade-in-right-side_var(--fadeInSideTransitionDuration)] origin-right`
  if (props.side === 'bottom') return `animate-[fade-in-bottom-side_var(--fadeInSideTransitionDuration)] origin-bottom`
  if (props.side === 'left') return `animate-[fade-in-left-side_var(--fadeInSideTransitionDuration)] origin-left`
})
const leaveToClass = computed(() => {
  if (props.side === 'top') return '-translate-y-full'
  if (props.side === 'right') return 'translate-x-full'
  if (props.side === 'bottom') return 'translate-y-full'
  if (props.side === 'left') return '-translate-x-full'
})

watchEffect(() => {
  const html = document.querySelector('html') as HTMLElement

  html.style.setProperty('--fadeInSideTransitionDuration', props.duration)
})
</script>
