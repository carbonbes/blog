<template>
  <Transition :enterActiveClass :leaveActiveClass>
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
    if (n > o) name.value = 'next'
    else name.value = 'previous'
  }
)

const enterActiveClass = computed(() =>
  name.value === 'next' ? '!absolute animate-next' : '!absolute animate-previous-reverse')

const leaveActiveClass = computed(() =>
  name.value === 'next' ? '!absolute animate-previous' : '!absolute animate-next-reverse')
</script>
