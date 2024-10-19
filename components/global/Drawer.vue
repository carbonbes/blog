<template>
  <Html :style="'--drawer-footer-height: 0px'" />

  <DrawerRoot
    v-bind="forward"
    v-model:open="isOpen"
    :snapPoints
    :activeSnapPoint
    :fadeFromIndex="0"
    v-model:active-snap-point="activeSnapPoint"
  >
    <DrawerPortal>
      <DrawerOverlay class="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <DrawerContent
        aria-describedby=""
        v-bind="props"
        class="fixed right-0 bottom-0 left-0 w-full h-full max-h-[95%] bg-white rounded-t-2xl"
        ref="drawerContentRef"
        @closeAutoFocus="(e) => e.preventDefault()"
      >
        <VisuallyHidden>
          <DialogTitle />
        </VisuallyHidden>

        <Flex col center class="py-4 pb-8">
          <div class="absolute w-10 h-1 bg-gray-400 rounded-full" />
        </Flex>

        <Primitive
          asChild
          class="px-4 w-full h-[calc(100%-48px-var(--drawer-footer-height))] overflow-y-auto"
          :class="[contentClass, scrollableContentClasses]"
          ref="scrollableContentRef"
        >
          <slot />
        </Primitive>

        <Primitive
          v-if="$slots.footer"
          class="sticky bottom-0 z-[1]"
          :class="[footerClass]"
          asChild
        >
          <slot name="footer" />
        </Primitive>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script lang="ts" setup>
import { DialogTitle, useForwardPropsEmits } from 'radix-vue'
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  type DrawerRootProps,
  type DrawerRootEmits,
} from 'vaul-vue'

const props = defineProps<
  DrawerRootProps & {
    class?: string
    contentClass?: string
    footerClass?: string
  }
>()

const emits = defineEmits<DrawerRootEmits>()

const forward = useForwardPropsEmits(props, emits)

const isOpen = ref(false)

async function setOpen(value: boolean) {
  isOpen.value = value
}

const snapPoints = ref([0.5, 1])
const activeSnapPoint = ref(snapPoints.value[0])

function expandToMax() {
  activeSnapPoint.value = 1
}

const drawerContentRef = ref<InstanceType<typeof DrawerContent>>()
const drawerContentScrollableContentRef = ref<HTMLElement>()
const scrollableContentRef = ref<HTMLDivElement>()

watch(isOpen, async (v) => {
  await nextTick()

  if (v) {
    drawerContentScrollableContentRef.value = drawerContentRef.value?.$el
  }
})

const { isSwiping, direction: swipeDirection } = usePointerSwipe(
  drawerContentScrollableContentRef,
  { threshold: 0 }
)

const { y } = useScroll(scrollableContentRef)

const scrollableContentClasses = computed(() => ({
  '!overflow-hidden':
    activeSnapPoint.value !== 1 ||
    (activeSnapPoint.value === 1 &&
      y.value === 0 &&
      isSwiping.value &&
      swipeDirection.value === 'down'),

  '!overflow-y-auto':
    activeSnapPoint.value === 1 &&
    y.value === 0 &&
    isSwiping.value &&
    swipeDirection.value === 'up',
}))

defineExpose({ setOpen, expandToMax })
</script>
