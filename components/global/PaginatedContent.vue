<template>
  <Component :is="tag">
    <slot />

    <Flex v-if="page !== totalPages" center>
      <Loader color="!bg-black" ref="loaderRef" />
    </Flex>
  </Component>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tag?: 'div'
    page: number
    totalPages: number
    pending?: boolean
    loaderThreshold?: number
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
      emits('nextPage')
    }

    if (props.page === props.totalPages) stop()
  },
  { threshold: props.loaderThreshold }
)
</script>
