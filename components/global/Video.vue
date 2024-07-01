<template>
  <div>
    <Flex
      v-if="!isPlaying"
      center
      class="relative w-full aspect-video after:content-[''] after:absolute after:inset-0 after:bg-black/50 bg-contain bg-no-repeat bg-center cursor-pointer group/overlay"
      :class="[size]"
      :style="{ backgroundImage: `url(${thumbnail}`}"
      @click="isPlaying = true"
    >
      <ITablerPlayerPlay
        v-if="type === 'default'"
        class="!size-10 text-white [&>path]:fill-white z-[1] group-hover/overlay:scale-[1.2] transition-transform"
      />
      <IIconsYoutube v-else />
    </Flex>

    <video
      v-if="type === 'default' && isPlaying"
      :src
      :autoplay
      :loop
      :controls
      class="aspect-video"
      :class="[size]"
    />

    <iframe
      v-else-if="type === 'youtube' && isPlaying"
      :src
      allow="autoplay;fullscreen;"
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
