<template>
  <swiper-container
    :init
    :initialSlide
    :loop
    :spaceBetween
    @swiperrealindexchange="onRealIndexChange"
    ref="swiperContainerRef"
  >
    <slot />
  </swiper-container>
</template>

<script lang="ts" setup>
import { register } from 'swiper/element/bundle'
import type { Swiper, SwiperOptions } from 'swiper/types'

register()

type SwiperContainer = HTMLElement & { swiper: Swiper }

withDefaults(
  defineProps<SwiperOptions>(),
  {
    init: true
  }
)

const emits = defineEmits<{
  realIndexChange: [number]
}>()

const swiperContainerRef = ref<SwiperContainer>()
const swiper = ref<Swiper>()

watchEffect(() => {
  swiper.value = swiperContainerRef.value?.swiper
})

function onRealIndexChange(e) {
  const [swiper] = e.detail

  emits('realIndexChange', swiper.realIndex)
}

defineExpose({ swiper })
</script>
