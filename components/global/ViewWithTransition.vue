<template>
  <Transition :name>
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  initialIndex: number
}>()

const name = ref('')

watch(
  () => props.initialIndex,
  (n, o) => {
    if (n > o) name.value = 'next-view'
    else name.value = 'previous-view'
  }
)
</script>

<style lang="sass" scoped>
.next-view, .previous-view
  &-enter-active,
  &-leave-active
    position: absolute

.next-view
  &-enter-active
    animation: next-view .25s

  &-leave-active
    animation: previous-view .25s

.previous-view
  &-enter-active
    animation: previous-view reverse .25s

  &-leave-active
    animation: next-view reverse .25s

@keyframes next-view
  0%
    opacity: 0
    transform: translateX(100%)

  100%
    opacity: 1
    transform: translateX(0)

@keyframes previous-view
  0%
    opacity: 1
    transform: translateX(0)

  100%
    opacity: 0
    transform: translateX(-100%)
</style>