<template>
  <Component :is="tag">
    <slot />

    <template v-if="page !== totalPages" name="loader">
      <Flex center>
        <Loader color="!bg-black" ref="loaderRef" />
      </Flex>
    </template>
  </Component>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    tag?: 'div'
    page: number
    totalPages: number
    pending?: boolean
  }>(),
  {
    tag: 'div',
  }
)

const emits = defineEmits<{
  nextPage: [void]
}>()

const loaderRef = ref<HTMLDivElement>()

const { stop } = useIntersectionObserver(
  loaderRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.page !== props.totalPages) {
      if (props.pending) return

      emits('nextPage')
    }

    if (props.page === props.totalPages) stop()
  },
  { threshold: 1 }
)
</script>
