<template>
  <NuxtImg
    :src
    :alt="alt || ''"
    :loading
    class="object-contain"
    :class="[{ 'cursor-zoom-in': zoomable, 'w-full h-full object-cover': fill }, size, rounded]"
    v-bind="lightboxAttrs"
  />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    zoomable?: boolean
    fill?: boolean
    src: string
    alt?: string
    loading?: 'lazy' | 'eager'
    originalWidth?: number
    originalHeight?: number
    size?: string
    rounded?: string
  }>(),
  {
    zoomable: false,
    fill: false,
    loading: 'lazy'
  }
)

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const lightboxAttrs = computed(() => {
  if (!props.zoomable) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.src,
    'data-lightbox-alt': props.alt,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': 'image'
  }
})
</script>
