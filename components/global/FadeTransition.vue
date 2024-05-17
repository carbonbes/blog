<template>
  <Transition
    enterActiveClass="transition-opacity duration-[0.25s]"
    leaveActiveClass="transition-opacity duration-[0.25s]"
    enterFromClass="opacity-0"
    leaveToClass="opacity-0"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>

</script>
