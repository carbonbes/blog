<template>
  <div class="swiper" ref="containerRef">
    <div class="swiper-wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Swiper } from 'swiper'
import { type SwiperOptions } from 'swiper/types'
import 'swiper/css/bundle'

const props = defineProps<{
  options?: SwiperOptions
}>()

const emits = defineEmits<{
  activeIndexChange: [number]
}>()

const containerRef = ref<HTMLElement>()
const swiper = ref<Swiper>()

function initSwiper() {
  if (!containerRef.value || swiper.value) return

  swiper.value = new Swiper(containerRef.value, props.options)
}

onMounted(initSwiper)

defineExpose({ swiper })
</script>
