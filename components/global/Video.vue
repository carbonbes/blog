<template>
  <div>
    <Flex
      v-if="!isPlaying"
      center
      class="relative w-full after:content-[''] after:absolute after:inset-0 after:bg-black/50 bg-contain bg-no-repeat bg-center cursor-pointer group/overlay"
      :class="[size, aspectRatio]"
      :style="{ backgroundImage: `url(${thumbnail}`}"
      @click="isPlaying = true"
    >
      <ITablerPlayerPlay
        v-if="type === 'video'"
        class="!size-10 text-white [&>path]:fill-white z-[1] group-hover/overlay:scale-[1.2] transition-transform"
      />
      <IIconsYoutube v-else />
    </Flex>

    <video
      v-if="['video', 'gif'].includes(type) && isPlaying"
      :src
      :autoplay
      :loop
      :controls
      :playsinline="playsInline"
      :class="[size, aspectRatio]"
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
  type: 'video' | 'gif' | 'youtube'
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  playsInline?: boolean
  size?: string
  aspectRatio?: string
}>()

const isPlaying = ref(props.type === 'gif' ? true : false)
</script>
