<template>
  <Flex
    v-if="!isPlaying"
    center
    class="relative bg-cover bg-center bg-no-repeat cursor-pointer group/overlay before:content-[''] before:absolute before:inset-0 before:bg-black/35 bg-gray-100/50"
    :class="[
      size,
      aspectRatio,
      {
        'cursor-zoom-in': zoomable || lightboxItem,
      },
    ]"
    :style="{ backgroundImage: `url(${thumbnail}` }"
    v-bind="lightboxAttrs"
    ref="thumbnailRef"
    @click="onThumbnailClick"
  >
    <div class="p-3 w-fit bg-black/50 rounded-full backdrop-blur-[2px]">
      <ITablerPlayerPlay class="text-white [&>path]:fill-white" />
    </div>
  </Flex>

  <video
    v-else
    :src
    :autoplay
    :loop
    :controls
    :playsinline="playsInline"
    :muted
    :class="[size, aspectRatio]"
  />
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'

const props = withDefaults(
  defineProps<{
    src?: string
    description?: string
    thumbnail?: string
    originalWidth?: number
    originalHeight?: number
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
    playsInline?: boolean
    size?: string | object
    aspectRatio?: string
    muted?: boolean
    zoomable?: boolean
    lightboxItem?: boolean
    parent?: HTMLElement
    ignoreThumbnailClick?: boolean
    class?: string
  }>(),
  {
    muted: true,
    playsInline: true,
  }
)

const isPlaying = ref(false)

const lightboxAttrs = computed(() => {
  if (!(props.zoomable || props.lightboxItem)) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.src,
    'data-lightbox-alt': props.description,
    'data-lightbox-thumbnail': props.thumbnail,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': 'video',
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
      lightboxItem: props.lightboxItem,
      parent: props.parent,
    })
  } else {
    isPlaying.value = true
  }
}

defineExpose({ isPlaying })
</script>
