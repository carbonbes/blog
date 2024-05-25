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

const enterActiveClass = computed(() => 'transition-transform duration-[250ms]')
const leaveActiveClass = computed(() => 'transition-transform duration-[250ms]')
const enterFromClass = computed(() => {
  if (props.side === 'top') return '-translate-y-full'
  if (props.side === 'right') return 'translate-x-full'
  if (props.side === 'bottom') return 'translate-y-full'
  if (props.side === 'left') return '-translate-x-full'
})
const leaveToClass = computed(() => {
  if (props.side === 'top') return '-translate-y-full'
  if (props.side === 'right') return 'translate-x-full'
  if (props.side === 'bottom') return 'translate-y-full'
  if (props.side === 'left') return '-translate-x-full'
})
</script>