<template>
  <Transition
    :enterActiveClass
    :leaveActiveClass
    @onBeforeEnter="emits('onBeforeEnter')"
    @onEnter="emits('onEnter')"
    @onAfterEnter="emits('onAfterEnter')"
    @onEnterCancelled="emits('onEnterCancelled')"
    @onBeforeLeave="emits('onBeforeLeave')"
    @onLeave="emits('onLeave')"
    @onAfterLeave="emits('onAfterLeave')"
    @onLeaveCancelled="emits('onLeaveCancelled')"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  index: number
}>()

const emits = defineEmits<{
  onBeforeEnter: [void]
  onEnter: [void]
  onAfterEnter: [void]
  onEnterCancelled: [void]
  onBeforeLeave: [void]
  onLeave: [void]
  onAfterLeave: [void]
  onLeaveCancelled: [void]
}>()

const name = ref('')

watch(
  () => props.index,
  (n, o) => {
    if (n > o) name.value = 'next'
    else name.value = 'previous'
  }
)

const enterActiveClass = computed(() =>
  name.value === 'next'
    ? '!absolute animate-next'
    : '!absolute animate-previous-reverse'
)

const leaveActiveClass = computed(() =>
  name.value === 'next'
    ? '!absolute animate-previous'
    : '!absolute animate-next-reverse'
)
</script>
