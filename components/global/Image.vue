<template>
  <Component
    :is="zoomable ? 'a' : tag"
    class="overflow-hidden"
    :class="{ 'cursor-zoom-in': zoomable, 'w-full h-full object-cover': fill, [rounded!]: true }"
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
      @load="onLoad"
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

const pswpSizes = reactive({
  width: 0,
  height: 0
})

function onLoad() {
  const img = imgRef.value?.$el as HTMLImageElement

  pswpSizes.width = img.naturalWidth
  pswpSizes.height = img.naturalHeight
}

const pswpAttrs = computed(() => {
  if (!props.zoomable) return undefined

  return {
    'data-pswp-src': props.src,
    'data-pswp-width': pswpSizes.width,
    'data-pswp-height': pswpSizes.height,
    'data-cropped': true,
    href: props.src,
    rel: 'nofollow',
    target: '_blank',
  }
})

onMounted(() => {
  if (props.zoomable) initPhotoswipe()
})

onUnmounted(() => {
  if (props.zoomable) destroyPhotoswipe()
})
</script>
