<template>
  <Component :is="tag">
    <slot />

    <Flex v-if="page !== totalPages" center>
      <Loader color="!bg-black" ref="loaderRef" />
    </Flex>
  </Component>
</template>

<script lang="ts" setup>
import { promiseTimeout } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    tag?: 'div'
    page: number
    totalPages: number
    pending?: boolean
    loaderThreshold?: number
    delayBeforeEmit?: number
  }>(),
  {
    tag: 'div',
    loaderThreshold: 1,
  }
)

const emits = defineEmits<{
  nextPage: [void]
}>()

const loaderRef = ref<HTMLDivElement>()

const { stop } = useIntersectionObserver(
  loaderRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting && props.page !== props.totalPages) {
      if (props.pending) return

      if (props.delayBeforeEmit) {
        await promiseTimeout(props.delayBeforeEmit)
      }

      emits('nextPage')
    }

    if (props.page === props.totalPages) stop()
  },
  { threshold: props.loaderThreshold }
)
</script>
