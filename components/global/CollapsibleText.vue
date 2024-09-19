<template>
  <Component :is="tag">
    <template v-if="isLongText && textIsCollapsed">
      <span>{{ `${text.slice(0, maxLength)}...` }}&nbsp;</span>
      <button
        class="text-blue-500"
        @click="textIsCollapsed = false"
      >
        Раскрыть
      </button>
    </template>

    <template v-else>
      {{ text }}
    </template>
  </Component>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text: string
    maxLength?: number
    tag?: string
  }>(),
  {
    maxLength: 300,
    tag: 'p'
  }
)

const isLongText = computed(() => props.text.length >= props.maxLength)

const textIsCollapsed = ref(isLongText.value)
</script>
