<template>
  <NuxtImg
    :src
    :alt
    :loading
    class="object-contain"
    :class="[
      { 'cursor-zoom-in': zoomable || lightboxItem, 'w-full h-full object-cover': fill },
      size,
      rounded,
    ]"
    v-bind="{ ...$attrs, ...lightboxAttrs }"
    ref="imgRef"
    @click="setImages"
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
    size?: string
    rounded?: string
    zoomable?: boolean
    lightboxItem?: boolean
  }>(),
  {
    alt: '',
    loading: 'lazy',
  }
)

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const { images: lightboxImages } = useLightboxDialog()

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

function setImages() {
  if (!(props.zoomable || props.lightboxItem)) return

  const el = imgRef.value?.$el as HTMLElement

  lightboxImages.value = props.zoomable
    ? [el]
    : Array.from(el.parentNode?.querySelectorAll('[data-lightbox-item]')!)

  el.dataset.clicked = 'true'
}
</script>
