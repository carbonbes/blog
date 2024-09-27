<template>
  <Component :is="tag">
    <template v-if="isLongText && textIsCollapsed">
      {{ truncatedText }}
      <button class="text-blue-500" @click="toggleCollapse">
        Раскрыть
      </button>
    </template>

    <template v-else>
      {{ text }}
      <button
        v-if="isLongText"
        class="text-blue-500"
        @click="toggleCollapse"
      >
        Скрыть
      </button>
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
    tag: 'p',
  }
)

const textIsCollapsed = ref(true)

const isLongText = computed(() => props.text.length > props.maxLength)

const truncatedText = computed(
  () => props.text.slice(0, props.maxLength) + '...'
)

onMounted(() => {
  textIsCollapsed.value = isLongText.value
})

function toggleCollapse() {
  textIsCollapsed.value = !textIsCollapsed.value
}
</script>
