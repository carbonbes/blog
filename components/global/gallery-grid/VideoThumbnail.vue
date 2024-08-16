<template>
  <Flex
    center
    class="relative before:content-[''] before:absolute before:inset-0 before:bg-black/35 row-[1_span] cursor-zoom-in"
    v-bind="lightboxAttrs"
    ref="thumbnailRef"
    @click="setItems({ target: thumbnailRef?.$el, zoomable, lightboxItem })"
  >
    <div class="p-2 w-fit bg-black/50 rounded-full backdrop-blur-[2px]">
      <ITablerPlayerPlay class="text-white [&>path]:fill-white" />
    </div>
  </Flex>
</template>

<script lang="ts" setup>
import type Flex from '~/components/global/Flex.vue'

const props = defineProps<{
  src: string
  alt?: string
  originalWidth: number
  originalHeight: number
  thumbnail: string
  zoomable?: boolean
  lightboxItem?: boolean
}>()

const lightboxAttrs = computed(() => {
  if (!(props.zoomable || props.lightboxItem)) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.src,
    'data-lightbox-alt': props.alt,
    'data-lightbox-thumbnail': props.thumbnail,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': 'video',
  }
})

const { setItems } = useLightboxDialog()

const thumbnailRef = ref<InstanceType<typeof Flex>>()
</script>
