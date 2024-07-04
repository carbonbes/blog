<template>
  <Component
    :is="zoomable ? 'a' : tag"
    class="overflow-hidden"
    :class="[{ 'cursor-zoom-in': zoomable, 'w-full h-full object-cover': fill }, rounded]"
    v-bind="pswpAttrs"
    ref="imgWrapperRef"
  >
    <NuxtImg
      :src
      alt=""
      loading="lazy"
      class="object-contain"
      :class="[size]"
      ref="imgRef"
    />
  </Component>
</template>

<script lang="ts" setup>
import type { NuxtImg } from '#build/components'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = withDefaults(
  defineProps<{
    tag?: string
    zoomable?: boolean
    fill?: boolean
    src: string
    srcWidth?: number
    srcHeight?: number
    size?: string
    rounded?: string
    galleryItem?: boolean
  }>(),
  {
    tag: 'div',
  }
)

const emit = defineEmits<{
  isOpen: [boolean]
}>()

const { setPreviewOpen } = useImagePreview()

const imgWrapperRef = ref()
const imgRef = ref<InstanceType<typeof NuxtImg>>()
const lightbox = ref<PhotoSwipeLightbox>()

function initPhotoswipe() {
  if (lightbox.value) return

  lightbox.value = new PhotoSwipeLightbox({
    gallery: props.galleryItem ? imgWrapperRef.value.parentNode : imgWrapperRef.value,
    children: props.galleryItem
      ? [...imgWrapperRef.value.parentNode.children]
      : undefined,
    pswpModule: () => import('photoswipe'),
    mainClass: 'pointer-events-auto'
  })

  lightbox.value?.on('beforeOpen', () => {
    emit('isOpen', true)
    setPreviewOpen(true)
  })

  lightbox.value?.on('close', () => {
    emit('isOpen', false)
    setPreviewOpen(false)
  })

  lightbox.value.init()
}

function destroyPhotoswipe() {
  if (!lightbox.value) return

  lightbox.value.destroy()
  lightbox.value = undefined
}

const pswpAttrs = computed(() => {
  if (!props.zoomable) return undefined

  return {
    href: props.src,
    rel: 'nofollow',
    target: '_blank',
    'data-pswp-width': props.srcWidth,
    'data-pswp-height': props.srcHeight,
    'data-cropped': true,
  }
})

onMounted(() => {
  if (props.zoomable) initPhotoswipe()
})

onUnmounted(() => {
  if (props.zoomable) destroyPhotoswipe()
})
</script>
