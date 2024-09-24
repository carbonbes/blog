<template>
  <swiper-container
    v-bind="forwarded"
    ref="swiperContainerRef"
  >
    <slot />
  </swiper-container>
</template>

<script lang="ts" setup>
import { useForwardPropsEmits } from 'radix-vue'
import { register, type SwiperContainer } from 'swiper/element/bundle'
import type { Swiper, SwiperOptions } from 'swiper/types'

register()

type SwiperContainerEvents = {
  swiperautoplaystart: [CustomEvent<[swiper: Swiper]>]
  swiperautoplaystop: [CustomEvent<[swiper: Swiper]>]
  swiperautoplaypause: [CustomEvent<[swiper: Swiper]>]
  swiperautoplayresume: [CustomEvent<[swiper: Swiper]>]
  swiperautoplaytimeleft: [CustomEvent<[swiper: Swiper, timeLeft: number, percentage: number]>]
  swiperautoplay: [CustomEvent<[swiper: Swiper]>]
  swiperhashchange: [CustomEvent<[swiper: Swiper]>]
  swiperhashset: [CustomEvent<[swiper: Swiper]>]
  swiperkeypress: [CustomEvent<[swiper: Swiper, keyCode: string]>]
  swiperscroll: [CustomEvent<[swiper: Swiper, event: WheelEvent]>]
  swiperpaginationrender: [CustomEvent<[swiper: Swiper, paginationEl: HTMLElement]>]
  swiperpaginationupdate: [CustomEvent<[swiper: Swiper, paginationEl: HTMLElement]>]
  swiperpaginationhide: [CustomEvent<[swiper: Swiper]>]
  swiperpaginationshow: [CustomEvent<[swiper: Swiper]>]
  swipernavigationhide: [CustomEvent<[swiper: Swiper]>]
  swipernavigationshow: [CustomEvent<[swiper: Swiper]>]
  swipernavigationprev: [CustomEvent<[swiper: Swiper]>]
  swipernavigationnext: [CustomEvent<[swiper: Swiper]>]
  swiperscrollbardragstart: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperscrollbardragmove: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperscrollbardragend: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperzoomchange: [CustomEvent<[swiper: Swiper, scale: number, imageEl: HTMLElement, slideEl: HTMLElement]>]
  swiperinit: [CustomEvent<[swiper: Swiper]>]
  swiperbeforedestroy: [CustomEvent<[swiper: Swiper]>]
  swiperslidesupdated: [CustomEvent<[swiper: Swiper]>]
  swiperslidechange: [CustomEvent<[swiper: Swiper]>]
  swiperslidechangetransitionstart: [CustomEvent<[swiper: Swiper]>]
  swiperslidechangetransitionend: [CustomEvent<[swiper: Swiper]>]
  swiperslidenexttransitionstart: [CustomEvent<[swiper: Swiper]>]
  swiperslidenexttransitionend: [CustomEvent<[swiper: Swiper]>]
  swiperslideprevtransitionstart: [CustomEvent<[swiper: Swiper]>]
  swiperslideprevtransitionend: [CustomEvent<[swiper: Swiper]>]
  swipertransitionstart: [CustomEvent<[swiper: Swiper]>]
  swipertransitionend: [CustomEvent<[swiper: Swiper]>]
  swipertouchstart: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swipertouchmove: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swipertouchmoveopposite: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperslidermove: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swipertouchend: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperclick: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swipertap: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperdoubletap: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperprogress: [CustomEvent<[swiper: Swiper, progress: number]>]
  swiperreachbeginning: [CustomEvent<[swiper: Swiper]>]
  swiperreachend: [CustomEvent<[swiper: Swiper]>]
  swipertoedge: [CustomEvent<[swiper: Swiper]>]
  swiperfromedge: [CustomEvent<[swiper: Swiper]>]
  swipersettranslate: [CustomEvent<[swiper: Swiper, translate: number]>]
  swipersettransition: [CustomEvent<[swiper: Swiper, transition: number]>]
  swiperresize: [CustomEvent<[swiper: Swiper]>]
  swiperobserverupdate: [CustomEvent<[swiper: Swiper]>]
  swiperbeforeloopfix: [CustomEvent<[swiper: Swiper]>]
  swiperloopfix: [CustomEvent<[swiper: Swiper]>]
  swiperbreakpoint: [CustomEvent<[swiper: Swiper, breakpointParams: SwiperOptions]>]
  swiperactiveindexchange: [CustomEvent<[swiper: Swiper]>]
  swipersnapindexchange: [CustomEvent<[swiper: Swiper]>]
  swiperrealindexchange: [CustomEvent<[swiper: Swiper]>]
  swiperafterinit: [CustomEvent<[swiper: Swiper]>]
  swiperbeforeinit: [CustomEvent<[swiper: Swiper]>]
  swiperbeforeresize: [CustomEvent<[swiper: Swiper]>]
  swiperbeforeslidechangestart: [CustomEvent<[swiper: Swiper]>]
  swiperbeforetransitionstart: [CustomEvent<[swiper: Swiper, speed: number, internal: any]>]
  swiperchangedirection: [CustomEvent<[swiper: Swiper]>]
  swiperdoubleclick: [CustomEvent<[swiper: Swiper, event: MouseEvent | TouchEvent | PointerEvent]>]
  swiperdestroy: [CustomEvent<[swiper: Swiper]>]
  swipermomentumbounce: [CustomEvent<[swiper: Swiper]>]
  swiperorientationchange: [CustomEvent<[swiper: Swiper]>]
  swiperslideresettransitionstart: [CustomEvent<[swiper: Swiper]>]
  swiperslideresettransitionend: [CustomEvent<[swiper: Swiper]>]
  swipersliderfirstmove: [CustomEvent<[swiper: Swiper, event: TouchEvent]>]
  swiperslideslengthchange: [CustomEvent<[swiper: Swiper]>]
  swiperslidesgridlengthchange: [CustomEvent<[swiper: Swiper]>]
  swipersnapgridlengthchange: [CustomEvent<[swiper: Swiper]>]
  swiperupdate: [CustomEvent<[swiper: Swiper]>]
  swiperlock: [CustomEvent<[swiper: Swiper]>]
  swiperunlock: [CustomEvent<[swiper: Swiper]>]
}

const props = defineProps<SwiperOptions>()

const emits = defineEmits<SwiperContainerEvents>()

const forwarded = useForwardPropsEmits(props, emits)

const swiperContainerRef = ref<SwiperContainer>()

const swiper = computed(() => swiperContainerRef.value?.swiper)

defineExpose({ swiper })
</script>
