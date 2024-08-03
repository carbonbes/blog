<template>
  <Transition
    :enterActiveClass
    :leaveActiveClass
    enterFromClass="opacity-0"
    leaveToClass="opacity-0"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{ duration?: string }>(),
  {
    duration: '250ms'
  }
)

const enterActiveClass = computed(() => `transition-opacity duration-[${props.duration}]`)
const leaveActiveClass = computed(() => `transition-opacity duration-[${props.duration}]`)
</script>
