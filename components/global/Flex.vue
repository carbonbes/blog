<template>
  <Component
    :is="tag"
    class="flex"
    :class="[{
      'flex-row': row,
      'flex-col': col,
      'items-start': itemsStart,
      'items-center': itemsCenter,
      'items-end': itemsEnd,
      'justify-start': justifyStart,
      'justify-center': justifyCenter,
      'justify-end': justifyEnd,
      'justify-between': justifyBetween,
      'justify-around': justifyAround,
      'justify-evenly': justifyEvenly,
    }]"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  tag?: string
  row?: boolean
  col?: boolean
  itemsStart?: boolean
  itemsCenter?: boolean
  itemsEnd?: boolean
  justifyStart?: boolean
  justifyCenter?: boolean
  justifyEnd?: boolean
  justifyBetween?: boolean
  justifyAround?: boolean
  justifyEvenly?: boolean
}>(), {
  tag: 'div',
})
</script>

<style lang="sass" scoped>

</style>