<template>
  <div class="relative aspect-video">
    <Flex
      v-if="!isPlaying"
      center
      class="absolute inset-0 after:content-[''] after:absolute after:inset-0 after:bg-black/50 bg-cover bg-center cursor-pointer group/overlay"
      :class="[size]"
      :style="{ backgroundImage: `url(${thumbnail}`}"
      @click="isPlaying = true"
    >
      <ITablerPlayerPlay
        v-if="type === 'default'"
        class="!size-10 text-white [&>path]:fill-white z-[1] group-hover/overlay:scale-90 transition-transform"
      />
      <IIconsYoutube v-else />
    </Flex>

    <video
      v-if="type === 'default' && isPlaying"
      :src
      :autoplay
      :loop
      :controls
      :class="[size]"
    />

    <iframe
      v-else-if="type === 'youtube' && isPlaying"
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

const isPlaying = ref(false)
</script>
