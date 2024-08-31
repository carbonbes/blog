<template>
  <swiper-container
    :slidesPerView
    :allowTouchMove="allowTouchMove"
    :speed="transitionDuration"
    :spaceBetween="spaceBetween"
    ref="swiperContainerRef"
  >
    <swiper-slide
      v-for="(child, index) in slots.default?.()"
      :key="index"
      class="h-full"
    >
      <Component :is="child" />
    </swiper-slide>
  </swiper-container>
</template>

<script lang="ts" setup>
import { register, type SwiperContainer } from 'swiper/element/bundle'

register()

withDefaults(
  defineProps<{
    initialIndex?: number
    slidesPerView?: number
    allowTouchMove?: boolean
    transitionDuration?: number
    spaceBetween?: number
  }>(),
  {
    slidesPerView: 1,
    allowTouchMove: false,
    transitionDuration: 200,
  }
)

const slot = defineSlots<{
  default(props: { activeIndex: number }): any
}>()

const slots = useSlots()

const swiperContainerRef = ref<SwiperContainer>()

const activeIndex = computed(() => swiperContainerRef.value?.swiper?.activeIndex)

function previous() {
  swiperContainerRef.value?.swiper?.slidePrev()
}

function next() {
  swiperContainerRef.value?.swiper?.slideNext()
}

defineExpose({ previous, next })
</script>