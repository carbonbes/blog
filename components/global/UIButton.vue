<template>
  <Component
    :is="to ? nuxtLink : 'button'"
    :to
    :disabled
    :data-disabled="disabled"
    v-bind="$attrs"
    :class="classes"
  >
    <slot />
  </Component>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    to?: string
    size?: 's' | 'm' | 'l'
    disabled?: boolean
    tooltip?: string
  }>(),
  {
    size: 'm',
  }
)

const nuxtLink = defineNuxtLink({})

const classes = computed(() => ({
  'rounded text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-600/50 transition-all': true,
  'p-0.5 text-sm': props.size === 's',
  'p-1': props.size === 'm',
  'p-1.5': props.size === 'l',
}))
</script>
