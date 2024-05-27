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
const enterActiveClass = computed(() => 'transition-opacity duration-[250ms]')
const leaveActiveClass = computed(() => 'transition-opacity duration-[250ms]')
</script>
