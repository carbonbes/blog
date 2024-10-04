<template>
  <NuxtImg
    :src
    :alt
    :loading
    :options
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
import type { ImageTransformOptions } from '~/types'

const props = withDefaults(
  defineProps<{
    fill?: boolean
    src: string
    originalSrc?: string
    alt?: string
    loading?: 'lazy' | 'eager'
    options?: ImageTransformOptions
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

const {
  public: { imageRoute },
} = useRuntimeConfig()

const buildQueryString = computed(() => {
  if (!props.options) return

  const queryString = Object.entries(props.options)
    .filter(([_, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&')

  return queryString ? `?${queryString}` : undefined
})

const src = computed(() => {
  if (!buildQueryString.value) return `${imageRoute}/${props.src}`

  return `${imageRoute}/${props.src}${buildQueryString.value}`
})

const { setItems } = useLightboxDialog()

const imgRef = ref<InstanceType<typeof NuxtImg>>()

const lightboxAttrs = computed(() => {
  if (!(props.zoomable || props.lightboxItem)) return

  return {
    'data-lightbox-item': true,
    'data-lightbox-src': props.originalSrc,
    'data-lightbox-alt': props.alt,
    'data-lightbox-width': props.originalWidth,
    'data-lightbox-height': props.originalHeight,
    'data-lightbox-type': 'image',
  }
})
</script>
