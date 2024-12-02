<template>
  <NuxtImg
    :src
    :alt
    :loading
    class="object-contain"
    :class="{
      'cursor-zoom-in': zoomable || lightboxItem,
      'w-full h-full object-cover': fill,
    }"
    v-bind="{ ...$attrs, ...lightboxAttrs }"
    ref="imgRef"
    @click="setItems({ target: imgRef?.$el, zoomable, lightboxItem, parent })"
  />
</template>

<script lang="ts" setup>
import type { NuxtImg } from '#build/components'

const props = withDefaults(
  defineProps<{
    fill?: boolean
    src: string
    alt?: string
    loading?: 'lazy' | 'eager'
    originalWidth?: number
    originalHeight?: number
    zoomable?: boolean
    lightboxItem?: boolean
    parent?: HTMLElement
  }>(),
  {
    alt: '',
    loading: 'lazy',
  }
)

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const { setItems } = useLightboxDialog()

const imgRef = ref<InstanceType<typeof NuxtImg>>()

const lightboxAttrs = computed(() => {
  if (!(props.zoomable || props.lightboxItem)) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.src,
    'data-lightbox-alt': props.alt,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': 'image',
  }
})
</script>
