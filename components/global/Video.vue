<template>
  <div class="relative">
    <video
      v-if="type === 'default'"
      :src
      :autoplay
      :loop
      :controls
      :class="[size]"
    />

    <iframe
      v-else
      :src
      allow="autoplay;fullscreen;"
      :class="[size]"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  src: string
  thumbnail?: string
  type: 'default' | 'youtube'
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  size?: string
}>()
</script>
