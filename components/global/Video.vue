<template>
  <Flex
    v-if="!isPlaying"
    center
    class="relative before:content-[''] before:absolute before:inset-0 before:bg-black/35 bg-gray-100/50 cursor-pointer group/overlay"
    :class="[
      size,
      aspectRatio,
      {
        'bg-cover aspect-video rounded-xl overflow-hidden': type === 'youtube',
        'bg-contain bg-center bg-no-repeat': type === 'video',
        'cursor-zoom-in': zoomable || lightboxItem
      }
    ]"
    :style="{ backgroundImage: `url(${thumbnail}` }"
    v-bind="lightboxAttrs"
    ref="thumbnailRef"
    @click="onThumbnailClick"
  >
    <div
      v-if="type === 'video'"
      class="p-3 w-fit bg-black/50 rounded-full backdrop-blur-[2px]"
    >
      <ITablerPlayerPlay class="text-white [&>path]:fill-white" />
    </div>

    <IIconsYoutube
      v-else
      class="!size-16 z-[1] group-hover/overlay:text-red-600 transition-colors"
    />
  </Flex>

  <video
    v-if="type === 'video' && isPlaying"
    :src
    :autoplay
    :loop
    :controls
    :playsinline="playsInline"
    :muted
    :class="[size, aspectRatio]"
  />

  <iframe
    v-else-if="type === 'youtube' && isPlaying"
    :src="`${src}?controls=2&autoplay=1&enablejsapi=1&playsinline=1`"
    class="w-full aspect-video rounded-xl"
  />
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'

const props = withDefaults(
  defineProps<{
    class?: string
    src: string
    alt?: string
    thumbnail?: string
    originalWidth?: number
    originalHeight?: number
    type?: 'video' | 'youtube'
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
    playsInline?: boolean
    size?: string
    aspectRatio?: string
    muted?: boolean
    zoomable?: boolean
    lightboxItem?: boolean
    parent?: HTMLElement
    ignoreThumbnailClick?: boolean
  }>(),
  {
    type: 'video',
    muted: true,
    playsInline: true
  }
)

const isPlaying = ref(false)

const lightboxAttrs = computed(() => {
  if (!(props.zoomable || props.lightboxItem)) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.src,
    'data-lightbox-alt': props.alt,
    'data-lightbox-thumbnail': props.thumbnail,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': props.type,
  }
})

const { setItems } = useLightboxDialog()

const thumbnailRef = ref<InstanceType<typeof Flex>>()

function onThumbnailClick() {
  if (props.ignoreThumbnailClick) return

  if (props.zoomable || props.lightboxItem) {
    setItems({
      target: thumbnailRef.value?.$el,
      zoomable: props.zoomable,
      lightboxItem:props.lightboxItem,
      parent: props.parent
    })
  } else {
    isPlaying.value = true
  }
}
</script>
