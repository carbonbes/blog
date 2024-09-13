<template>
  <Flex itemsCenter class="w-5 gap-1">
    <div
      v-for="_ in 3"
      class="w-1 h-1 bg-gray-300 rounded-full opacity-20 animate-[loader_1.25s_infinite] [&:nth-child(2)]:animation-delay-[0.1s] [&:nth-child(3)]:animation-delay-[0.2s]"
      :class="[color]"
    />
  </Flex>
</template>

<script lang="ts" setup>
const props = defineProps<{
  color?: string | object
}>()
</script>
