<template>
  <TransitionGroup
    move-class="transition-all duration-200"
    enter-active-class="transition-all duration-200"
    leave-active-class="absolute transition-all duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <slot />
  </TransitionGroup>
</template>

<script lang="ts" setup>
</script>
